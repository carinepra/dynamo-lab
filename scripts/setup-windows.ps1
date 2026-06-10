param(
    [ValidateSet("setup", "start", "stop", "test")]
    [string]$Action = "setup"
)

$ErrorActionPreference = "Stop"

$RootDir = Split-Path -Parent $PSScriptRoot
$ToolsDir = Join-Path $RootDir ".tools"
$DownloadsDir = Join-Path $ToolsDir "downloads"
$PidDir = Join-Path $ToolsDir "pids"
$BackendDir = Join-Path $RootDir "copilot\backend"
$QuizWebDir = Join-Path $RootDir "quiz-web"
$DynamoDir = Join-Path $ToolsDir "dynamodb-local"
$JreDir = Join-Path $ToolsDir "jre"
$VenvPython = Join-Path $BackendDir ".venv\Scripts\python.exe"
$FrontendServerScript = Join-Path $ToolsDir "frontend-server.py"

New-Item -ItemType Directory -Force -Path $ToolsDir, $DownloadsDir, $PidDir | Out-Null

function Write-Step($Message) {
    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Download-File($Url, $OutFile) {
    if (Test-Path $OutFile) {
        Write-Host "Arquivo ja existe: $OutFile"
        return
    }

    Write-Host "Baixando: $Url"
    $ProgressPreference = "SilentlyContinue"
    Invoke-WebRequest -Uri $Url -OutFile $OutFile
}

function Get-PythonCommand {
    $python = Get-Command python -ErrorAction SilentlyContinue
    if ($python) {
        return $python.Source
    }

    $commonPaths = @(
        (Join-Path $env:LOCALAPPDATA "Programs\Python\Python311\python.exe"),
        (Join-Path $env:LOCALAPPDATA "Programs\Python\Python312\python.exe"),
        (Join-Path $env:LOCALAPPDATA "Programs\Python\Python313\python.exe")
    )

    foreach ($path in $commonPaths) {
        if (Test-Path $path) {
            return $path
        }
    }

    return $null
}

function Ensure-Python {
    $python = Get-PythonCommand
    if ($python) {
        Write-Host "Python encontrado: $python"
        return $python
    }

    Write-Step "Instalando Python 3.11 para o usuario atual"
    $installer = Join-Path $DownloadsDir "python-3.11.9-amd64.exe"
    Download-File "https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe" $installer

    Start-Process -FilePath $installer -ArgumentList "/quiet", "InstallAllUsers=0", "PrependPath=1", "Include_pip=1", "Include_launcher=1" -Wait

    $python = Get-PythonCommand
    if (-not $python) {
        throw "Python foi instalado, mas nao foi encontrado. Feche e reabra o terminal e rode novamente."
    }

    return $python
}

function Get-JavaCommand {
    $java = Get-Command java -ErrorAction SilentlyContinue
    if ($java) {
        return $java.Source
    }

    $localJava = Join-Path $JreDir "bin\java.exe"
    if (Test-Path $localJava) {
        return $localJava
    }

    return $null
}

function Ensure-Java {
    $java = Get-JavaCommand
    if ($java) {
        Write-Host "Java encontrado: $java"
        return $java
    }

    Write-Step "Baixando JRE portatil para DynamoDB Local"
    $zip = Join-Path $DownloadsDir "temurin-jre-21.zip"
    $tmpDir = Join-Path $ToolsDir "jre-tmp"
    Download-File "https://api.adoptium.net/v3/binary/latest/21/ga/windows/x64/jre/hotspot/normal/eclipse?project=jdk" $zip

    if (Test-Path $tmpDir) {
        Remove-Item -Recurse -Force $tmpDir
    }
    if (Test-Path $JreDir) {
        Remove-Item -Recurse -Force $JreDir
    }

    Expand-Archive -Path $zip -DestinationPath $tmpDir -Force
    $expandedRoot = Get-ChildItem $tmpDir | Where-Object { $_.PSIsContainer } | Select-Object -First 1
    if (-not $expandedRoot) {
        throw "Nao foi possivel localizar o JRE extraido."
    }
    New-Item -ItemType Directory -Force -Path $JreDir | Out-Null
    Copy-Item -Path (Join-Path $expandedRoot.FullName "*") -Destination $JreDir -Recurse -Force
    Remove-Item -Recurse -Force $tmpDir

    $java = Get-JavaCommand
    if (-not $java) {
        throw "JRE foi baixado, mas java.exe nao foi encontrado."
    }

    return $java
}

function Ensure-DynamoDBLocal {
    if (Test-Path (Join-Path $DynamoDir "DynamoDBLocal.jar")) {
        Write-Host "DynamoDB Local encontrado: $DynamoDir"
        return
    }

    Write-Step "Baixando DynamoDB Local"
    $zip = Join-Path $DownloadsDir "dynamodb_local_latest.zip"
    Download-File "https://s3.us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_latest.zip" $zip

    New-Item -ItemType Directory -Force -Path $DynamoDir | Out-Null
    Expand-Archive -Path $zip -DestinationPath $DynamoDir -Force
}

function Ensure-BackendVenv {
    param(
        [bool]$InstallDependencies = $true
    )

    $python = Ensure-Python
    $createdVenv = $false

    if (-not (Test-Path $VenvPython)) {
        Write-Step "Criando venv do backend"
        & $python -m venv (Join-Path $BackendDir ".venv")
        $createdVenv = $true
    }

    if ($InstallDependencies -or $createdVenv) {
        Write-Step "Instalando dependencias do backend"
        & $VenvPython -m pip install --upgrade pip
        & $VenvPython -m pip install -r (Join-Path $BackendDir "requirements.txt")
    }
}

function Save-Pid($Name, $Process) {
    Set-Content -Path (Join-Path $PidDir "$Name.pid") -Value $Process.Id
}

function Stop-ByPid($Name) {
    $pidFile = Join-Path $PidDir "$Name.pid"
    if (-not (Test-Path $pidFile)) {
        return
    }

    $processId = Get-Content $pidFile
    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "Parando $Name (PID $processId)"
        Stop-Process -Id $processId -Force
    }
    Remove-Item $pidFile -Force
}

