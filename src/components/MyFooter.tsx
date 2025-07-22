import { Container, Row, Col } from 'react-bootstrap';

const MyFooter = () => {
  return (
    <footer className="bg-primary text-white py-4 mt-5 shadow-lg">
      <Container>
        <Row>
          <Col md={4}>
            <h5 className="fw-bold">EpicBooks</h5>
            <p>Il tuo negozio di libri online preferito</p>
          </Col>
          <Col md={4} className="text-center d-flex flex-column justify-content-center">
            <div className="mb-2">
              <i className="bi bi-facebook mx-2 fs-4"></i>
              <i className="bi bi-twitter mx-2 fs-4"></i>
              <i className="bi bi-instagram mx-2 fs-4"></i>
            </div>
          </Col>
          <Col md={4} className="text-md-end">
            <p className="mb-1">© {new Date().getFullYear()} EpicBooks</p>
            <p className="small">Tutti i diritti riservati.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default MyFooter;