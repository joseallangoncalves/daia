import io
import re
from pypdf import PdfReader

class PDFParser:
    def __init__(self, filename: str):
        self.filename = filename

    def extract_text(self, file_bytes: bytes) -> str:
        """
        Extrai o texto do PDF inserindo tags de identificação de página.
        """
        reader = PdfReader(io.BytesIO(file_bytes))
        full_text = []

        for i, page in enumerate(reader.pages):
            page_num = i + 1
            text = page.extract_text()
            if text:
                header = f"\n--- [ARQUIVO: {self.filename} | PAGINA: {page_num}] ---\n"
                full_text.append(header + text)

        return "".join(full_text)

    def segment_text(self, full_text: str, keywords: list[str]) -> str:
        """
        Filtra apenas os blocos de texto que possuem as palavras chaves, economizando tokens da LLM.
        Aqui implementamos uma heurística simples: extrai a página inteira se contiver a palavra.
        """
        # Divide o texto pelas tags de página
        pages = re.split(r'\n---\s*\[ARQUIVO:.*?PAGINA:\s*\d+\]\s*---\n', full_text)
        headers = re.findall(r'\n---\s*\[ARQUIVO:.*?PAGINA:\s*\d+\]\s*---\n', full_text)
        
        # pages terá 1 elemento a mais no começo (vazio ou texto antes da 1a pagina)
        if len(pages) > len(headers):
            pages = pages[1:]

        segmented_text = []
        for header, page_content in zip(headers, pages):
            # Se encontrar qualquer das palavras chave (case insensitive) na pagina
            if any(re.search(re.escape(kw), page_content, re.IGNORECASE) for kw in keywords):
                segmented_text.append(header + page_content)

        return "".join(segmented_text)
