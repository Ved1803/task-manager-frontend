import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./TaskDetails.css";
import PriorityDropdown from "./PriorityDropdown";
import StatusDropdown from "./StatusDropdown";
import AssigneeDropdown from "./AssigneeDropdown";
import API from "../../services/api";
import ReportedByDropdown from "./ReportedByDropdown";
import TaskComments from "../../components/comments/TaskComments";

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingDueDate, setEditingDueDate] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [draftDescription, setDraftDescription] = useState("");
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [editingPriority, setEditingPriority] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingAssignee, setEditingAssignee] = useState(false);
  const [editingReporter, setEditingReporter] = useState(false);
  const [watching, setWatching] = useState(false);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await API.get(`/tasks/${id}`);
        setTask(response.data.task);
        console.log(response.data.task, "TaskDetails-------------");
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
    } finally {
      setEditingDescription(false);
    }
  };

  const cancelDescriptionEdit = () => {
    setEditingDescription(false);
  };

  const handleAttachmentClick = (attachment) => {
    setPreviewAttachment(attachment);
    setShowAttachmentModal(true);
  };

  const closeAttachmentModal = () => {
    setShowAttachmentModal(false);
    setPreviewAttachment(null);
  };

  // Editable Title
  const startEditingTitle = () => {
    setDraftTitle(task.title || "");
    setEditingTitle(true);
  };
  const saveTitle = async () => {
    try {
      await API.put(`/tasks/${task.id}`, { title: draftTitle });
      setTask((prev) => ({ ...prev, title: draftTitle }));
      toast.success("Title updated!");
    } catch (error) {
      toast.error("Failed to update title!");
    } finally {
      setEditingTitle(false);
    }
  };
  const cancelTitleEdit = () => setEditingTitle(false);

  // Priority
  const handlePriorityChange = (newPriority) => {
    setTask((prev) => ({ ...prev, priority: newPriority }));
    setEditingPriority(false);
  };

  // Status
  const handleStatusChange = (newStatus) => {
    setTask((prev) => ({ ...prev, status: newStatus }));
    setEditingStatus(false);
  };

  // Assignee
  const handleAssigneeChange = (newAssigneeId) => {
    setTask((prev) => ({ ...prev, assigned_to: { ...prev.assigned_to, id: newAssigneeId } }));
    setEditingAssignee(false);
  };

  // Reporter
  const handleReporterChange = (newReporterId) => {
    setTask((prev) => ({ ...prev, reported_by: { ...prev.reported_by, id: newReporterId } }));
    setEditingReporter(false);
  };

  // Action button handlers
  const handleEdit = () => {
    startEditingTitle();
    startEditingDescription();
  };
  const handleAssign = () => setEditingAssignee(true);
  const handleChangeStatus = () => setEditingStatus(true);
  const handleWatch = () => setWatching((prev) => !prev);

  if (loading) return <p>Loading ticket details...</p>;
  if (!task) return <p>Ticket not found!</p>;

  const renderAvatar = (user, size = 32) => (
    <img
      src={`https://i.pravatar.cc/${size}?img=${user?.id || 1}`}
      alt={user?.name || "-"}
      className="ticket-avatar"
      width={size}
      height={size}
      style={{ borderRadius: "50%", objectFit: "cover" }}
    />
  );

  const renderStatusBadge = (status) => {
    const colorMap = {
      todo: "#4f8cff",
      'to do': "#4f8cff",
      in_progress: "#f59e0b",
      'in progress': "#f59e0b",
      review: "#a084ee",
      done: "#10b981",
      completed: "#10b981",
    };
    return (
      <span className="ticket-status-badge" style={{ background: colorMap[status?.toLowerCase()] || "#e5e7eb", color: '#fff' }}>
        {status}
      </span>
    );
  };

  const renderPriorityBadge = (priority) => {
    const colorMap = {
      high: "#ef4444",
      medium: "#f59e0b",
      low: "#10b981",
      critical: "#a21caf",
    };
    return (
      <span className="ticket-priority-badge" style={{ background: colorMap[priority?.toLowerCase()] || "#6b7280" }}>
        {priority}
      </span>
    );
  };

  const renderLabels = (labels) =>
    labels && labels.length > 0 ? (
      <div className="ticket-labels">
        {labels.map((label) => (
          <span key={label} className="ticket-label-chip">{label}</span>
        ))}
      </div>
    ) : null;

  // Attachments grid (handles both array of objects and array of image URLs)
  const renderAttachments = (attachments) => {
    if (!attachments || attachments.length === 0) {
      return <span className="ticket-no-attachments">No attachments uploaded yet</span>;
    }
    // If array of strings (image URLs)
    if (typeof attachments[0] === 'string') {
      return (
        <div className="ticket-attachments-grid">
          {attachments.map((url, idx) => {
            // Extract file name from URL
            const fileName = url.split('/').pop().split('?')[0];
            return (
              <div
                key={url}
                className="attachment-item-card"
                onClick={() => {
                  setPreviewAttachment(url);
                  setShowAttachmentModal(true);
                }}
                tabIndex={0}
                role="button"
                style={{ cursor: 'pointer' }}
              >
                <img src={url} alt={fileName} className="attachment-thumb" />
                <div className="attachment-info">
                  <span className="attachment-name">{fileName}</span>
                  {/* No size info available */}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    // Otherwise, treat as array of objects (legacy)
    return (
      <div className="ticket-attachments-grid">
        {attachments.map((att) => (
          <div
            key={att.id}
            className="attachment-item-card"
            onClick={() => handleAttachmentClick(att)}
            tabIndex={0}
            role="button"
            style={{ cursor: 'pointer' }}
          >
            {att.thumbnail_url ? (
              <img src={att.thumbnail_url} alt={att.file_name} className="attachment-thumb" />
            ) : (
              <span className="attachment-icon">📎</span>
            )}
            <div className="attachment-info">
              <span className="attachment-name">{att.file_name}</span>
              <span className="attachment-size">{att.size || "-"}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="jira-fullpage-bg">
      <div className="jira-fullpage-container">
        {/* Left Info Panel */}
        <aside className="jira-info-panel">
          <div className="jira-card jira-info-card">
            <div className="jira-info-row"><span className="jira-info-label">Ticket Key</span><span className="jira-info-value">Ticket-{task.id}</span></div>
            <div className="jira-info-row"><span className="jira-info-label">Status</span><span>{editingStatus ? (
              <StatusDropdown taskId={task.id} currentStatus={task.priority} onStatusChange={handleStatusChange} />
            ) : (
              <span style={{ cursor: 'pointer' }} onClick={() => setEditingStatus(true)}>
                {renderStatusBadge(task.status)}
                <span title="Edit" style={{ marginLeft: 6, fontSize: '1em', color: '#b6bac8', cursor: 'pointer' }}>✏️</span>
              </span>
            )}</span></div>
            <div className="jira-info-row"><span className="jira-info-label">Type</span><span className="task-value-inline">{task.type || 'Story'}</span></div>
            <div className="jira-info-row"><span className="jira-info-label">Priority</span><span className="task-value-inline">{editingPriority ? (
              <PriorityDropdown taskId={task.id} currentPriority={task.priority} onPriorityChange={handlePriorityChange} />
            ) : (
              <span style={{ cursor: 'pointer' }} onClick={() => setEditingPriority(true)}>
                {renderPriorityBadge(task.priority)}
                <span title="Edit" style={{ marginLeft: 6, fontSize: '1em', color: '#b6bac8', cursor: 'pointer' }}>✏️</span>
              </span>
            )}</span></div>
            <div className="jira-info-row"><span className="jira-info-label">Labels</span>{renderLabels(task.labels)}</div>
            <div className="jira-info-row"><span className="jira-info-label">Sprint</span><span className="task-value-inline">{task.sprint || '-'}</span></div>
            <div className="jira-info-row"><span className="jira-info-label">Story Points</span><span className="task-value-inline">{task.story_points || '-'}</span></div>
            <div className="jira-info-row"><span className="jira-info-label">Epic Link</span><span className="task-value-inline">{task.epic_link || '-'}</span></div>
            <div className="jira-info-row"><span className="jira-info-label">Parent Link</span><span className="task-value-inline">{task.parent_link || '-'}</span></div>
            <div className="jira-info-row"><span className="jira-info-label">Acceptance Criteria</span><span className="task-value-inline">{task.acceptance_criteria || '-'}</span></div>
            <div className="jira-info-row"><span className="jira-info-label">Created</span><span className="task-value-inline">{task.created_at || '-'}</span></div>
            <div className="jira-info-row"><span className="jira-info-label">Due Date</span>
              <span className="task-value-inline">
                {editingDueDate ? (
                  <input
                    type="date"
                    value={task.due_date || ""}
                    onChange={handleDueDateChange}
                    onBlur={() => setEditingDueDate(false)}
                    className="input-inline"
                  />
                ) : (
                  <span onClick={() => setEditingDueDate(true)} style={{ cursor: "pointer" }}>
                    {task.due_date || "- -"}
                    <span title="Edit" style={{ marginLeft: 8, fontSize: '1em', color: '#b6bac8', cursor: 'pointer' }}>✏️</span>
                  </span>
                )}
              </span>
            </div>
          </div>
          <div className="jira-card jira-people-card">
            <div className="jira-people-row"><span className="jira-info-label">Assignee</span><span>{editingAssignee ? (
              <AssigneeDropdown taskId={task.id} currentAssignee={task.assigned_to?.name} onAssigneeChange={handleAssigneeChange} />
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setEditingAssignee(true)}>
                {task.assigned_to && renderAvatar(task.assigned_to, 28)} {task.assigned_to?.name || '-'}
                <span title="Edit" style={{ marginLeft: 6, fontSize: '1em', color: '#b6bac8', cursor: 'pointer' }}>✏️</span>
              </span>
            )}</span></div>
            <div className="jira-people-row"><span className="jira-info-label">Reporter</span><span>{editingReporter ? (
              <ReportedByDropdown taskId={task.id} currentReportedBy={task.reported_by?.name} onReportedByChange={handleReporterChange} />
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setEditingReporter(true)}>
                {task.reported_by && renderAvatar(task.reported_by, 28)} {task.reported_by?.name || '-'}
                <span title="Edit" style={{ marginLeft: 6, fontSize: '1em', color: '#b6bac8', cursor: 'pointer' }}>✏️</span>
              </span>
            )}</span></div>
            <div className="jira-people-row"><span className="jira-info-label">Team</span><span className="task-value-inline">{task.team || '-'}</span></div>
            <div className="jira-people-row"><span className="jira-info-label">Votes</span><span className="task-value-inline">{task.votes || 0}</span></div>
            <div className="jira-people-row"><span className="jira-info-label">Watchers</span><span className="task-value-inline">{task.watchers || 0}</span></div>
          </div>
        </aside>
        {/* Right Main Panel */}
        <main className="jira-main-panel">
          <div className="jira-card jira-main-card">
            <div className="jira-main-header">
              <div className="jira-main-title-block">
                {editingTitle ? (
                  <>
                    <input
                      type="text"
                      value={draftTitle}
                      onChange={e => setDraftTitle(e.target.value)}
                      className="input-inline"
                      style={{ fontWeight: 700, fontSize: '1.5rem', minWidth: 180 }}
                      autoFocus
                    />
                    <button onClick={saveTitle} className="btn-save">Save</button>
                    <button onClick={cancelTitleEdit} className="btn-cancel">Cancel</button>
                  </>
                ) : (
                  <span className="jira-main-title" style={{ cursor: 'pointer' }} onClick={startEditingTitle}>
                    {task.title}
                    <span title="Edit" style={{ marginLeft: 8, fontSize: '1em', color: '#b6bac8', cursor: 'pointer' }}>✏️</span>
                  </span>
                )}
                {renderStatusBadge(task.status)}
              </div>
              <div className="jira-main-actions">
                <button className="jira-action-btn" onClick={handleEdit}>Edit</button>
                <button className="jira-action-btn" onClick={handleAssign}>Assign</button>
                <button className="jira-action-btn" onClick={handleChangeStatus}>Change Status</button>
                <button className={`jira-action-btn${watching ? ' watching' : ''}`} onClick={handleWatch}>{watching ? 'Watching' : 'Watch'}</button>
              </div>
            </div>
            <div className="jira-section">
              <div className="jira-section-title">Description <span title="Edit" style={{ marginLeft: 8, fontSize: '1em', color: '#b6bac8', cursor: 'pointer' }} onClick={startEditingDescription}>✏️</span></div>
              <div className="jira-description">
                {editingDescription ? (
                  <>
                    <textarea
                      value={draftDescription}
                      onChange={(e) => setDraftDescription(e.target.value)}
                      className="input-inline"
                      rows={4}
                    />
                    <button onClick={saveDescription} className="btn-save">Save</button>
                    <button onClick={cancelDescriptionEdit} className="btn-cancel">Cancel</button>
                  </>
                ) : (
                  <span onClick={startEditingDescription} style={{ cursor: "pointer" }}>
                    {task.description || "No description."}
                  </span>
                )}
              </div>
            </div>
            <div className="jira-section">
              <div className="jira-section-title">Attachments</div>
              {renderAttachments(task.image_urls)}
            </div>
            {showAttachmentModal && previewAttachment && (
              <div className="attachment-modal" onClick={closeAttachmentModal}>
                <div className="attachment-modal-content" onClick={e => e.stopPropagation()}>
                  {/* If previewAttachment is a string, show full image. If object, show legacy preview. */}
                  {typeof previewAttachment === 'string' ? (
                    <img src={previewAttachment} alt="Attachment" style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 12 }} />
                  ) : previewAttachment.thumbnail_url ? (
                    <img src={previewAttachment.thumbnail_url} alt={previewAttachment.file_name} style={{ maxWidth: 400, maxHeight: 400 }} />
                  ) : (
                    <span className="attachment-icon-large">📎</span>
                  )}
                  <div className="attachment-modal-info">
                    <div>{typeof previewAttachment === 'string' ? previewAttachment.split('/').pop().split('?')[0] : previewAttachment.file_name}</div>
                    {typeof previewAttachment !== 'string' && <div>{previewAttachment.size || "-"}</div>}
                    {typeof previewAttachment !== 'string' && previewAttachment.url && (
                      <a href={previewAttachment.url} download target="_blank" rel="noopener noreferrer" className="btn-download">Download</a>
                    )}
                  </div>
                  <button onClick={closeAttachmentModal} className="btn-cancel">Close</button>
                </div>
              </div>
            )}
            <div className="jira-section">
              <div className="jira-section-title">Comments</div>
              <TaskComments />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskDetails;
