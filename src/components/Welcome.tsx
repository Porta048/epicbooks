import { useEffect, useState } from 'react';
import { Alert, Container, Row, Col, Button } from 'react-bootstrap';

const Welcome = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <div 
            className="welcome-section animate-fade-in"
            style={{
              transform: `translateY(${scrollY * 0.1}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div className="position-relative">
              <h1 className="welcome-title text-center mb-3">
                Benvenuto su EpicBooks!
              </h1>
              <p className="welcome-subtitle text-center mb-4">
                Scopri la nostra vasta collezione di libri fantastici e immergiti in mondi straordinari
              </p>
              <div className="text-center">
                <Button className="welcome-btn animate-pulse">
                  <i className="bi bi-arrow-right me-2"></i>
                  Esplora ora
                </Button>
              </div>
            </div>
          </div>
          
          <div 
            className="text-center mt-5 animate-fade-in" 
            style={{ 
              animationDelay: '0.3s',
              transform: `translateY(${scrollY * 0.05}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <h2 className="gradient-text fw-bold mb-3">
              Il tuo negozio di libri fantasy
            </h2>
            <p className="text-muted fs-5 mb-5">
              Trova i migliori titoli fantasy selezionati per te dai nostri esperti
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Welcome;