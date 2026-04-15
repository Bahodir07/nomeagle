import React from "react";
import styles from "./GameNode.module.css";
import { GameNode as GameNodeType } from "../../types";
import greenCheckSrc from "../../../../assets/icons/status/green-check.png";

interface GameNodeProps {
  node: GameNodeType;
  onClick: (node: GameNodeType) => void;
}

export const GameNode: React.FC<GameNodeProps> = ({ node, onClick }) => {
  const isCompleted = node.isCompleted;
  const isLocked = node.isLocked && !node.isCompleted;
  const isAvailable = !isLocked && !isCompleted;

  let stateClass = "";
  if (isCompleted) stateClass = styles.completed;
  else if (isLocked) stateClass = styles.locked;
  else if (isAvailable) stateClass = styles.available;

  // Reference to public icons folder
  const iconSrc = `/assets/icons/games/${node.gameType}.svg`;

  return (
    <div
      className={`${styles.nodeWrapper} ${stateClass}`}
      style={{
        left: `${node.position.x}%`,
        top: `${node.position.y}%`,
      }}
    >
      <button
        className={styles.nodeButton}
        onClick={() => {
          if (!isLocked) {
            onClick(node);
          }
        }}
        disabled={isLocked}
        aria-label={node.title}
        title={node.title}
      >
        <img src={iconSrc} alt={node.gameType} className={styles.mainIcon} />
        
        {isCompleted && (
          <div className={styles.checkBadge} title="Completed">
            <img src={greenCheckSrc} alt="Completed check" />
          </div>
        )}
      </button>
      
      <div className={styles.label}>{node.title}</div>
    </div>
  );
};
