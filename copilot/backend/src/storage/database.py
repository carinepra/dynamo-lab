"""
SQLite Storage - Persistência de sessões e submissões
"""
import sqlite3
import json
from datetime import datetime
from typing import Optional, List, Dict, Any
from pathlib import Path
from contextlib import contextmanager


class QuizDatabase:
    """Gerenciador de banco SQLite"""
    
    def __init__(self, db_path: str = "data/quiz.db"):
        """Inicializa conexão com SQLite"""
        self.db_path = db_path
        
        # Criar diretório se não existir
        Path(db_path).parent.mkdir(parents=True, exist_ok=True)
        
        # Configurar SQLite para melhor concorrência
        self._setup_database()
        self._init_schema()
    
    def _setup_database(self):
        """Configura database para melhor performance e concorrência"""
        with self._get_connection() as conn:
            # Habilitar Write-Ahead Logging (WAL) para melhor concorrência
            conn.execute("PRAGMA journal_mode=WAL")
            # Timeout mais longo para locks
            conn.execute("PRAGMA busy_timeout=5000")
    
    @contextmanager
    def _get_connection(self):
        """Context manager para conexão SQLite (garante fechamento)"""
        conn = sqlite3.connect(self.db_path, timeout=10.0)
        conn.row_factory = sqlite3.Row  # Permite acesso por nome de coluna
        try:
            yield conn
            conn.commit()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()
    
    def _init_schema(self):
        """Cria tabelas se não existirem"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            # Tabela de sessões
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS sessions (
                    session_id TEXT PRIMARY KEY,
                    player_name TEXT NOT NULL,
                    language TEXT NOT NULL,
                    content_language TEXT DEFAULT 'en',
                    lab TEXT,
                    started_at TEXT NOT NULL,
                    completed_at TEXT,
                    current_question_index INTEGER DEFAULT 0,
                    total_xp INTEGER DEFAULT 0,
                    hints_used INTEGER DEFAULT 0
                )
            """)
            
            cursor.execute("PRAGMA table_info(sessions)")
            columns = {row["name"] for row in cursor.fetchall()}
            if "lab" not in columns:
                cursor.execute("ALTER TABLE sessions ADD COLUMN lab TEXT")
            if "content_language" not in columns:
                cursor.execute("ALTER TABLE sessions ADD COLUMN content_language TEXT DEFAULT 'en'")
            
            # Tabela de submissões
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS submissions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT NOT NULL,
                    question_id TEXT NOT NULL,
                    submitted_code TEXT,
                    submitted_answer TEXT,
                    is_correct INTEGER NOT NULL,
                    xp_earned INTEGER NOT NULL,
                    execution_time_ms REAL,
                    items_scanned INTEGER,
                    feedback TEXT NOT NULL,
                    submitted_at TEXT NOT NULL,
                    FOREIGN KEY (session_id) REFERENCES sessions(session_id)
                )
            """)
    
    # ===== SESSIONS =====
    
    def create_session(
        self,
        session_id: str,
        player_name: str,
        language: str,
        lab: Optional[str] = None,
        content_language: str = "en"
    ) -> Dict[str, Any]:
        """Cria nova sessão"""
        now = datetime.utcnow().isoformat()
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO sessions (
                    session_id, player_name, language, content_language, lab, started_at
                ) VALUES (?, ?, ?, ?, ?, ?)
            """, (session_id, player_name, language, content_language, lab, now))
        
        return {
            "session_id": session_id,
            "player_name": player_name,
            "language": language,
            "content_language": content_language,
            "lab": lab,
            "started_at": now,
            "current_question_index": 0,
            "total_xp": 0,
            "hints_used": 0
        }
    
    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Busca sessão por ID"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT * FROM sessions WHERE session_id = ?
            """, (session_id,))
            row = cursor.fetchone()
        
        if not row:
            return None
        
        return dict(row)
    
    def update_session_xp(self, session_id: str, xp_to_add: int):
        """Atualiza XP da sessão"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE sessions
                SET total_xp = total_xp + ?
                WHERE session_id = ?
            """, (xp_to_add, session_id))
    
    def increment_question_index(self, session_id: str):
        """Avança para próxima questão"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE sessions
                SET current_question_index = current_question_index + 1
                WHERE session_id = ?
            """, (session_id,))
    
    def increment_hints_used(self, session_id: str):
        """Incrementa contador de hints"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE sessions
                SET hints_used = hints_used + 1
                WHERE session_id = ?
            """, (session_id,))
    
    def complete_session(self, session_id: str):
        """Marca sessão como completa"""
        now = datetime.utcnow().isoformat()
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE sessions
                SET completed_at = ?
                WHERE session_id = ?
            """, (now, session_id))
    
    # ===== SUBMISSIONS =====
    
    def save_submission(
        self,
        session_id: str,
        question_id: str,
        is_correct: bool,
        xp_earned: int,
        feedback: str,
        submitted_code: Optional[str] = None,
        submitted_answer: Optional[str] = None,
        execution_time_ms: Optional[float] = None,
        items_scanned: Optional[int] = None
    ) -> int:
        """Salva submissão de questão"""
        now = datetime.utcnow().isoformat()
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO submissions (
                    session_id, question_id, submitted_code, submitted_answer,
                    is_correct, xp_earned, execution_time_ms, items_scanned,
                    feedback, submitted_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                session_id, question_id, submitted_code, submitted_answer,
                1 if is_correct else 0, xp_earned, execution_time_ms,
                items_scanned, feedback, now
            ))
            submission_id = cursor.lastrowid
        
        return submission_id
    
    def get_submissions(self, session_id: str) -> List[Dict[str, Any]]:
        """Busca todas submissões de uma sessão"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT * FROM submissions
                WHERE session_id = ?
                ORDER BY submitted_at ASC
            """, (session_id,))
            rows = cursor.fetchall()
        
        return [dict(row) for row in rows]
    
    def get_session_stats(self, session_id: str) -> Dict[str, Any]:
        """Estatísticas completas da sessão"""
        session = self.get_session(session_id)
        if not session:
            return {}
        
        submissions = self.get_submissions(session_id)
        
        correct_count = sum(1 for s in submissions if s['is_correct'])
        total_count = len(submissions)
        
        # Calcular tempo total (se completo)
        total_time_seconds = 0
        if session.get('completed_at'):
            started = datetime.fromisoformat(session['started_at'])
            completed = datetime.fromisoformat(session['completed_at'])
            total_time_seconds = int((completed - started).total_seconds())
        
        return {
            "session": session,
            "submissions": submissions,
            "questions_correct": correct_count,
            "questions_total": total_count,
            "total_time_seconds": total_time_seconds,
            "percentage": (correct_count / total_count * 100) if total_count > 0 else 0
        }


# Singleton global
_db_instance: Optional[QuizDatabase] = None


def get_database() -> QuizDatabase:
    """Retorna instância singleton do database"""
    global _db_instance
    if _db_instance is None:
        _db_instance = QuizDatabase()
    return _db_instance
