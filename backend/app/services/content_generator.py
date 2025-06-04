import requests
import httpx
from bs4 import BeautifulSoup
from typing import List, Dict
# import openai
from app.core.config import settings
import logging

logger = logging.getLogger()


class ContentGenerator:
    def __init__(self):
        self.llm_api_url = settings.LLM_API_URL
        self.llm_api_key = settings.LLM_API_KEY
        self.llm_model = settings.LLM_MODEL

    async def crawl_web_content(self, urls: List[str]) -> List[Dict[str, str]]:
        """Crawl content from provided URLs."""
        contents = []
        for url in urls:
            try:
                response = requests.get(url)
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Extract title and main content
                title = soup.title.string if soup.title else ""
                main_content = soup.find('main') or soup.find('article') or soup.find('div', class_='content')
                content = main_content.get_text() if main_content else ""
                
                contents.append({
                    "url": url,
                    "title": title,
                    "content": content
                })

                logger.info(f"Crawled content: {contents}")
            except Exception as e:
                print(f"Error crawling {url}: {str(e)}")
                continue
        return contents

    async def generate_content(
        self,
        reference_contents: List[Dict[str, str]],
        product_info: Dict[str, str],
        target_keywords: List[str],
        purpose: str
    ) -> Dict[str, str]:
        """Generate content using OpenAI API."""
        
        # Prepare the prompt
        prompt = f"""As a professional marketing expert, create content with the following requirements:

Purpose: {purpose}
Target Keywords: {', '.join(target_keywords)}
Product Information: {product_info}

Reference Materials:
{self._format_references(reference_contents)}

Please create engaging, SEO-optimized content that incorporates the target keywords naturally while maintaining readability and value for the audience."""


        payload = {
            "messages": [
                {
                    "role": "system",
                    "content": "You are a professional marketing content writer with expertise in SEO and technical content."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "model": self.llm_model,
            "max_tokens": 2000,
            "temperature": 0.7,
            "stream": False
        }
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.post(
                    self.llm_api_url,
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {self.llm_api_key}"
                    },
                    json=payload
                )
                response.raise_for_status()
                result = response.json()
            
                generated_content = result["choices"][0]["message"]["content"]

                logger.info(f"Generated content: {generated_content}")
                
                return {
                    "title": self._extract_title(generated_content),
                    "content": generated_content
                }
        except httpx.RequestError as e:
            raise Exception(f"Error generating content: {e}") from e


    def _format_references(self, references: List[Dict[str, str]]) -> str:
        """Format reference contents for the prompt."""
        formatted = ""
        for ref in references:
            formatted += f"\nTitle: {ref['title']}\nContent: {ref['content'][:500]}...\n"
        return formatted

    def _extract_title(self, content: str) -> str:
        """Extract title from generated content."""
        lines = content.split('\n')
        for line in lines:
            if line.strip() and len(line.strip()) < 100:
                return line.strip()
        return "Generated Content" 