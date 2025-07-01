import React from "react";
import { useLocation } from "react-router-dom";
import KanbanBoard from "../../components/task/KanbanBoard";

const Tasks = () => {
  const location = useLocation();
  const { projectId } = location.state || {};

  return <KanbanBoard />;
};

export default Tasks;
