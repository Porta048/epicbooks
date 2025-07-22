import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';

interface Book {
  asin: string;
  title: string;
  img: string;
  price: number;
  category: string;
}

const AllTheBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    // Importa il file JSON
    const fetchBooks = async () => {
      try {
        // In un'applicazione reale, potresti usare fetch per ottenere i dati
        // ma in questo caso importiamo direttamente il file JSON
        const response = await import('../assets/fantasy.json');
        setBooks(response.default);
      } catch (error) {
        console.error('Errore nel caricamento dei libri:', error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <Container className="mb-5">
      <h3 className="mb-4 text-center fw-bold">La nostra collezione</h3>
      <p className="text-center text-muted mb-5">Esplora i nostri titoli fantasy più popolari</p>
      <Row className="g-4">
        {books.map((book) => (
          <Col xs={12} sm={6} md={4} lg={3} key={book.asin}>
            <Card className="h-100 shadow-sm border-0 transition-transform hover-scale">
              <div className="position-relative">
                <Card.Img 
                  variant="top" 
                  src={book.img} 
                  alt={book.title}
                  style={{ height: '300px', objectFit: 'cover' }}
                  className="rounded-top"
                />
                <Badge 
                  bg="primary" 
                  className="position-absolute top-0 end-0 m-2">
                  €{book.price.toFixed(2)}
                </Badge>
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-truncate fw-bold">{book.title}</Card.Title>
                <Card.Text className="text-muted small mb-3">{book.category.toUpperCase()}</Card.Text>
                <Button variant="outline-primary" className="mt-auto w-100">Dettagli</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AllTheBooks;