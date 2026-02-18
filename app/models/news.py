from pydantic import BaseModel
from typing import List, Optional


class NewsItem(BaseModel):
    id: str
    tags: List[str]
    title: str
    desc: str
    keywords: List[str]
    time: str
    severity: Optional[str] = None
    type: str  # news | analysis | report | advisory
    category: str  # research | deep-dives | beginner | dark-web | breaking


class NewsListResponse(BaseModel):
    items: List[NewsItem]
    total: int
