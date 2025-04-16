import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./TaskDetails.css";
import PriorityDropdown from "./PriorityDropdown";
import AssigneeDropdown from "./AssigneeDropdown";
import API from "../../services/api";
import ReportedByDropdown from "./ReportedByDropdown";
import TaskComments from "../../components/comments/TaskComments";

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [editingDueDate, setEditingDueDate] = useState(false);
  const [editingCategory, setEditingCategory] = useState(false);
  const [draftCategory, setDraftCategory] = useState("");
  const [editingDescription, setEditingDescription] = useState(false);
  const [draftDescription, setDraftDescription] = useState("");

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await API.get(`/tasks/${id}`);
        console.log(response.data.task, "TaskDetails");
        setTask(response.data.task);
      } catch (error) {
        toast.error("Failed to fetch task details!");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [id]);

  const handleDueDateChange = async (e) => {
    const newDueDate = e.target.value;
    try {
      await API.put(`/tasks/${task.id}`, { due_date: newDueDate });
      setTask((prev) => ({ ...prev, due_date: newDueDate }));
      toast.success("Due date updated!");
    } catch (error) {
      toast.error("Failed to update due date!");
    } finally {
      setEditingDueDate(false);
    }
  };

  const startEditingCategory = () => {
    setDraftCategory(task.category || "");
    setEditingCategory(true);
  };

  const saveCategory = async () => {
    try {
      await API.put(`/tasks/${task.id}`, { category: draftCategory });
      setTask((prev) => ({ ...prev, category: draftCategory }));
      toast.success("Category updated!");
    } catch (error) {
      toast.error("Failed to update category!");
    } finally {
      setEditingCategory(false);
    }
  };

  const cancelCategoryEdit = () => {
    setEditingCategory(false);
  };

  const startEditingDescription = () => {
    setDraftDescription(task.description || "");
    setEditingDescription(true);
  };

  const saveDescription = async () => {
    try {
      await API.put(`/tasks/${task.id}`, { description: draftDescription });
      setTask((prev) => ({ ...prev, description: draftDescription }));
      toast.success("Description updated!");
    } catch (error) {
      toast.error("Failed to update description!");
	  console.log(error, 'Failed to update description!')
    } finally {
      setEditingDescription(false);
    }
  };

  const cancelDescriptionEdit = () => {
    setEditingDescription(false);
  };

  const handlePriorityUpdate = (newPriority) => {
    setTask((prev) => ({ ...prev, priority: newPriority }));
  };

  const handleAssigneeUpdate = (newAssignee) => {
    setTask((prev) => ({ ...prev, assigned_to: newAssignee }));
  };

  const handleRepotedByUpdate = (newReportedBy) => {
    setTask((prev) => ({ ...prev, reported_by: newReportedBy }));
  };

  if (loading) return <p>Loading task details...</p>;
  if (!task) return <p>Task not found!</p>;

  return (
    <div className="container">
      <div className="ticket-header">
        <div className="ticket-id">Ticket-{task.id}</div>
        <div className="ticket-status status-in-progress">{task.status}</div>
      </div>

      <div className="ticket-meta">
        <div className="meta-item">
          <div className="meta-label">
            Reported By
            <i class="fa-solid fa-pen-to-square" aria-hidden="true"></i>
          </div>
          <ReportedByDropdown
            taskId={task.id}
            currentReportedBy={task.reporter?.name ? task.reporter.name : "- -"}
            onReportedByChange={handleRepotedByUpdate}
          />
        </div>
        <div className="meta-item">
          <div className="meta-label">
            Assigned To
            <i class="fa-solid fa-pen-to-square" aria-hidden="true"></i>
          </div>
          <AssigneeDropdown
            taskId={task.id}
            currentAssignee={task.assignee?.name ? task.assignee.name : "- -"}
            onAssigneeChange={handleAssigneeUpdate}
          />
        </div>

        <div className="meta-item">
          <div className="meta-label">
            Priority
            <i class="fa-solid fa-pen-to-square" aria-hidden="true"></i>
          </div>
          <PriorityDropdown
            taskId={task.id}
            currentPriority={task.priority ? task.priority : "- -"}
            onPriorityChange={handlePriorityUpdate}
          />
        </div>
        <div className="meta-item">
          <div className="meta-label">Created</div>
          <div className="meta-value">{task.created_at}</div>
        </div>
        {/* Due Date */}
        <div className="meta-item">
          <div className="meta-label">
            Due Date
            <i
              className="fa-solid fa-pen-to-square"
              aria-hidden="true"
              onClick={() => setEditingDueDate(true)}
              style={{ cursor: "pointer", marginLeft: "8px" }}
            />
          </div>
          <div className="meta-value">
            {editingDueDate ? (
              <input
                type="date"
                value={task.due_date || ""}
                onChange={handleDueDateChange}
                onBlur={() => setEditingDueDate(false)}
                className="input-inline"
              />
            ) : (
              task.due_date || "- -"
            )}
          </div>
        </div>

        <div className="meta-item">
          <div className="meta-label">
            Category
            {!editingCategory && (
              <i
                className="fa-solid fa-pen-to-square"
                aria-hidden="true"
                onClick={startEditingCategory}
                style={{ cursor: "pointer", marginLeft: "8px" }}
              />
            )}
          </div>

          <div
            className="meta-value"
            style={{ display: "flex", alignItems: "center" }}
          >
            {editingCategory ? (
              <>
                <input
                  type="text"
                  value={draftCategory}
                  onChange={(e) => setDraftCategory(e.target.value)}
                  className="input-inline"
                />
                <span
                  onClick={saveCategory}
                  style={{
                    cursor: "pointer",
                    color: "green",
                    marginLeft: "8px",
                  }}
                  title="Save"
                >
                  <i class="fa-solid fa-check"></i>
                </span>
                <span
                  onClick={cancelCategoryEdit}
                  style={{ cursor: "pointer", color: "red", marginLeft: "8px" }}
                  title="Cancel"
                >
                  <i class="fa-solid fa-xmark"></i>
                </span>
              </>
            ) : (
              task.category || "- -"
            )}
          </div>
        </div>
      </div>

      <h1 className="ticket-title">{task.title}</h1>

      <div className="ticket-description">
        <div className="meta-label">
          Description
          {!editingDescription && (
            <i
              className="fa-solid fa-pen-to-square"
              aria-hidden="true"
              onClick={startEditingDescription}
              style={{ cursor: "pointer", marginLeft: "8px" }}
            />
          )}
        </div>

        {editingDescription ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <textarea
              value={draftDescription}
              onChange={(e) => setDraftDescription(e.target.value)}
              className="description-textarea"
            />
            <div>
              <span
                onClick={saveDescription}
                style={{
                  cursor: "pointer",
                  color: "green",
                  marginRight: "10px",
                }}
                title="Save"
              >
                <i class="fa-solid fa-check"></i>
              </span>
              <span
                onClick={cancelDescriptionEdit}
                style={{ cursor: "pointer", color: "red" }}
                title="Cancel"
              >
                <i class="fa-solid fa-xmark"></i>
              </span>
            </div>
          </div>
        ) : (
          <p onClick={startEditingDescription}>{task.description || "- -"}</p>
        )}
      </div>

      <div className="ticket-attachments">
        <h3>Attachments (3)</h3>
        <ul className="attachment-list">
          <li className="attachment-item">
            <span className="attachment-icon">📄</span>
            <a href="#" className="attachment-name">
              error_screenshot.png
            </a>
            <span className="attachment-size">245 KB</span>
          </li>
          <li className="attachment-item">
            <span className="attachment-icon">📄</span>
            <a href="#" className="attachment-name">
              server_logs.txt
            </a>
            <span className="attachment-size">124 KB</span>
          </li>
          <li className="attachment-item">
            <span className="attachment-icon">📄</span>
            <a href="#" className="attachment-name">
              transaction_data.json
            </a>
            <span className="attachment-size">78 KB</span>
          </li>
        </ul>
      </div>

      <TaskComments />
    </div>
  );
};

export default TaskDetails;
