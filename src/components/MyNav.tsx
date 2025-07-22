import { Navbar, Nav, Container } from 'react-bootstrap';

const MyNav = () => {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm sticky-top">
      <Container>
        <Navbar.Brand href="#" className="fw-bold">
          <i className="bi bi-book me-2"></i>
          EpicBooks
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#" className="mx-2 fw-semibold">Home</Nav.Link>
            <Nav.Link href="#" className="mx-2 fw-semibold">About</Nav.Link>
            <Nav.Link href="#" className="mx-2 fw-semibold">Browse</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNav;