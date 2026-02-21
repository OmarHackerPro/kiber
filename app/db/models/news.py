from datetime import datetime
from sqlalchemy import String, Text, DateTime, Integer, func
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class NewsArticle(Base):
    __tablename__ = "news_articles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    tags: Mapped[list] = mapped_column(ARRAY(String), default=list)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    desc: Mapped[str] = mapped_column(Text, nullable=False)
    keywords: Mapped[list] = mapped_column(ARRAY(String), default=list)
    published_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True
    )
    severity: Mapped[str | None] = mapped_column(String(50), nullable=True)
    # news | analysis | report | advisory
    type: Mapped[str] = mapped_column(String(50), nullable=False)
    # research | deep-dives | beginner | dark-web | breaking
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    source_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), onupdate=func.now(), nullable=True
    )
