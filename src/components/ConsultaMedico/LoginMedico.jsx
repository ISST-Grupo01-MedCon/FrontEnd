import {Button, Col, Container, Form, Row} from "react-bootstrap";
import React from "react";

export const LoginMedico = (props) => {
    return(
        <Container>
            <Row>
                <Col style={{textAlign: "center", fontWeight: "bold"}}><h1>Identificación</h1></Col>
            </Row>
            <Row>
                <Form>
                    <Row className="justify-content-md-center">
                        <Col xs={4}>
                            <Form.Group className="mb-3" controlId="formBasicID">
                                <Form.Control type="plainText" placeholder="ID médico"/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control type="password" placeholder="NIF o NIE" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row xs={4} className="justify-content-md-center">
                        <Col>
                            <Button variant="light" size="lg" style={{backgroundColor: "#FFFFFF", color: "#222222"}}>Incidencia</Button>
                        </Col>
                        <Col>
                            <Button variant="light" size="lg" style={{backgroundColor: "#6bb549", color: "#FFFFFF"}} type="submit">
                                Login
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Row>
        </Container>
    );
};