import React, { useState } from "react";
import { Tabs, Tab, Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faTags,
  faUsers,
  faBoxOpen,
  faFileContract,
  faAddressBook,
  faEnvelope,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import BrandManagement from "../components/BrandManagement";
import FairManagement from "../components/FairManagement";
import MaterialBrandManagement from "../components/MaterialBrandManagement";
import ContractBrandManagement from "../components/ContractBrandManagement";
import ContactManagement from "../components/ContactManagement";
import NewsletterManagement from "../components/NewsletterManagement";
import TeamManagement from "../components/TeamManagement";

function AdminDashboard() {
  const [key, setKey] = useState("fairs");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <section className="py-5 bg-light">
      <Container>
        <Row className="d-flex justify-content-between align-items-center mb-4">
          <Col></Col>
          <Col className="text-end">
            <Button variant="secondary" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <p className="text-center mb-4">
              Welcome to the admin dashboard. Here you can manage everything.
            </p>
            <Tabs
              id="admin-dashboard-tabs"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3"
            >
              <Tab
                eventKey="fairs"
                title={
                  <>
                    <FontAwesomeIcon icon={faCalendarAlt} /> Fairs
                  </>
                }
              >
                <FairManagement />
              </Tab>
              <Tab
                eventKey="brands"
                title={
                  <>
                    <FontAwesomeIcon icon={faTags} /> Brands
                  </>
                }
              >
                <BrandManagement />
              </Tab>
              <Tab
                eventKey="team"
                title={
                  <>
                    <FontAwesomeIcon icon={faUsers} /> Team
                  </>
                }
              >
                <TeamManagement />
              </Tab>
              <Tab
                eventKey="materials"
                title={
                  <>
                    <FontAwesomeIcon icon={faBoxOpen} /> Materials
                  </>
                }
              >
                <MaterialBrandManagement />
              </Tab>
              <Tab
                eventKey="contracts"
                title={
                  <>
                    <FontAwesomeIcon icon={faFileContract} /> Contracts
                  </>
                }
              >
                <ContractBrandManagement />
              </Tab>
              <Tab
                eventKey="contacts"
                title={
                  <>
                    <FontAwesomeIcon icon={faAddressBook} /> Contacts
                  </>
                }
              >
                <ContactManagement />
              </Tab>
              <Tab
                eventKey="newsletter"
                title={
                  <>
                    <FontAwesomeIcon icon={faEnvelope} /> Newsletter
                  </>
                }
              >
                <NewsletterManagement />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default AdminDashboard;
