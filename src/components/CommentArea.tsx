import React, { useEffect, useState } from 'react';
import CommentsList from './CommentsList';
import AddComment from './AddComment';
import Loading from './Loading';
import Error from './Error';

interface Comment {
  _id: string;
  comment: string;
  rate: number;
  elementId: string;
}

interface CommentAreaProps {
  asin: string;
}

const CommentArea: React.FC<CommentAreaProps> = ({ asin }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://striveschool-api.herokuapp.com/api/comments/${asin}`, {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODcwYzZjMDc4Y2RkZjAwMTU1ZDY3YTkiLCJpYXQiOjE3NTMzNTQ4NzYsImV4cCI6MTc1NDU2NDQ3Nn0.QRF8Q1Nj8suWJOoxaCrBXF_35fj1e9UeY3FpK8oBg54',
        },
      });
      if (!res.ok) throw new Error('Errore nel recupero dei commenti');
      const data = await res.json();
      setComments(data);
    } catch (err: any) {
      setError(err.message || 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  // componentDidUpdate equivalent - si attiva quando cambia asin
  useEffect(() => {
    if (asin) {
      fetchComments();
    }
  }, [asin]);

  const handleAddComment = () => {
    fetchComments();
  };

  const handleDeleteComment = (id: string) => {
    setComments((prev) => prev.filter((c) => c._id !== id));
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="animate-fade-in">
      <h3 className="comments-title">
        <i className="bi bi-chat-square-text me-2"></i>
        Recensioni ({comments.length})
      </h3>
      <CommentsList comments={comments} onDelete={handleDeleteComment} />
      <AddComment asin={asin} onAdd={handleAddComment} />
    </div>
  );
};

export default CommentArea; 