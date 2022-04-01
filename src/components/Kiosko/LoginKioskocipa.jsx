import {Button, Col, Container, Form, Row} from "react-bootstrap";
import React from "react";
import {greenButtonStyle} from "../../styles";
import { useNavigate } from "react-router-dom";

export const LoginKioskocipa = (props) => {
    const navigate = useNavigate();
    return(
        <Container>
            <Row>
                <Col style={{textAlign: "center", fontWeight: "bold"}}><h1>Identificación CIPA</h1></Col>
            </Row>
            <Row>
                <Form>
                    <Row className="justify-content-md-center">
                        <Col xs={4}>
                            <img alt="Logo MedCon" src="/logo.png"/>
                            <Form.Group className="mb-3" controlId="formBasicID">
                                <Form.Control type="plainText" placeholder="ID tarjeta"/>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row xs={4} className="justify-content-md-center">
                        <Col>
                            <Button variant="light" size="lg" style={greenButtonStyle} type="submit" onClick={() => navigate("/paciente/ticket")}>
                                Registrar asistencia
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Row>
        </Container>
    );
};