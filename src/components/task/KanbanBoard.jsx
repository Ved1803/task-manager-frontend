import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import API from '../../services/api';
import './KanbanBoard.css';

// Sortable Task Card Component
const SortableTaskCard = ({ task, index }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card"
    >
      <div className="card-header">
        <div className="card-title-section">
          <span className="task-number">#{index + 1}</span>
          <Link to={`/tasks/${task.id}`} className="task-title">
            {task.title}
          </Link>
        </div>
        <div className="card-actions">
          {task.priority && (
            <span 
              className="priority-badge"
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
          {task.assigned_to && (
            <div className="meta-item">
              <span className="meta-label">Assignee:</span>
              <div className="assignee-info">
                <img 
                  src={`https://i.pravatar.cc/20?img=${task.assigned_to.id || 1}`}
                  alt={task.assigned_to.name || task.assigned_to}
                  className="assignee-avatar"
                />
                <span>{task.assigned_to.name || task.assigned_to}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="card-footer">
        <span className="task-key">TASK-{task.id}</span>
        <Link to={`/tasks/${task.id}`} className="view-task-btn">
          View →
        </Link>
      </div>
    </div>
  );
};

// Sortable Column Component
const SortableColumn = ({ status, tasks, onAddTask }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: status });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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

  const getStatusTitle = (status) => {
    switch (status?.toLowerCase()) {
      case 'todo':
      case 'to do':
        return 'To Do';
      case 'in_progress':
      case 'in progress':
        return 'In Progress';
      case 'review':
        return 'Review';
      case 'done':
      case 'completed':
        return 'Done';
      default:
        return status;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="kanban-column"
      data-status={status}
    >
      <div className="column-header">
        <div className="column-title">
          <span className="status-icon">{getStatusIcon(status)}</span>
          <h3>{getStatusTitle(status)}</h3>
          <span className="task-count">{tasks.length}</span>
        </div>
        <button 
          onClick={() => onAddTask(status)}
          className="add-task-btn"
          title={`Add task to ${getStatusTitle(status)}`}
        >
          +
        </button>
      </div>
      
      <div className="column-content">
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task, index) => (
            <SortableTaskCard key={task.id} task={task} index={index} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

const KanbanBoard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId, userId } = location.state || {};
  const [tasksByStatus, setTasksByStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch tasks grouped by status
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare request payload
      const payload = {};
      if (userId) {
        payload.user_id = userId;
      }
      
      // Fetch tasks grouped by status from the correct API endpoint
      const response = await API.get(`/projects/${projectId}/tasks/grouped_by_status`, {
        params: payload
      });
      
      // The API should return data already grouped by status
      const groupedData = response.data || {};
      
      // Ensure we have all required status columns
      const grouped = {
        todo: groupedData.todo || [],
        in_progress: groupedData.in_progress || [],
        review: groupedData.review || [],
        done: groupedData.done || []
      };
      
      setTasksByStatus(grouped);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again.');
      
      // Set empty state instead of dummy data
      setTasksByStatus({
        todo: [],
        in_progress: [],
        review: [],
        done: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  // Handle drag start
  const handleDragStart = (event) => {
    const { active } = event;
    const task = findTaskById(active.id);
    setActiveTask(task);
  };

  // Handle drag end
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (active.id !== over?.id) {
      const activeTask = findTaskById(active.id);
      const newStatus = over.id;

      if (activeTask && activeTask.status !== newStatus) {
        try {
          // Update task status via API
          await API.put(`/tasks/${activeTask.id}`, { status: newStatus });

          // Update local state
          setTasksByStatus(prev => {
            const newState = { ...prev };
            
            // Remove from old status
            const oldStatus = activeTask.status?.toLowerCase() || 'todo';
            if (newState[oldStatus]) {
              newState[oldStatus] = newState[oldStatus].filter(
                task => task.id !== activeTask.id
              );
            }
            
            // Add to new status
            const updatedTask = { ...activeTask, status: newStatus };
            newState[newStatus] = [...(newState[newStatus] || []), updatedTask];
            
            return newState;
          });
        } catch (err) {
          console.error('Error updating task status:', err);
          // Revert the change if API call fails
          fetchTasks();
        }
      }
    }
  };

  // Helper function to find task by ID
  const findTaskById = (taskId) => {
    for (const status in tasksByStatus) {
      const task = tasksByStatus[status].find(t => t.id === taskId);
      if (task) return task;
    }
    return null;
  };

  // Handle add task
  const handleAddTask = (status) => {
    // Navigate to create task form with pre-filled status
    navigate(`/projects/${projectId}/tasks/new`, { 
      state: { 
        projectId,
        prefillStatus: status 
      } 
    });
  };

  if (loading) {
    return (
      <div className="kanban-loading">
        <div className="loading-spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error && Object.keys(tasksByStatus).length === 0) {
    return (
      <div className="kanban-error">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Tasks</h3>
          <p>{error}</p>
          <button onClick={fetchTasks} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const statuses = ['todo', 'in_progress', 'review', 'done'];
  const totalTasks = Object.values(tasksByStatus).flat().length;

  return (
    <div className="kanban-board">
      <div className="board-header">
        <div className="header-content">
          <h1 className="board-title">
            {userId ? 'My Tasks' : 'Project Kanban Board'}
          </h1>
          <p className="board-subtitle">
            {totalTasks} total task{totalTasks !== 1 ? 's' : ''}
            {userId && ' assigned to you'}
          </p>
        </div>
        <button onClick={() => handleAddTask('todo')} className="create-task-btn">
          + Create New Task
        </button>
      </div>

      <div className={`board-container ${isMobileView ? 'mobile' : 'desktop'}`}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {statuses.map(status => (
            <SortableColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status] || []}
              onAddTask={handleAddTask}
            />
          ))}
          
          <DragOverlay dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: '0.5',
                },
              },
            }),
          }}>
            {activeTask ? (
              <div className="task-card dragging">
                <div className="card-header">
                  <div className="card-title-section">
                    <span className="task-number">#{activeTask.id}</span>
                    <span className="task-title">{activeTask.title}</span>
                  </div>
                  {activeTask.priority && (
                    <span className="priority-badge">{activeTask.priority}</span>
                  )}
                </div>
                {activeTask.description && (
                  <p className="card-description">
                    {activeTask.description.length > 80
                      ? `${activeTask.description.substring(0, 80)}...`
                      : activeTask.description}
                  </p>
                )}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default KanbanBoard; 