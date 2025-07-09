import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./TaskList.css";

const TaskTable = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId, tasks } = location.state || {};
  const [isMobileView, setIsMobileView] = useState(false);

  // Check if we're on mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!tasks || tasks.length === 0) {
    return (
      <div className="no-tasks-container">
        <div className="no-tasks-content">
          <div className="no-tasks-icon">📋</div>
          <h3>No tasks available</h3>
          <p>Create your first task to get started</p>
          <button 
            onClick={() => navigate(`/projects/${projectId}/tasks/new`, { state: { projectId } })}
            className="create-first-task-btn"
          >
            + Create First Task
          </button>
        </div>
      </div>
    );
  }

  const goToTicketsDashboard = () => {
    navigate(`/projects/${projectId}/tasks/new`, {
      state: { projectId },
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'todo':
      case 'to do':
        return '#e2e8f0';
      case 'in_progress':
      case 'in progress':
        return '#fef3c7';
      case 'review':
        return '#dbeafe';
      case 'done':
      case 'completed':
        return '#dcfce7';
      default:
        return '#f3f4f6';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'todo':
      case 'to do':
        return '📋';
      case 'in_progress':
      case 'in progress':
        return '🔄';
      case 'review':
        return '👀';
      case 'done':
      case 'completed':
        return '✅';
      default:
        return '📝';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  // Desktop Table View
  const DesktopTable = () => (
    <div className="table-container">
      <table className="task-table">
      <thead>
        <tr>
          <th>No.</th>
          <th>Key</th>
          <th>Title</th>
          <th>Description</th>
          <th>Status</th>
            <th>Priority</th>
            <th>Assignee</th>
        </tr>
      </thead>
      <tbody>
        {tasks?.map((task, index) => (
            <tr key={task.id} className="task-row">
              <td className="task-number">{index + 1}</td>
              <td className="task-key">TASK-{task.id}</td>
              <td className="task-title">
                <Link to={`/tasks/${task.id}`} className="task-link">
                  {task.title}
                </Link>
            </td>
              <td className="task-description">
              {task.description
                  ? task.description.length > 100
                    ? `${task.description.substring(0, 100)}...`
                    : task.description
                : "--"}
            </td>
              <td className="task-status">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(task.status) }}
                >
                  {getStatusIcon(task.status)} {task.status}
                </span>
              </td>
              <td className="task-priority">
                {task.priority && (
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                  >
                    {task.priority}
                  </span>
                )}
              </td>
              <td className="task-assignee">
                {task.assignee ? (
                  <div className="assignee-info">
                    <img 
                      src={`https://i.pravatar.cc/24?img=${task.assignee.id || 1}`}
                      alt={task.assignee.name}
                      className="assignee-avatar"
                    />
                    <span>{task.assignee.name}</span>
                  </div>
                ) : (
                  <span className="unassigned">Unassigned</span>
                )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );

  // Mobile Card View
  const MobileCards = () => (
    <div className="mobile-cards-container">
      {tasks?.map((task, index) => (
        <div key={task.id} className="task-card">
          <div className="card-header">
            <div className="card-title-section">
              <span className="task-number-mobile">#{index + 1}</span>
              <Link to={`/tasks/${task.id}`} className="task-title-mobile">
                {task.title}
              </Link>
            </div>
            <div className="card-actions">
              {task.priority && (
                <span 
                  className="priority-badge-mobile"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                >
                  {task.priority}
                </span>
              )}
            </div>
          </div>
          
          <div className="card-content">
            {task.description && (
              <p className="card-description">
                {task.description.length > 80
                  ? `${task.description.substring(0, 80)}...`
                  : task.description}
              </p>
            )}
            
            <div className="card-meta">
              <div className="meta-item">
                <span className="meta-label">Status:</span>
                <span 
                  className="status-badge-mobile"
                  style={{ backgroundColor: getStatusColor(task.status) }}
                >
                  {getStatusIcon(task.status)} {task.status}
                </span>
              </div>
              
              {task.assignee && (
                <div className="meta-item">
                  <span className="meta-label">Assignee:</span>
                  <div className="assignee-info-mobile">
                    <img 
                      src={`https://i.pravatar.cc/20?img=${task.assignee.id || 1}`}
                      alt={task.assignee.name}
                      className="assignee-avatar-mobile"
                    />
                    <span>{task.assignee.name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="card-footer">
            <span className="task-key-mobile">TASK-{task.id}</span>
            <Link to={`/tasks/${task.id}`} className="view-task-btn">
              View Details →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="task-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Project Tasks</h1>
          <p className="dashboard-subtitle">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} in this project
          </p>
        </div>
        <button onClick={goToTicketsDashboard} className="create-task-btn">
          + Create New Task
        </button>
      </div>

      <div className="dashboard-content">
        {isMobileView ? <MobileCards /> : <DesktopTable />}
      </div>
    </div>
  );
};

export default TaskTable;
