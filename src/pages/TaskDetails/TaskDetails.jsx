import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import './TaskDetails.css';
import API from "../../services/api";

const TaskDetails = () => {
	const { id } = useParams();
	const [task, setTask] =  useState(null);
	const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await API.get(`/tasks/${id}`);
		console.log(response.data.task, 'dekho')
        setTask(response.data.task);
      } catch (error) {
        toast.error("Failed to fetch task details!");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [id]);


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
					<div className="meta-label">Reported By</div>
					<div className="meta-value">John Smith</div>
				</div>
				<div className="meta-item">
					<div className="meta-label">Assigned To</div>
					<div className="meta-value">Jane Doe</div>
				</div>
				<div className="meta-item">
					<div className="meta-label">Priority</div>
					<div className="meta-value">High</div>
				</div>
				<div className="meta-item">
					<div className="meta-label">Created</div>
					<div className="meta-value">{ task.created_at }</div>
				</div>
				<div className="meta-item">
					<div className="meta-label">Due Date</div>
					<div className="meta-value">March 12, 2025</div>
				</div>
				<div className="meta-item">
					<div className="meta-label">Category</div>
					<div className="meta-value">Backend</div>
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

			<div className="ticket-comments">
				<h3>Comments (2)</h3>
				<div className="comment">
					<div className="comment-header">
						<span className="comment-author">Jane Doe</span>
						<span className="comment-time">Today at 10:23 AM</span>
					</div>
					<div className="comment-content">
						<p>I've reviewed the logs and it appears to be an issue with the transaction limit configuration. The payment gateway is rejecting transactions over $500 because we haven't updated our merchant settings after the recent upgrade.</p>
					</div>
				</div>
				<div className="comment">
					<div className="comment-header">
						<span className="comment-author">Mike Johnson</span>
						<span className="comment-time">Today at 11:05 AM</span>
					</div>
					<div className="comment-content">
						<p>I've contacted the payment gateway support team. They confirmed we need to update our API credentials and transaction limits in the merchant portal. I'll have this fixed by end of day.</p>
					</div>
				</div>
			</div>

			<div className="ticket-actions">
				<button className="action-button primary-button">Add Comment</button>
				<button className="action-button secondary-button">Assign to Me</button>
				<button className="action-button secondary-button">Change Status</button>
			</div>
		</div>
	);

}

export default TaskDetails;