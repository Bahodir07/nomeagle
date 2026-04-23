import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CountryRoadmap } from "../../../features/map-roadmap/components/CountryRoadmap/CountryRoadmap";
import { kazakhstanRoadmapMock } from "../../../features/map-roadmap/mock/kazakhstanRoadmap.mock";
import { getUnlockedNodes } from "../../../features/map-roadmap/utils/progression";
import { StatsPanel } from "../../../features/dashboard/components";
import { Loading } from "../../../components/feedback";
import { getDashboard } from "../../../app/api/progress";
import type { DashboardResponse, AsyncState } from "../../../features/dashboard/types";
import styles from "./CountryRoadmapPage.module.css";

export const CountryRoadmapPage: React.FC = () => {
  const { countryCode: _countryCode } = useParams<{ countryCode: string }>();
  const navigate = useNavigate();

  const baseRoadmap = kazakhstanRoadmapMock;

  const [statsState, setStatsState] = useState<AsyncState<DashboardResponse>>({
    status: "loading",
  });

  useEffect(() => {
    getDashboard()
      .then((data) => setStatsState({ status: "success", data }))
      .catch(() => setStatsState({ status: "error", error: "" }));
  }, []);

  const roadmapWithProgression = useMemo(() => {
    return {
      ...baseRoadmap,
      nodes: getUnlockedNodes(baseRoadmap.nodes),
    };
  }, [baseRoadmap]);

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      const node = roadmapWithProgression.nodes.find((n) => n.id === nodeId);
      if (node && !node.isLocked) {
        navigate(`/app/lesson/${node.lessonId}`);
      }
    },
    [roadmapWithProgression.nodes, navigate],
  );

  return (
    <div className={styles.pageContainer}>
      <aside className={styles.statsSidebar}>
        {statsState.status === "loading" && (
          <Loading rows={4} columns={1} blockHeight={80} showHeading={false} />
        )}
        {statsState.status === "success" && (
          <StatsPanel
            stats={statsState.data.user}
            weekProgress={statsState.data.user.weekProgress}
          />
        )}
      </aside>

      <main className={styles.mainContent}>
        <CountryRoadmap
          roadmap={roadmapWithProgression}
          onNodeClick={handleNodeClick}
        />
      </main>
    </div>
  );
};
