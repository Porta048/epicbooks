import { Card } from 'react-bootstrap';

interface Book {
  asin: string;
  title: string;
  img: string;
  price: number;
  category: string;
  selected?: boolean;
  onSelect?: () => void;
}

const SingleBook = ({ asin, title, img, price, category, selected, onSelect }: Book) => {
  return (
    <Card
      className={`book-card h-100 ${selected ? 'selected' : ''}`}
      onClick={onSelect}
      style={{ cursor: 'pointer' }}
    >
      <div className="position-relative overflow-hidden">
        <Card.Img
          variant="top"
          src={img}
          alt={title}
          style={{ height: '300px', objectFit: 'contain', background: '#fff' }}
          className="rounded-top"
        />
        <div className="position-absolute top-0 end-0 m-2">
          <span className="book-category">
            {category}
          </span>
        </div>
        {selected && (
          <div className="position-absolute top-0 start-0 m-2">
            <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center" 
                 style={{ width: '30px', height: '30px' }}>
              <i className="bi bi-check-lg"></i>
            </div>
          </div>
        )}
      </div>
      
      <Card.Body className="book-card-body">
        <Card.Title className="book-title text-truncate">
          {title}
        </Card.Title>
        <div className="d-flex justify-content-between align-items-center">
          <span className="book-price">
            € {price.toFixed(2)}
          </span>
          <div className="text-warning">
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star"></i>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SingleBook; 