function Start-DynamoDBLocal {
    $java = Ensure-Java
    Ensure-DynamoDBLocal

    $pidFile = Join-Path $PidDir "dynamodb.pid"
    if (Test-Path $pidFile) {
        $existing = Get-Process -Id (Get-Content $pidFile) -ErrorAction SilentlyContinue
        if ($existing) {
            Write-Host "DynamoDB Local ja esta rodando."
            return
        }
    }

    Write-Step "Iniciando DynamoDB Local em http://localhost:17000"
    $arguments = @(
        "-Djava.library.path=$DynamoDir\DynamoDBLocal_lib",
        "-jar",
        "$DynamoDir\DynamoDBLocal.jar",
        "-sharedDb",
        "-port",
        "17000"
    )
    $process = Start-Process -FilePath $java -ArgumentList $arguments -WorkingDirectory $DynamoDir -WindowStyle Minimized -PassThru
    Save-Pid "dynamodb" $process
    Start-Sleep -Seconds 3
}

function Start-Backend {
    Ensure-BackendVenv -InstallDependencies $false

    $pidFile = Join-Path $PidDir "backend.pid"
    if (Test-Path $pidFile) {
        $existing = Get-Process -Id (Get-Content $pidFile) -ErrorAction SilentlyContinue
        if ($existing) {
            Write-Host "Backend ja esta rodando."
            return
        }
    }

    Write-Step "Iniciando backend em http://localhost:17091"
    $env:QUIZ_MODE = "closed"
    $env:DYNAMODB_ENDPOINT = "http://localhost:17000"
    $env:DYNAMODB_EXECUTION_ENABLED = "false"
    $env:OPENAI_API_KEY = ""
    $env:CORS_ORIGINS = "http://localhost:17080,http://127.0.0.1:17080"

    $process = Start-Process -FilePath $VenvPython -ArgumentList "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "17091" -WorkingDirectory $BackendDir -WindowStyle Minimized -PassThru
    Save-Pid "backend" $process
    Start-Sleep -Seconds 3
}

function Start-Frontend {
    Ensure-Python | Out-Null

    $pidFile = Join-Path $PidDir "frontend.pid"
    if (Test-Path $pidFile) {
        $existing = Get-Process -Id (Get-Content $pidFile) -ErrorAction SilentlyContinue
        if ($existing) {
            Write-Host "Frontend ja esta rodando."
            return
        }
    }

    Write-Step "Iniciando frontend em http://localhost:17080"
    $serverCode = @"
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote

root_dir = sys.argv[1]
quiz_dir = os.path.join(root_dir, 'quiz-web')
labs_dir = os.path.join(root_dir, 'labs')

class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        path = path.split('?', 1)[0].split('#', 1)[0]
        path = unquote(path)

        if path == '/':
            return os.path.join(quiz_dir, 'index.html')

        if path.startswith('/labs/'):
            relative = path[len('/labs/'):]
            return os.path.join(labs_dir, *[part for part in relative.split('/') if part])

        relative = path.lstrip('/')
        return os.path.join(quiz_dir, *[part for part in relative.split('/') if part])

    def log_message(self, format, *args):
        return

ThreadingHTTPServer(('0.0.0.0', 17080), Handler).serve_forever()
"@
    Set-Content -Path $FrontendServerScript -Value $serverCode -Encoding UTF8
    $arguments = "`"$FrontendServerScript`" `"$RootDir`""
    $process = Start-Process -FilePath $VenvPython -ArgumentList $arguments -WorkingDirectory $RootDir -WindowStyle Minimized -PassThru
    Save-Pid "frontend" $process
    Start-Sleep -Seconds 2
}

function Invoke-BackendTests {
    Ensure-BackendVenv

    Write-Step "Validando backend"
    Push-Location $BackendDir
    try {
        & $VenvPython -m py_compile src/quiz/question_repository.py src/validators/hybrid_validator.py src/validators/dynamodb_executor.py src/api/quiz_routes.py src/models/schemas.py tests/test_question_repository.py tests/test_hybrid_validator.py
        & $VenvPython -m pytest --tb=short
    }
    finally {
        Pop-Location
    }
}

switch ($Action) {
    "setup" {
        Ensure-Java | Out-Null
        Ensure-DynamoDBLocal
        Ensure-BackendVenv
        Write-Host ""
        Write-Host "Setup Windows concluido." -ForegroundColor Green
        Write-Host "Para iniciar: powershell -ExecutionPolicy Bypass -File scripts\setup-windows.ps1 -Action start"
    }
    "start" {
        Start-DynamoDBLocal
        Start-Backend
        Start-Frontend
        Write-Host ""
        Write-Host "Ambiente local iniciado:" -ForegroundColor Green
        Write-Host "Frontend: http://localhost:17080"
        Write-Host "Backend:  http://localhost:17091/health"
        Write-Host "API Docs: http://localhost:17091/docs"
    }
    "stop" {
        Stop-ByPid "frontend"
        Stop-ByPid "backend"
        Stop-ByPid "dynamodb"
        Write-Host "Ambiente local parado." -ForegroundColor Green
    }
    "test" {
        Invoke-BackendTests
    }
}
