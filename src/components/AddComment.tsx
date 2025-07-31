import React, { useState } from 'react';

interface AddCommentProps {
  asin: string;
  onAdd: () => void;
}

const AddComment: React.FC<AddCommentProps> = ({ asin, onAdd }) => {
  const [comment, setComment] = useState('');
  const [rate, setRate] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://striveschool-api.herokuapp.com/api/comments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODcwYzZjMDc4Y2RkZjAwMTU1ZDY3YTkiLCJpYXQiOjE3NTMzNTQ4NzYsImV4cCI6MTc1NDU2NDQ3Nn0.QRF8Q1Nj8suWJOoxaCrBXF_35fj1e9UeY3FpK8oBg54',
        },
        body: JSON.stringify({
          comment,
          rate,
          elementId: asin,
        }),
      });
      if (!res.ok) throw new Error('Errore nell\'invio del commento');
      setComment('');
      setRate(1);
      onAdd();
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
        style={{ cursor: 'pointer', fontSize: '1.5rem' }}
        onClick={() => setRate(i + 1)}
      ></i>
    ));
  };

  return (
    <div className="add-comment-form animate-fade-in">
      <h4 className="form-title">
        <i className="bi bi-plus-circle me-2"></i>
        Aggiungi una recensione
      </h4>
      
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <div>
          <label className="form-label fw-semibold">
            <i className="bi bi-chat-text me-2"></i>
            La tua recensione
          </label>
          <textarea
            className="form-control"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Condividi la tua esperienza con questo libro..."
            required
            rows={4}
          />
        </div>
        
        <div>
          <label className="form-label fw-semibold">
            <i className="bi bi-star me-2"></i>
            Voto
          </label>
          <div className="d-flex align-items-center gap-3">
            <div className="stars-container">
              {renderStars(rate)}
            </div>
            <span className="fw-bold text-primary">({rate}/5)</span>
          </div>
        </div>
        
        <button 
          className="submit-btn" 
          type="submit" 
          disabled={loading || !comment.trim()}
        >
          {loading ? (
            <>
              <span className="loading-spinner me-2"></span>
              Invio in corso...
            </>
          ) : (
            <>
              <i className="bi bi-send me-2"></i>
              Pubblica recensione
            </>
          )}
        </button>
        
        {error && (
          <div className="error-message">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddComment; 