import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import './TaskDetails.css';
import PriorityDropdown from "./PriorityDropdown";
import AssigneeDropdown from "./AssigneeDropdown";
import API from "../../services/api";
import ReportedByDropdown from "./ReportedByDropdown";
import TaskComments from "../../components/comments/TaskComments";

const TaskDetails = () => {
	const { id } = useParams();
	const [task, setTask] =  useState(null);
	const [loading, setLoading] = useState(true);
	const [allUsers, setAllUsers] = useState([])


  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await API.get(`/tasks/${id}`);
		console.log(response.data.task, 'TaskDetails')
        setTask(response.data.task);
      } catch (error) {
        toast.error("Failed to fetch task details!");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [id]);

   const handlePriorityUpdate = (newPriority) => {
    setTask(prev => ({ ...prev, priority: newPriority }));
   };

   const handleAssigneeUpdate = (newAssignee) => {
    setTask(prev => ({ ...prev, assigned_to: newAssignee }));
   };
   
   const handleRepotedByUpdate = (newReportedBy) => {
    setTask(prev => ({ ...prev, reported_by: newReportedBy }));
   };


  if (loading) return <p>Loading task details...</p>;
  if (!task) return <p>Task not found!</p>;

	return (
		<div className="container">
			<div className="ticket-header">
				<div className="ticket-id">Ticket-{ task.id}</div>
				<div className="ticket-status status-in-progress">{ task.status }</div>
			</div>

			<div className="ticket-meta">
				<div className="meta-item">
					<div className="meta-label">Reported By
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
						currentAssignee={task.assignee?.name ? task.assignee.name : "- -" }
						onAssigneeChange={handleAssigneeUpdate}
					/>
				</div>
				
				<div className="meta-item">
				    <div className="meta-label">Priority 
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
					<div className="meta-value">{ task.created_at }</div>
				</div>
				<div className="meta-item">
					<div className="meta-label">Due Date</div>
					<div className="meta-value">{task.due_date ? task.due_date : "- -"}</div>
				</div>
				<div className="meta-item">
					<div className="meta-label">Category</div>
					<div className="meta-value">{task.category ? task.category : "- -" }</div>
				</div>
			</div>

			<h1 className="ticket-title">API Integration with Payment Gateway Failing</h1>

			<div className="ticket-description">
               {task.description }
			</div>

			<div className="ticket-attachments">
				<h3>Attachments (3)</h3>
				<ul className="attachment-list">
					<li className="attachment-item">
						<span className="attachment-icon">📄</span>
						<a href="#" className="attachment-name">error_screenshot.png</a>
						<span className="attachment-size">245 KB</span>
					</li>
					<li className="attachment-item">
						<span className="attachment-icon">📄</span>
						<a href="#" className="attachment-name">server_logs.txt</a>
						<span className="attachment-size">124 KB</span>
					</li>
					<li className="attachment-item">
						<span className="attachment-icon">📄</span>
						<a href="#" className="attachment-name">transaction_data.json</a>
						<span className="attachment-size">78 KB</span>
					</li>
				</ul>
			</div>

			<TaskComments />
		</div>
	);

}

export default TaskDetails;



{/* <div className="ticket-actions">
	<button className="action-button primary-button">Add Comment</button>
	<button className="action-button secondary-button">Assign to Me</button>
	<button className="action-button secondary-button">Change Status</button>
</div> */}