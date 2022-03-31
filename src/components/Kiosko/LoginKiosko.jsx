import {Button, Col, Container, Form, Row} from "react-bootstrap";
import React from "react";
import {greenButtonStyle, headerStyle} from "../../styles";

export const LoginKiosko = (props) => {
    return(
        <Container>
            <Row>
                <Col style={headerStyle}><h1>Identificación</h1></Col>
            </Row>
            <Row>
                <Form>
                    <Row className="justify-content-md-center">
                        <Col xs={4}>
                            <img alt="Logo MedCon" src="/logo.png"/>
                            <Form.Group className="mb-3" controlId="formBasicID">
                                <Form.Control type="plainText" placeholder="ID tarjeta"/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control type="password" placeholder="NIF o NIE" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row xs={4} className="justify-content-md-center">
                        <Col>
                            <Button variant="light" size="lg" style={greenButtonStyle} type="submit">
                                Registrar asistencia
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Row>
        </Container>
    );
};