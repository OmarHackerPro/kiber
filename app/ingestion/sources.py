from typing import Optional, TypedDict


class FeedSource(TypedDict):
    name: str
    url: str
    default_type: str       # news | analysis | report | advisory
    default_category: str   # research | deep-dives | beginner | dark-web | breaking
    default_severity: Optional[str]
    normalizer: str         # key into NORMALIZER_REGISTRY in normalizer.py


# To add a new feed: append one FeedSource entry here. Nothing else changes.
FEED_SOURCES: list[FeedSource] = [
    FeedSource(
        name="The Hacker News",
        url="https://feeds.feedburner.com/TheHackersNews",
        default_type="news",
        default_category="breaking",
        default_severity=None,
        normalizer="thn",
    ),
    # Example — uncomment and fill in to add another source:
    # FeedSource(
    #     name="Krebs on Security",
    #     url="https://krebsonsecurity.com/feed/",
    #     default_type="analysis",
    #     default_category="deep-dives",
    #     default_severity=None,
    #     normalizer="generic",
    # ),
]
