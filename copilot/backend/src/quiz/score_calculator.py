"""
Score Calculator - Sistema de XP e Ranking
"""
from typing import Dict, Tuple


class ScoreCalculator:
    """Calcula XP e determina ranking baseado em performance"""
    
    # Ranks e seus requisitos de XP
    RANKS = {
        "LENDA": (1400, 1500),     # 93%+
        "PRINCIPAL": (1200, 1399),  # 80%+
        "SENIOR": (1000, 1199),     # 67%+
        "PLENO": (700, 999),        # 47%+
        "JUNIOR": (0, 699),         # < 47%
    }
    
    # Emojis por rank
    RANK_EMOJIS = {
        "LENDA": "⚔️",
        "PRINCIPAL": "💎",
        "SENIOR": "🏆",
        "PLENO": "⭐",
        "JUNIOR": "🌟",
    }
    
    # Penalidades
    HINT_PENALTY = 10  # XP perdido por hint
    
    def __init__(self, max_possible_xp: int = 1500):
        """
        Inicializa calculador
        
        Args:
            max_possible_xp: XP máximo possível (soma de todas questões)
        """
        self.max_possible_xp = max_possible_xp
    
    def calculate_question_xp(
        self,
        base_xp: int,
        is_correct: bool,
        execution_time_ms: float = 0,
        max_time_ms: float = 50,
        performance_bonus: int = 0,
        hint_used: bool = False
    ) -> Tuple[int, str]:
        """
        Calcula XP ganho em uma questão
        
        Args:
            base_xp: XP base da questão (ex: 200)
            is_correct: Se a resposta está correta
            execution_time_ms: Tempo de execução
            max_time_ms: Tempo máximo aceitável
            performance_bonus: Bônus adicional (do hybrid validator)
            hint_used: Se usou hint
        
        Returns:
            (xp_earned, breakdown_text)
        """
        
        if not is_correct:
            return (0, "❌ Resposta incorreta: 0 XP")
        
        # XP base
        xp = base_xp
        breakdown = [f"Base: {base_xp} XP"]
        
        # Bônus de performance (já calculado pelo hybrid validator)
        if performance_bonus > 0:
            xp += performance_bonus
            breakdown.append(f"⚡ Performance: +{performance_bonus} XP")
        
        # Penalidade por hint
        if hint_used:
            xp -= self.HINT_PENALTY
            breakdown.append(f"💡 Hint usado: -{self.HINT_PENALTY} XP")
        
        # Garantir mínimo
        xp = max(0, xp)
        
        breakdown_text = " | ".join(breakdown) + f" = **{xp} XP**"
        
        return (xp, breakdown_text)
    
    def get_rank(self, total_xp: int) -> Dict[str, any]:
        """
        Determina rank baseado no XP total
        
        Args:
            total_xp: XP total acumulado
        
        Returns:
            {
                "rank": str,
                "emoji": str,
                "min_xp": int,
                "max_xp": int,
                "percentage": float,
                "next_rank": Optional[str],
                "xp_to_next": Optional[int]
            }
        """
        
        # Encontrar rank atual
        current_rank = "JUNIOR"
        for rank_name, (min_xp, max_xp) in self.RANKS.items():
            if min_xp <= total_xp <= max_xp:
                current_rank = rank_name
                break
        
        rank_info = {
            "rank": current_rank,
            "emoji": self.RANK_EMOJIS[current_rank],
            "min_xp": self.RANKS[current_rank][0],
            "max_xp": self.RANKS[current_rank][1],
            "percentage": (total_xp / self.max_possible_xp) * 100,
            "next_rank": None,
            "xp_to_next": None
        }
        
        # Calcular próximo rank
        rank_order = ["JUNIOR", "PLENO", "SENIOR", "PRINCIPAL", "LENDA"]
        current_index = rank_order.index(current_rank)
        
        if current_index < len(rank_order) - 1:
            next_rank = rank_order[current_index + 1]
            next_rank_min = self.RANKS[next_rank][0]
            rank_info["next_rank"] = next_rank
            rank_info["xp_to_next"] = max(0, next_rank_min - total_xp)
        
        return rank_info
    
    def calculate_final_stats(
        self,
        submissions: list,
        total_time_seconds: int,
        hints_used: int
    ) -> Dict[str, any]:
        """
        Calcula estatísticas finais do quiz
        
        Args:
            submissions: Lista de submissões
            total_time_seconds: Tempo total gasto
            hints_used: Número de hints usados
        
        Returns:
            Estatísticas completas
        """
        
        total_xp = sum(s.get("xp_earned", 0) for s in submissions)
        correct_count = sum(1 for s in submissions if s.get("is_correct", False))
        total_count = len(submissions)
        
        rank_info = self.get_rank(total_xp)
        
        # Formatação de tempo
        minutes = total_time_seconds // 60
        seconds = total_time_seconds % 60
        time_formatted = f"{minutes}m {seconds}s"
        
        # Performance geral
        avg_execution_time = 0
        if total_count > 0:
            exec_times = [
                s.get("execution_time_ms", 0)
                for s in submissions
                if s.get("execution_time_ms")
            ]
            if exec_times:
                avg_execution_time = sum(exec_times) / len(exec_times)
        
        return {
            "total_xp": total_xp,
            "max_possible_xp": self.max_possible_xp,
            "percentage": round((total_xp / self.max_possible_xp) * 100, 1),
            "rank": rank_info["rank"],
            "rank_emoji": rank_info["emoji"],
            "questions_correct": correct_count,
            "questions_total": total_count,
            "total_time": time_formatted,
            "total_time_seconds": total_time_seconds,
            "hints_used": hints_used,
            "avg_execution_time_ms": round(avg_execution_time, 2),
            "next_rank": rank_info.get("next_rank"),
            "xp_to_next": rank_info.get("xp_to_next"),
        }
    
    def get_performance_message(self, rank: str) -> str:
        """Retorna mensagem motivacional por rank"""
        
        messages = {
            "LENDA": (
                "🎉 **LENDÁRIO!** Você dominou o DynamoDB Single-Table! "
                "Zelda e Link estão livres graças à sua maestria! "
                "730ms → < 30ms = **29x mais rápido!**"
            ),
            "PRINCIPAL": (
                "💎 **EXCELENTE!** Você tem sólido conhecimento de DynamoDB! "
                "Continue praticando para alcançar a maestria lendária!"
            ),
            "SENIOR": (
                "🏆 **MUITO BOM!** Você entende bem os conceitos! "
                "Revise os padrões de Query para performance ainda melhor."
            ),
            "PLENO": (
                "⭐ **BOM COMEÇO!** Você está no caminho certo! "
                "Pratique mais Query patterns e otimizações."
            ),
            "JUNIOR": (
                "🌟 **CONTINUE APRENDENDO!** DynamoDB é desafiador no início. "
                "Revise os labs e pratique os Query patterns básicos!"
            ),
        }
        
        return messages.get(rank, "Parabéns por completar o quiz!")

