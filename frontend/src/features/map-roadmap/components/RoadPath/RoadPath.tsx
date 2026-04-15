import React from "react";
import styles from "./RoadPath.module.css";
import { GameNode } from "../../types";

interface RoadPathProps {
  nodes: GameNode[];
}

export const RoadPath: React.FC<RoadPathProps> = ({ nodes }) => {
  if (!nodes || nodes.length < 2) return null;

  return (
    <svg className={styles.svgOverlay} preserveAspectRatio="none">
      {nodes.map((node, index) => {
        if (index === 0) return null;
        const prevNode = nodes[index - 1];

        // The path segment is completed if the previous node is completed.
        // If the path leads to a current (available) node, we might want it unlocked but not completed.
        // For simplicity, let's treat the path as completed if it connects to an unlocked/available or completed node from a completed node.
        const isActive = prevNode.isCompleted && (!node.isLocked || node.isCompleted);

        return (
          <line
            key={`path-${prevNode.id}-${node.id}`}
            x1={`${prevNode.position.x}%`}
            y1={`${prevNode.position.y}%`}
            x2={`${node.position.x}%`}
            y2={`${node.position.y}%`}
            className={`${styles.pathLine} ${
              isActive ? styles.activeLine : styles.lockedLine
            }`}
          />
        );
      })}
    </svg>
  );
};
