import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Header = () => {
  return (
    <Navbar bg="light" expand="lg">
      <LinkContainer to="/">
        <Navbar.Brand>Lazy Coder</Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <LinkContainer to="/config">
            <Nav.Link>Configurations</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/about">
            <Nav.Link>About</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
