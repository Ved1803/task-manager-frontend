import React, { useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../services/api';


const CreateComments = ({ taskId, onCommentAdded }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!commentText.trim()) return; // Prevent submitting empty comments

    try {
      const response = await API.post(`/tasks/${taskId}/comments`, { body: commentText });
      onCommentAdded(response.data); // Update the comments list
      setCommentText(''); // Clear the input field
    } catch (error) {
      toast.error('Failed to submit comment.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <input
        type="text"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Add a comment..."
        className="comment-input"
      />
      <button type="submit" className="comment-submit-button">➤</button>
    </form>
  );
};

export default CreateComments;
