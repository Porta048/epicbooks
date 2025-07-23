import { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import SingleBook from './SingleBook';

interface Book {
  asin: string;
  title: string;
  img: string;
  price: number;
  category: string;
}

interface BookListProps {
  books: Book[];
}

const BookList = ({ books }: BookListProps) => {
  const [search, setSearch] = useState('');
  const [selectedAsin, setSelectedAsin] = useState<string | null>(null);

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container className="mb-5">
      <h3 className="mb-4 text-center fw-bold">La nostra collezione</h3>
      <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder="Cerca per titolo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </Form>
      <Row className="g-4">
        {filteredBooks.map((book) => (
          <Col xs={12} sm={6} md={4} lg={3} key={book.asin}>
            <SingleBook
              {...book}
              selected={selectedAsin === book.asin}
              onSelect={() => setSelectedAsin(selectedAsin === book.asin ? null : book.asin)}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default BookList; 