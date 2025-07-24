import { Card } from 'react-bootstrap';
import CommentArea from './CommentArea';

interface Book {
  asin: string;
  title: string;
  img: string;
  price: number;
  category: string;
  selected?: boolean;
  onSelect?: () => void;
}

const SingleBook = ({ asin, title, img, selected, onSelect }: Book) => {
  return (
    <Card
      className={`h-100 shadow-sm border-0 transition-transform hover-scale ${selected ? 'border-danger border-3' : ''}`}
      onClick={onSelect}
      style={{ cursor: 'pointer' }}
    >
      <Card.Img
        variant="top"
        src={img}
        alt={title}
        style={{ height: '300px', objectFit: 'contain', background: '#fff' }}
        className="rounded-top"
      />
      <Card.Body>
        <Card.Title className="text-truncate fw-bold">{title}</Card.Title>
      </Card.Body>
      {selected && <CommentArea asin={asin} />}
    </Card>
  );
};

export default SingleBook; 