import { Alert, Container, Row, Col, Button } from 'react-bootstrap';

const Welcome = () => {
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Alert variant="primary" className="shadow-sm border-0">
            <Alert.Heading className="fw-bold">Benvenuto su EpicBooks!</Alert.Heading>
            <p className="mb-0">Scopri la nostra vasta collezione di libri fantastici.</p>
            <hr />
            <div className="d-flex justify-content-end">
              <Button variant="outline-primary">Esplora ora</Button>
            </div>
          </Alert>
          <h2 className="text-center mb-4 mt-5 fw-bold text-primary">Il tuo negozio di libri fantasy</h2>
          <p className="text-center text-muted mb-5">Trova i migliori titoli fantasy selezionati per te</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Welcome;