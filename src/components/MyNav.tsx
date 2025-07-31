import { Navbar, Nav, Container } from 'react-bootstrap';

const MyNav = () => {
  return (
    <Navbar className="navbar-custom" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand href="#" className="navbar-brand">
          <i className="bi bi-book-half me-2"></i>
          EpicBooks
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#" className="nav-link mx-3">
              <i className="bi bi-house me-1"></i>
              Home
            </Nav.Link>
            <Nav.Link href="#" className="nav-link mx-3">
              <i className="bi bi-info-circle me-1"></i>
              About
            </Nav.Link>
            <Nav.Link href="#" className="nav-link mx-3">
              <i className="bi bi-search me-1"></i>
              Browse
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNav;