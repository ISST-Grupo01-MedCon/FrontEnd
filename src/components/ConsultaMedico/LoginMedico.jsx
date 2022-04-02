import {Button, Col, Container, Form, Row} from "react-bootstrap";
import React from "react";
import {useNavigate} from "react-router-dom";
import {greenButtonStyle, headerStyle, whiteButtonStyle} from "../../styles";

export const LoginMedico = (props) => {
    const navigate = useNavigate();
    return(
        <Container>
            <Row>
                <Col style={headerStyle}><h1>Identificación</h1></Col>
            </Row>
            <Row>
                <Form>
                    <Row className="justify-content-md-center">
                        <Col xs={4}>
                            <Form.Group className="mb-3" controlId="formBasicID">
                                <Form.Control type="plainText" placeholder="ID médico"/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control type="password" placeholder="Contraseña" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row xs={4} className="justify-content-md-center">
                        <Col>
                            <Button onClick={() => navigate("/contacto")} variant="light" size="lg" style={whiteButtonStyle}>Incidencia</Button>
                        </Col>
                        <Col>
                            <Button variant="light" size="lg" style={greenButtonStyle} type="submit" onClick={() => navigate("/Home")}>
                                Login
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Row>
        </Container>
    );
};