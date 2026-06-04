import React, { useState } from "react";
import { Tabs, Tab, Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTags,
  faUsers,
  faBoxOpen,
  faFileContract,
  faAddressBook,
  faEnvelope,
  faSignOutAlt,
  faChartPie,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardOverview from "../components/DashboardOverview";
import BrandManagement from "../components/BrandManagement";
import MaterialBrandManagement from "../components/MaterialBrandManagement";
import ContractBrandManagement from "../components/ContractBrandManagement";
import ContactManagement from "../components/ContactManagement";
import NewsletterManagement from "../components/NewsletterManagement";
import TeamManagement from "../components/TeamManagement";
import AccountSettings from "../components/AccountSettings";

function AdminDashboard() {
  const [key, setKey] = useState("overview");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm("Vuoi uscire dal pannello di amministrazione?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <section className="py-5 bg-light" style={{ minHeight: "100vh" }}>
      <Container>
        <Row className="d-flex justify-content-between align-items-center mb-4">
          <Col>
            <h4 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 300 }}>
              Pannello di Amministrazione
            </h4>
          </Col>
          <Col className="text-end">
            <Button variant="outline-secondary" size="sm" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className="me-1" /> Esci
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Tabs
              id="admin-dashboard-tabs"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-4"
            >
              <Tab eventKey="overview" title={<><FontAwesomeIcon icon={faChartPie} className="me-1" />Panoramica</>}>
                <DashboardOverview />
              </Tab>
              <Tab eventKey="brands" title={<><FontAwesomeIcon icon={faTags} className="me-1" />Brands</>}>
                <BrandManagement />
              </Tab>
              <Tab eventKey="team" title={<><FontAwesomeIcon icon={faUsers} className="me-1" />Team</>}>
                <TeamManagement />
              </Tab>
              <Tab eventKey="materials" title={<><FontAwesomeIcon icon={faBoxOpen} className="me-1" />Materiali</>}>
                <MaterialBrandManagement />
              </Tab>
              <Tab eventKey="contracts" title={<><FontAwesomeIcon icon={faFileContract} className="me-1" />Contract</>}>
                <ContractBrandManagement />
              </Tab>
              <Tab eventKey="contacts" title={<><FontAwesomeIcon icon={faAddressBook} className="me-1" />Contatti</>}>
                <ContactManagement />
              </Tab>
              <Tab eventKey="newsletter" title={<><FontAwesomeIcon icon={faEnvelope} className="me-1" />Newsletter</>}>
                <NewsletterManagement />
              </Tab>
              <Tab eventKey="account" title={<><FontAwesomeIcon icon={faKey} className="me-1" />Account</>}>
                <AccountSettings />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default AdminDashboard;
