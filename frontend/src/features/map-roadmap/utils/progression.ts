import { LessonNode } from "../types";

const LOCAL_STORAGE_KEY = "road_map_progression_state";

/**
 * Retrieves the list of completed node IDs from local storage.
 */
const getCompletedNodeIds = (): string[] => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to parse local storage progression data", e);
    return [];
  }
};

/**
 * Computes the correct lock/completed status for an array of nodes based on local state.
 * Rules:
 * - Only the first node is unlocked initially.
 * - Completing a node unlocks the immediate next node.
 * - Completed nodes are marked as completed.
 * 
 * @param nodes The original array of game nodes
 * @returns A new array of game nodes with updated isLocked and isCompleted states
 */
export const getUnlockedNodes = (nodes: LessonNode[]): LessonNode[] => {
  const completedIds = new Set(getCompletedNodeIds());
  let isNextUnlocked = true; // The first node in the path is unlocked by default

  return nodes.map((node) => {
    const isCompleted = completedIds.has(node.id);
    
    // The current node is locked only if it's not completed AND the previous node was not completed
    const isLocked = !isCompleted && !isNextUnlocked;

    // The next node should be unlocked only if THIS node has been completed
    isNextUnlocked = isCompleted;

    return {
      ...node,
      isCompleted,
      isLocked,
    };
  });
};

/**
 * Marks a specific node as completed by adding its ID to local state.
 * 
 * @param nodeId The ID of the node to complete
 */
export const markNodeCompleted = (nodeId: string): void => {
  const completedIds = getCompletedNodeIds();
  
  if (!completedIds.includes(nodeId)) {
    completedIds.push(nodeId);
    
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(completedIds));
    } catch (e) {
      console.error("Failed to save progression data to local storage", e);
    }
  }
};
