import React from 'react';
import SingleComment from './SingleComment';

interface Comment {
  _id: string;
  comment: string;
  rate: number;
  elementId: string;
}

interface CommentsListProps {
  comments: Comment[];
  onDelete: (id: string) => void;
}

const CommentsList: React.FC<CommentsListProps> = ({ comments, onDelete }) => (
  <ul className="list-group mb-3">
    {comments.map((c) => (
      <SingleComment key={c._id} comment={c} onDelete={onDelete} />
    ))}
  </ul>
);

export default CommentsList; 