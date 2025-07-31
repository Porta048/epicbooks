import { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import SingleBook from './SingleBook';
import CommentArea from './CommentArea';

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

  // Animazione per elementi che entrano nel viewport
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.fade-in-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [filteredBooks]);

  return (
    <Container className="mb-5">
      <div className="text-center mb-5 animate-fade-in">
        <h2 className="gradient-text fw-bold mb-3">La nostra collezione</h2>
        <p className="text-muted fs-5">Scopri i migliori titoli fantasy selezionati per te</p>
      </div>
      
      <div className="search-container animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <Form.Control
          type="text"
          placeholder="🔍 Cerca per titolo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
      </div>
      
      <Row>
        <Col md={8}>
          <Row className="g-4">
            {filteredBooks.map((book, index) => (
              <Col xs={12} sm={6} md={4} lg={3} key={book.asin}>
                <div 
                  className="fade-in-on-scroll" 
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <SingleBook
                    {...book}
                    selected={selectedAsin === book.asin}
                    onSelect={() => setSelectedAsin(book.asin)}
                  />
                </div>
              </Col>
            ))}
          </Row>
          
          {filteredBooks.length === 0 && (
            <div className="empty-state animate-fade-in">
              <div className="empty-state-icon">
                <i className="bi bi-search"></i>
              </div>
              <div className="empty-state-title">Nessun libro trovato</div>
              <div className="empty-state-text">
                Prova a modificare i termini di ricerca
              </div>
            </div>
          )}
        </Col>
        
        <Col md={4}>
          <div className="comments-section animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {selectedAsin ? (
              <CommentArea asin={selectedAsin} />
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <i className="bi bi-chat-dots"></i>
                </div>
                <div className="empty-state-title">Seleziona un libro</div>
                <div className="empty-state-text">
                  Per visualizzare i commenti, clicca su un libro dalla lista
                </div>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BookList; 