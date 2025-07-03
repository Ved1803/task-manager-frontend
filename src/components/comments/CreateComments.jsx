import React, { useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../services/api';
// import { ReactComponent as SendIcon } from '../../assets/send-plane.svg';

const CreateComments = ({ taskId, onCommentAdded }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!commentText.trim()) return;
    try {
      const response = await API.post(`/tasks/${taskId}/comments`, { body: commentText });
      onCommentAdded(response.data);
      setCommentText('');
    } catch (error) {
      toast.error('Failed to submit comment.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="jira-comment-form" style={{ position: 'relative', marginBottom: 16 }}>
      <input
        type="text"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Add a comment..."
        className="jira-comment-input"
        style={{
          width: '100%',
          padding: '14px 48px 14px 16px',
          borderRadius: 12,
          background: '#2c2f4a',
          color: '#fff',
          border: 'none',
          boxShadow: '0 2px 8px rgba(20,40,80,0.13)',
          fontSize: '1rem',
          outline: 'none',
        }}
        autoComplete="off"
      />
      <button
        type="submit"
        className="jira-comment-send-btn"
        style={{
          position: 'absolute',
          right: 10,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
        }}
        aria-label="Send comment"
        disabled={!commentText.trim()}
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path d="M2 21l21-9-21-9v7l15 2-15 2v7z" fill="#4f8cff"/>
        </svg>
      </button>
    </form>
  );
};

export default CreateComments;
