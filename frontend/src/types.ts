export type TimeFilter = "1h" | "24h" | "7d" | "30d" | "all";

export type SortBy = "score" | "latest" | "sources";

export interface FeedItem {
  id: string;
  rank: number;
  title: string;
  description: string;
  score: number;
  sourceCount: number;
  timestamp: string; // ISO string
  category: string;
}

export interface ClusterSource {
  id: string;
  title: string;
  publisher: string;
  timestamp: string;
  url: string;
}

export interface Cluster {
  id: string;
  title: string;
  summary: string;
  totalSources: number;
  totalScore: number;
  timeRange: string;
  overview: string;
  keyPoints: string[];
  timeline: { time: string; label: string; description: string }[];
  relatedTopics: string[];
  sources: ClusterSource[];
}




