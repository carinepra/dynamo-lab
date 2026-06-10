// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Configuração do Playwright para testes do Quiz
 * @see https://playwright.dev/docs/test-configuration
 */
const staticServerCommand = `node -e "const http=require('http'),fs=require('fs'),path=require('path');const root=process.cwd();const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml; charset=utf-8','.woff2':'font/woff2'};http.createServer((req,res)=>{const urlPath=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const rel=urlPath==='/'?'index.html':urlPath.slice(1);const file=path.resolve(root,rel);const relative=path.relative(root,file);if(relative.startsWith('..')||path.isAbsolute(relative)){res.writeHead(403);return res.end('Forbidden');}fs.stat(file,(err,stat)=>{if(err||!stat.isFile()){res.writeHead(404);return res.end('Not found');}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);});}).listen(3002)"`;

module.exports = defineConfig({
  testDir: './tests',
  testIgnore: '**/unit/**',
  
  /* Tempo máximo por teste */
  timeout: 30 * 1000,
  
  /* Timeout global para toda a suite */
  globalTimeout: 5 * 60 * 1000, // 5 minutos total
  
  /* Configuração de expects */
  expect: {
    timeout: 5000
  },
  
  /* Rodar testes em paralelo */
  fullyParallel: true,
  
  /* Falhar build em CI se deixou .only no teste */
  forbidOnly: !!process.env.CI,
  
  /* Número de retries em CI */
  retries: process.env.CI ? 2 : 0,
  
  /* Workers em paralelo */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter */
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results.json' }]
  ],
  
  /* Configurações compartilhadas */
  use: {
    /* URL base */
    baseURL: 'http://localhost:3002',
    
    /* Screenshot em falhas */
    screenshot: 'only-on-failure',
    
    /* Video em falhas */
    video: 'retain-on-failure',
    
    /* Trace em falhas */
    trace: 'on-first-retry',
  },

  /* Projetos para diferentes browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    /* Testes mobile - DESABILITADOS (apenas web desktop) */
    // {
    //   name: 'Mobile Chrome',
    //   use: { 
    //     ...devices['Pixel 5'],
    //     hasTouch: true,
    //     isMobile: true,
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { 
    //     ...devices['iPhone 12'],
    //     hasTouch: true,
    //     isMobile: true,
    //   },
    // },
  ],

  /* Web server local para desenvolvimento */
  webServer: {
    command: staticServerCommand,
    url: 'http://localhost:3002',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});

