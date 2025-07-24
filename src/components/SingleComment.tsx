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

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <span>
        <strong>Voto:</strong> {comment.rate} <br />
        {comment.comment}
      </span>
      <div>
        <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={loading}>
          {loading ? '...' : 'Elimina'}
        </button>
        {error && <span className="text-danger ms-2">{error}</span>}
      </div>
    </li>
  );
};

export default SingleComment; 