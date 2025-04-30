import React from "react";
import { useLocation } from "react-router-dom";
import TaskTable from "../../components/task/TaskTable";

const Tasks = () => {
  const location = useLocation();
  const { tasks } = location.state || {};

  return <TaskTable tasks={tasks} />;
};

export default Tasks;
