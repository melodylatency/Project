import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-teal-400">
      <Container>
        <Row>
          <Col className="text-center py-3">
            <p className="text-black text-lg opacity-70">
              {t("brand")} &copy; {currentYear}
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
