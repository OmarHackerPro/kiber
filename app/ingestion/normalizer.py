import calendar
import hashlib
import re
from datetime import datetime, timezone
from html.parser import HTMLParser
from typing import Callable, Optional

import feedparser

from app.ingestion.sources import FeedSource

# Type alias for a normalized article dict ready for DB insertion.
# Keys match NewsArticle ORM column names exactly.
NormalizedArticle = dict


# ---------------------------------------------------------------------------
# HTML stripping — stdlib only, no extra dependency
# ---------------------------------------------------------------------------

class _MLStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reset()
        self._fed: list[str] = []

    def handle_data(self, d: str) -> None:
        self._fed.append(d)

    def get_data(self) -> str:
        return " ".join(self._fed)


def strip_html(raw: str) -> str:
    if not raw:
        return ""
    s = _MLStripper()
    s.feed(raw)
    return re.sub(r"\s+", " ", s.get_data()).strip()


# ---------------------------------------------------------------------------
# Slug construction
# ---------------------------------------------------------------------------

def _slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")[:200]


def build_slug(title: str, guid: str) -> str:
    """slugified title + 8-char SHA256 hash of the guid.

    Stable: same guid always yields the same slug.
    Unique: hash suffix prevents collisions between articles with similar titles.
    """
    base = _slugify(title)
    suffix = hashlib.sha256(guid.encode()).hexdigest()[:8]
    return f"{base}-{suffix}"


# ---------------------------------------------------------------------------
# Date parsing
# ---------------------------------------------------------------------------

def _parse_date(entry: feedparser.FeedParserDict) -> datetime:
    """Convert feedparser's published_parsed (UTC time.struct_time) to datetime.
    Falls back to now() if absent or unparseable.
    """
    if getattr(entry, "published_parsed", None):
        return datetime.fromtimestamp(
            calendar.timegm(entry.published_parsed), tz=timezone.utc
        )
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# Per-feed normalizers
# ---------------------------------------------------------------------------

def normalize_thn(
    entry: feedparser.FeedParserDict,
    source: FeedSource,
) -> Optional[NormalizedArticle]:
    """Normalizer for The Hacker News RSS feed.

    THN entry fields used:
      entry.title           plain text headline
      entry.link            canonical article URL
      entry.id / entry.guid unique identifier (may equal link)
      entry.summary         CDATA HTML description
      entry.published_parsed UTC struct_time
    """
    title = (entry.get("title") or "").strip()
    link  = (entry.get("link")  or "").strip()

    if not title or not link:
        return None  # signals ingester to skip this entry

    guid = (entry.get("id") or entry.get("guid") or link).strip()
    raw_desc = entry.get("summary") or entry.get("description") or ""
    desc = strip_html(raw_desc).strip() or title

    return NormalizedArticle(
        slug=build_slug(title, guid),
        title=title[:500],
        desc=desc,
        tags=[],
        keywords=[],
        published_at=_parse_date(entry),
        severity=source["default_severity"],
        type=source["default_type"],
        category=source["default_category"],
        source_url=link[:2048],
    )


def normalize_generic(
    entry: feedparser.FeedParserDict,
    source: FeedSource,
) -> Optional[NormalizedArticle]:
    """Fallback normalizer for standard RSS 2.0 / Atom feeds.
    Copy and rename this when adding a feed that needs custom field mapping.
    """
    title = (entry.get("title") or "").strip()
    link  = (entry.get("link")  or "").strip()

    if not title or not link:
        return None

    guid = (entry.get("id") or link).strip()
    content_list = entry.get("content") or []
    raw_desc = (
        entry.get("summary")
        or (content_list[0].get("value") if content_list else "")
        or entry.get("description")
        or ""
    )
    desc = strip_html(raw_desc).strip() or title

    return NormalizedArticle(
        slug=build_slug(title, guid),
        title=title[:500],
        desc=desc,
        tags=[],
        keywords=[],
        published_at=_parse_date(entry),
        severity=source["default_severity"],
        type=source["default_type"],
        category=source["default_category"],
        source_url=link[:2048],
    )


# ---------------------------------------------------------------------------
# Registry — string key → callable
# Keeps FeedSource as pure serializable data (no Callable references there).
# ---------------------------------------------------------------------------

NORMALIZER_REGISTRY: dict[str, Callable] = {
    "thn":     normalize_thn,
    "generic": normalize_generic,
}
