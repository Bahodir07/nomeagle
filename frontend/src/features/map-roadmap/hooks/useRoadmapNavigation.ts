import { useNavigate } from "react-router-dom";
import { GameNode } from "../types";

export const useRoadmapNavigation = (countryCode: string = "kz") => {
  const navigate = useNavigate();

  const handleNodeClick = (node: GameNode) => {
    if (node.isLocked) {
      return;
    }

    // Navigate to the specific game node
    if (node.routePath) {
      navigate(node.routePath);
    } else {
      navigate(`/learn/${countryCode}/game/${node.id}`);
    }
  };

  return { handleNodeClick };
};
