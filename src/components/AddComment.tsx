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

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
      <textarea
        className="form-control"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Scrivi una recensione..."
        required
      />
      <select
        className="form-select w-auto"
        value={rate}
        onChange={(e) => setRate(Number(e.target.value))}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? 'Invio...' : 'Aggiungi commento'}
      </button>
      {error && <div className="text-danger">{error}</div>}
    </form>
  );
};

export default AddComment; 