import os
import yaml
from pathlib import Path
from pydantic import BaseModel

class Skill(BaseModel):
    id: str
    name: str
    keywords: list[str]
    description: str
    prompt: str

class SkillLoader:
    def __init__(self, skills_dir: str = ".agents"):
        # Resolve path relative to current file to point to root daia/.agents
        base_path = Path(__file__).resolve().parents[3]
        self.skills_dir = base_path / skills_dir
        self.skills: dict[str, Skill] = {}
        self.load_all()

    def load_all(self):
        if not self.skills_dir.exists():
            print(f"Warning: Skills directory {self.skills_dir} not found.")
            return

        for folder_name in os.listdir(self.skills_dir):
            folder_path = self.skills_dir / folder_name
            if folder_path.is_dir():
                skill_file = folder_path / "SKILL.md"
                if skill_file.exists():
                    self._parse_file(skill_file, folder_name)

    def _parse_file(self, file_path: Path, folder_name: str):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        if content.startswith('---'):
            parts = content.split('---', 2)
            if len(parts) >= 3:
                frontmatter_raw = parts[1]
                prompt = parts[2].strip()
                
                try:
                    metadata = yaml.safe_load(frontmatter_raw) or {}
                    skill_id = metadata.get('id', folder_name) # Fallback to folder name
                    
                    skill = Skill(
                        id=skill_id,
                        name=metadata.get('name', folder_name),
                        keywords=metadata.get('keywords', []),
                        description=metadata.get('description', ''),
                        prompt=prompt
                    )
                    self.skills[skill.id] = skill
                except yaml.YAMLError as e:
                    print(f"Error parsing YAML in {file_path}: {e}")

    def get_skill(self, skill_id: str) -> Skill:
        return self.skills.get(skill_id)
