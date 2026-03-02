import React, { useMemo, useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";
import { HomeFeed } from "./pages/HomeFeed";
import { ClusterDetail } from "./pages/ClusterDetail";
import { mockCluster, mockFeedItems } from "./data/mockData";
import { FeedItem, SortBy, TimeFilter } from "./types";

type View = "feed" | "cluster";

const App: React.FC = () => {
  const [view, setView] = useState<View>("feed");
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("24h");
  const [sortBy, setSortBy] = useState<SortBy>("score");
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const filteredFeed: FeedItem[] = useMemo(() => {
    let items = [...mockFeedItems];

    if (category) {
      items = items.filter(item => item.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        item =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    items.sort((a, b) => {
      if (sortBy === "score") return b.score - a.score;
      if (sortBy === "sources") return b.sourceCount - a.sourceCount;
      if (sortBy === "latest")
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      return 0;
    });

    return items;
  }, [category, search, sortBy]);

  const handleOpenCluster = (id: string) => {
    setSelectedClusterId(id);
    setView("cluster");
  };

  const handleBackToFeed = () => {
    setView("feed");
  };

  const cluster = mockCluster;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950 text-slate-50">
      <TopBar
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        category={category}
        onCategoryChange={setCategory}
        search={search}
        onSearchChange={setSearch}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex gap-4 lg:gap-6">
        <Sidebar onNavigateToFeed={handleBackToFeed} />

        <div className="flex-1">
          {view === "feed" && (
            <HomeFeed items={filteredFeed} onOpenCluster={handleOpenCluster} />
          )}
          {view === "cluster" && selectedClusterId && (
            <ClusterDetail cluster={cluster} onBack={handleBackToFeed} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;




