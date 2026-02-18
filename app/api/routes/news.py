from fastapi import APIRouter, Query
from typing import List, Optional

from app.models.news import NewsItem, NewsListResponse

router = APIRouter(prefix="/news", tags=["news"])

# Seed data — replace with DB / RSS integration later
_NEWS: List[NewsItem] = [
    NewsItem(id="card1",  tags=["CISA", "Critical"],        title="CISA Adds Critical VPN Flaw to Known Exploited Catalog",      desc="Federal agencies must patch within two weeks as attacks escalate.",              keywords=["CVE-2026-0001", "VPN", "RCE", "Zero-Day"],      time="15m",     severity="high", type="advisory", category="research"),
    NewsItem(id="card2",  tags=["Mandiant", "Report"],      title="APT41 Expands Supply Chain Attacks in 2026",                  desc="New report details evolving TTPs and infrastructure used by the group.",        keywords=["APT41", "Supply Chain", "Mandiant"],            time="3h 12m",  severity=None,   type="report",   category="deep-dives"),
    NewsItem(id="card3",  tags=["Ransomware"],               title="New Ransomware Variant Targets Healthcare Sector",            desc="Hospitals and clinics report encrypted systems and ransom demands.",            keywords=["Ransomware", "Healthcare", "Encryption"],       time="4h 25m",  severity="high", type="news",     category="research"),
    NewsItem(id="card4",  tags=["CISA"],                    title="Emergency Directive: Patch VPN Zero-Day by Friday",           desc="CISA orders federal agencies to apply vendor patches immediately.",             keywords=["CISA", "Directive", "VPN"],                     time="5h",      severity=None,   type="advisory", category="research"),
    NewsItem(id="card5",  tags=["Bug Bounty", "Report"],    title="Major Bug Bounty Program Doubles Critical Payouts",           desc="Platform announces increased rewards for critical vulnerabilities.",            keywords=["Bug Bounty", "Payouts", "Critical"],            time="6h 30m",  severity=None,   type="news",     category="beginner"),
    NewsItem(id="card6",  tags=["APT29", "Breaches"],       title="APT29 Campaign Linked to Recent Government Breaches",         desc="Intelligence agencies attribute multiple incidents to same actor.",             keywords=["APT29", "Breach", "Government"],                time="8h",      severity="high", type="analysis", category="deep-dives"),
    NewsItem(id="card7",  tags=["Malware", "Critical"],     title="Stealer Malware Spreads via Fake Software Updates",           desc="Users tricked into installing trojanized installers from spoofed sites.",       keywords=["Malware", "Stealer", "Fake Updates"],           time="10h",     severity=None,   type="news",     category="beginner"),
    NewsItem(id="card8",  tags=["Pentest", "Report"],       title="Penetration Testing Framework Updated for Cloud",             desc="New modules added for AWS, Azure, and GCP assessments.",                      keywords=["Pentest", "Cloud", "AWS"],                      time="12h",     severity=None,   type="report",   category="deep-dives"),
    NewsItem(id="card9",  tags=["Zero-Day", "Critical"],    title="Second Zero-Day in Same VPN Product Under Attack",            desc="Researchers confirm exploitation of additional vulnerability.",                keywords=["Zero-Day", "VPN", "CVE"],                       time="14h",     severity="high", type="news",     category="research"),
    NewsItem(id="card10", tags=["Threat Intel"],             title="IOC Database Updated with Latest Campaign Signatures",        desc="New indicators of compromise available for detection rules.",                  keywords=["IOC", "Threat Intel", "Signatures"],            time="16h",     severity=None,   type="advisory", category="research"),
    NewsItem(id="card11", tags=["CISA", "Report"],          title="CISA Releases Advisory on RDP Hardening",                    desc="Best practices to reduce risk of RDP-based attacks.",                         keywords=["CISA", "RDP", "Hardening"],                     time="18h",     severity=None,   type="advisory", category="beginner"),
    NewsItem(id="card12", tags=["Breaches"],                 title="Retail Giant Discloses Third-Party Data Exposure",           desc="Supplier breach may have exposed customer records.",                          keywords=["Breach", "Retail", "Third-Party"],              time="20h",     severity="high", type="news",     category="dark-web"),
]


@router.get("/", response_model=NewsListResponse)
async def get_news(
    category: Optional[str] = Query(None, description="Filter by category"),
    type: Optional[str] = Query(None, description="Filter by type (news|analysis|report|advisory)"),
    severity: Optional[str] = Query(None, description="Filter by severity (high)"),
    limit: int = Query(12, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    items = _NEWS

    if category:
        items = [i for i in items if i.category == category]
    if type:
        items = [i for i in items if i.type == type]
    if severity:
        items = [i for i in items if i.severity == severity]

    total = len(items)
    items = items[offset : offset + limit]

    return NewsListResponse(items=items, total=total)


@router.get("/{news_id}", response_model=NewsItem)
async def get_news_item(news_id: str):
    for item in _NEWS:
        if item.id == news_id:
            return item
    from fastapi import HTTPException
    raise HTTPException(status_code=404, detail="News item not found")
