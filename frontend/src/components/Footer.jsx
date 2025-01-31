import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-blue-300">
      <Container>
        <Row>
          <Col className="text-center py-3">
            <p className="text-black text-lg opacity-70">
              Daniel's User Management &copy; {currentYear}
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
