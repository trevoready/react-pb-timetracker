import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

export default function Topbar() {
  const { currentUser, logout } = useAuth();
  return (
    <Navbar className="bg-light" sticky="top" expand="lg">
      <Container>
        <Navbar.Brand href="/">Time Tracker</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Item>
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/timesheet">
                TimeSheet
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/workplaces">
                Workplaces
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Navbar.Text>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-person"
              viewBox="0 0 20 20"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"></path>
            </svg>
            Signed in as: {currentUser.name}&nbsp;
          </Navbar.Text>
          <Button variant="outline-danger" onClick={logout}>
            Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
