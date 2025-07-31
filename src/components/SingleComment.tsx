import React, { useState } from 'react';

interface Comment {
  _id: string;
  comment: string;
  rate: number;
  elementId: string;
}

interface SingleCommentProps {
  comment: Comment;
  onDelete: (id: string) => void;
}

const SingleComment: React.FC<SingleCommentProps> = ({ comment, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://striveschool-api.herokuapp.com/api/comments/${comment._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODcwYzZjMDc4Y2RkZjAwMTU1ZDY3YTkiLCJpYXQiOjE3NTMzNTQ4NzYsImV4cCI6MTc1NDU2NDQ3Nn0.QRF8Q1Nj8suWJOoxaCrBXF_35fj1e9UeY3FpK8oBg54',
        },
      });
      if (!res.ok) throw new Error('Errore nella cancellazione');
      onDelete(comment._id);
    } catch (err: any) {
      setError(err.message || 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rate: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i 
        key={i} 
        className={`bi ${i < rate ? 'bi-star-fill' : 'bi-star'} stars`}
      ></i>
    ));
  };

  return (
    <div className="comment-item animate-fade-in">
      <div className="comment-rating">
        <strong>Voto:</strong>
        <div className="d-flex align-items-center">
          {renderStars(comment.rate)}
          <span className="ms-2 fw-bold text-primary">({comment.rate}/5)</span>
        </div>
      </div>
      
      <div className="comment-text">
        "{comment.comment}"
      </div>
      
      <div className="comment-actions">
        <small className="text-muted">
          <i className="bi bi-clock me-1"></i>
          Recensione recente
        </small>
        <button 
          className="delete-btn" 
          onClick={handleDelete} 
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading-spinner me-2"></span>
              Eliminando...
            </>
          ) : (
            <>
              <i className="bi bi-trash me-1"></i>
              Elimina
            </>
          )}
        </button>
      </div>
      
      {error && (
        <div className="error-message mt-2">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}
    </div>
  );
};

export default SingleComment; 