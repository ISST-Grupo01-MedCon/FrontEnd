import '../App.css';
import React from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Navbar} from "react-bootstrap";


function Header(props) {
    return (
        <Navbar>
            <Container>
                <Navbar.Brand href="/"><img src="/logo.png" alt="Logo de MedCon"/></Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                             <Container fluid>
                                 <Row>
                                     <Col md="auto"><a href="/"><Button variant="light" size="lg" style={{backgroundColor: "#FFFFFF", color: "#222222"}}>Home</Button></a></Col>
                                     <Col md="auto"><a href="/medico/lista_siguientes_pacientes"><Button variant="light" size="lg" style={{backgroundColor: "#FFFFFF", color: "#222222"}}>Gestión de la cola</Button></a></Col>
                                     <Col md="auto"><a href="/contacto"><Button variant="light" size="lg" style={{backgroundColor: "#FFFFFF", color: "#222222"}}>Contacto</Button></a></Col>
                                     <Col md="auto"><a href="/medico/login"><Button variant="light" size="lg" style={{backgroundColor: "#6bb549", color: "#FFFFFF"}}>Logout</Button></a></Col>
                                 </Row>
                             </Container>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
