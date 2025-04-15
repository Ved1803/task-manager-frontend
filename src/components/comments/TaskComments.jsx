import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../services/api";
import CreateComments from "./CreateComments";

const TaskComments = () => {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskComments = async () => {
      try {
        const response = await API.get(`/tasks/${id}/comments`);
        setComments(response.data);
      } catch (error) {
        toast.error("Failed to fetch task comments!");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskComments();
  }, [id]);

  const handleCommentAdded = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };

  if (loading) return <p>Loading comments...</p>;

  return (
    <div className="ticket-comments">
      <h3>Comments ({comments.length})</h3>
      <CreateComments taskId={id} onCommentAdded={handleCommentAdded} />
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <span className="comment-author">{comment.user.name}</span>
              <span className="comment-time">{comment.created_at}</span>
            </div>
            <div className="comment-content">
              <p>{comment.body}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No comments available.</p>
      )}
    </div>
  );
};

export default TaskComments;

