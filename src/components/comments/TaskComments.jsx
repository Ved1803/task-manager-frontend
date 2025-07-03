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
        console.log(response);
        setComments(response.data);
      } catch (error) {
        console.log(error)
        toast.error("Failed to fetch task comments!");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskComments();
  }, [id]);

  const handleCommentAdded = (newComment) => {
    console.log(newComment, "bdkbcfkjcadsb");
    
    setComments((prevComments) => [...prevComments, newComment]);
  };

  if (loading) return <p>Loading comments...</p>;

  return (
    <div className="ticket-comments">
      <CreateComments taskId={id} onCommentAdded={handleCommentAdded} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 8 }}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="jira-comment-box"
            >
              <p style={{ fontWeight: 600, marginBottom: 2 }}>
                {comment?.user?.name || 'Unknown'}
                <span style={{ fontWeight: 400, fontSize: '0.85em', color: '#b6bac8', marginLeft: 10 }}>
                  {comment.created_at || '- -'}
                </span>
              </p>
              <p style={{ fontSize: '1rem', marginTop: 4 }}>{comment?.body}</p>
            </div>
          ))
        ) : (
          <p style={{ color: '#b6bac8', margin: 0 }}>No comments available.</p>
        )}
      </div>
    </div>
  );
};

export default TaskComments;

