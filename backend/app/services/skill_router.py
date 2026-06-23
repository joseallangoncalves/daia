import re
from .skill_loader import SkillLoader, Skill

class SkillRouter:
    def __init__(self):
        self.loader = SkillLoader()

    def determine_skill(self, text_segment: str) -> Skill | None:
        """
        Analisa o segmento de texto e decide qual skill usar com base nas keywords.
        Se nenhuma combinar, retorna None.
        """
        for skill_id, skill in self.loader.skills.items():
            if any(re.search(re.escape(kw), text_segment, re.IGNORECASE) for kw in skill.keywords):
                return skill
        return None

    def get_skill_by_id(self, skill_id: str) -> Skill:
        return self.loader.get_skill(skill_id)
