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
    def __init__(self, skills_dir: str = ".agents/skills"):
        # Resolve the path relative to the current file to avoid cwd issues
        base_path = Path(__file__).parent.parent
        self.skills_dir = base_path / skills_dir
        self.skills: dict[str, Skill] = {}
        self.load_all()

    def load_all(self):
        if not self.skills_dir.exists():
            print(f"Warning: Skills directory {self.skills_dir} not found.")
            return

        for filename in os.listdir(self.skills_dir):
            if filename.endswith(".md"):
                file_path = self.skills_dir / filename
                self._parse_file(file_path)

    def _parse_file(self, file_path: Path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        if content.startswith('---'):
            parts = content.split('---', 2)
            if len(parts) >= 3:
                frontmatter_raw = parts[1]
                prompt = parts[2].strip()
                
                try:
                    metadata = yaml.safe_load(frontmatter_raw)
                    if metadata and 'id' in metadata:
                        skill = Skill(
                            id=metadata['id'],
                            name=metadata.get('name', 'Unknown'),
                            keywords=metadata.get('keywords', []),
                            description=metadata.get('description', ''),
                            prompt=prompt
                        )
                        self.skills[skill.id] = skill
                except yaml.YAMLError as e:
                    print(f"Error parsing YAML in {file_path}: {e}")

    def get_skill(self, skill_id: str) -> Skill:
        return self.skills.get(skill_id)
