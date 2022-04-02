import '../App.css';
import React from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Navbar} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {greenButtonStyle, whiteNoBorderButton} from "../styles";
import styles from "../App.css";

export function HeaderHome(props) {
    const navigate = useNavigate();
    return (
        <Navbar>
            <Container>
                <Navbar.Brand href="/" ><img src="/logo.png" alt="Logo de MedCon" style = {{alignSelf: "center"}}/></Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                             <Container fluid>
                                 <Row>
                                     <Col md="auto"><Button onClick={() => navigate("/contacto")} variant="light" size="lg" style={whiteNoBorderButton}>Contacto</Button></Col>
                                     <Col md="auto"><Button onClick={() => navigate("/medico/login")} variant="light" size="lg" style={greenButtonStyle}>Logout</Button></Col>
                                 </Row>
                             </Container>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

