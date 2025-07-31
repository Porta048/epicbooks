import { Container, Row, Col } from 'react-bootstrap';

const MyFooter = () => {
  return (
    <footer className="footer-custom">
      <Container>
        <Row className="align-items-center">
          <Col md={4}>
            <h5 className="footer-title">
              <i className="bi bi-book-half me-2"></i>
              EpicBooks
            </h5>
            <p className="footer-text">
              Il tuo negozio di libri online preferito. Scopri mondi fantastici tra le pagine dei nostri libri.
            </p>
          </Col>
          
          <Col md={4} className="text-center">
            <div className="social-icons">
              <div className="social-icon">
                <i className="bi bi-facebook fs-5"></i>
              </div>
              <div className="social-icon">
                <i className="bi bi-twitter fs-5"></i>
              </div>
              <div className="social-icon">
                <i className="bi bi-instagram fs-5"></i>
              </div>
              <div className="social-icon">
                <i className="bi bi-youtube fs-5"></i>
              </div>
            </div>
            <p className="footer-text mt-3">
              Seguici sui social per rimanere aggiornato
            </p>
          </Col>
          
          <Col md={4} className="text-md-end">
            <div className="footer-text">
              <p className="mb-1">
                <i className="bi bi-c-circle me-1"></i>
                {new Date().getFullYear()} EpicBooks
              </p>
              <p className="small opacity-75">
                Tutti i diritti riservati.
              </p>
              <p className="small opacity-75">
                Made with <i className="bi bi-heart-fill text-danger"></i> in Italy
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default MyFooter;