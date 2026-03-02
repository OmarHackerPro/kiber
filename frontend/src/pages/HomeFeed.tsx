import React from "react";
import { FeedItem } from "../types";
import { RankingCard } from "../components/feed/RankingCard";

interface HomeFeedProps {
  items: FeedItem[];
  onOpenCluster: (id: string) => void;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({ items, onOpenCluster }) => {
  return (
    <main className="flex-1">
      <div className="py-4 sm:py-6 space-y-3">
        {items.map(item => (
          <RankingCard
            key={item.id}
            item={item}
            onOpenCluster={() => onOpenCluster(item.id)}
          />
        ))}
      </div>
    </main>
  );
};




