import React from "react";
import styles from "./CountryRoadmap.module.css";
import { CountryRoadmap as CountryRoadmapType, GameType } from "../../types";
import { RoadPath } from "../RoadPath/RoadPath";

/* Maps each game type to an emoji/icon rendered inside the node */
const GAME_ICONS: Record<GameType, string> = {
  CultureMatchRush: "🃏",
  FestivalTimeline: "🎉",
  GuessTheLandmark: "🏛️",
  StreetFoodSprint: "🍜",
};

interface CountryRoadmapProps {
  /** The full roadmap model data (e.g. Kazakhstan) */
  roadmap: CountryRoadmapType;
  /** Callback fired when an available/completed node is clicked */
  onNodeClick?: (nodeId: string) => void;
}

export const CountryRoadmap: React.FC<CountryRoadmapProps> = ({
  roadmap,
  onNodeClick,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.mapWrapper}>
        <img
          src={roadmap.mapImage}
          alt={`Map of ${roadmap.countryCode}`}
          className={styles.mapImage}
          draggable={false}
        />

        {/* Nodes Overlay positioned relatively over the map image */}
        <div className={styles.nodesOverlay}>
          <RoadPath nodes={roadmap.nodes} />
          {roadmap.nodes.map((node, index) => {
            // Determine the state class (Duolingo style)
            let stateClass = "";
            if (node.isCompleted) {
              stateClass = styles.isCompleted;
            } else if (node.isLocked) {
              stateClass = styles.isLocked;
            } else {
              stateClass = styles.isAvailable;
            }

            return (
              <div
                key={node.id}
                className={styles.nodePositioner}
                style={{
                  left: `${node.position.x}%`,
                  top: `${node.position.y}%`,
                }}
              >
                <div
                  className={`${styles.mockNode} ${stateClass}`}
                  title={node.title}
                  onClick={() => {
                    if (!node.isLocked && onNodeClick) {
                      onNodeClick(node.id);
                    }
                  }}
                  role="button"
                  tabIndex={node.isLocked ? -1 : 0}
                  aria-disabled={node.isLocked}
                  aria-label={`Level ${index + 1}: ${node.title}`}
                >
                  <span className={styles.nodeIcon} aria-hidden="true">
                    {GAME_ICONS[node.gameType]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

