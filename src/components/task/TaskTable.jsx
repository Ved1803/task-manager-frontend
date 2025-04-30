import React from "react";
import { Link } from "react-router-dom";
import "./TaskList.css";

const TaskTable = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return <p>No tasks available.</p>;
  }

  return (
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
              {/* <span
                onClick={() => openStatusModel(task)}
                style={{
                  cursor: "pointer",
                  color: "black",
                  textDecoration: "underline",
                }}
              > */}
              {task.status}
              {/* </span> */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TaskTable;
