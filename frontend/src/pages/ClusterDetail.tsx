import React from "react";
import { Cluster } from "../types";
import { ClusterHeader } from "../components/cluster/ClusterHeader";
import { SourceCard } from "../components/cluster/SourceCard";

interface ClusterDetailProps {
  cluster: Cluster;
  onBack: () => void;
}

export const ClusterDetail: React.FC<ClusterDetailProps> = ({ cluster, onBack }) => {
  return (
    <main className="flex-1">
      <ClusterHeader cluster={cluster} onBack={onBack} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="space-y-4">
          <div className="glass-panel rounded-2xl p-4 sm:p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 mb-2">
              Overview
            </h2>
            <p className="text-sm text-slate-300">{cluster.overview}</p>
          </div>

          <div className="glass-panel rounded-2xl p-4 sm:p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 mb-3">
              Key points
            </h2>
            <ul className="space-y-2 text-sm text-slate-300">
              {cluster.keyPoints.map(point => (
                <li key={point} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent.blue shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel rounded-2xl p-4 sm:p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 mb-3">
              Timeline
            </h2>
            <ol className="space-y-3 text-sm text-slate-300">
              {cluster.timeline.map(item => (
                <li key={item.time} className="flex gap-3">
                  <div className="mt-0.5 text-[11px] font-mono text-slate-500 w-14 shrink-0">
                    {item.time}
                  </div>
                  <div>
                    <p className="font-medium text-slate-100">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="space-y-4">
          <div className="glass-panel rounded-2xl p-4 sm:p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 mb-3">
              Related topics
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {cluster.relatedTopics.map(topic => (
                <span
                  key={topic}
                  className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-200"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Sources
              </h2>
              <p className="text-[11px] text-slate-500">
                {cluster.totalSources} articles tracked
              </p>
            </div>
            <div className="space-y-3">
              {cluster.sources.map(source => (
                <SourceCard key={source.id} source={source} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};




