import React from "react";
import { Link, useNavigate, useLocation} from "react-router-dom";
import "./TaskList.css";


const TaskTable = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId, tasks } = location.state || {};

  if (!tasks || tasks.length === 0) {
    return <p>No tasks available.</p>;
  }

  const goToTicketsDashboard = () => {
    navigate(`/projects/${projectId}/tasks/new`, {
      state: { projectId },
    });
  };

  return (
    <>
  <button onClick={goToTicketsDashboard} className="tickets-button">
    Create New Task
  </button>
    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Key</th>
          <th>Title</th>
          <th>Description</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {tasks?.map((task, index) => (
          <tr key={task.id}>
            <td>{index + 1}</td>
            <td>{task.id}</td>
            <td>
              <Link to={`/tasks/${task.id}`}>{task.title}</Link>
            </td>
            <td>
              {task.description
                ? task.description.split(" ").slice(0, 15).join(" ") +
                  (task.description.split(" ").length > 15 ? "..." : "")
                : "--"}
            </td>
            <td>
              {task.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </>
  );
};

export default TaskTable;
