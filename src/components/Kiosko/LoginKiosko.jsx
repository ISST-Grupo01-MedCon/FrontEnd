import {Button, Col, Container, Form, Row} from "react-bootstrap";
import React from "react";
import {blueBigButton} from "../../styles";
import {useNavigate} from "react-router-dom";
export const LoginKiosko = (props) => {
    const navigate = useNavigate();

    return(
        <Container style={{paddingTop: 40}}>
            <Form>
            <Row className="justify-content-md-center">
                <Col xs={4}>
                    <img alt="Logo MedCon" src="/logo.png"/>
                </Col>
            </Row>
            <Row style={{paddingTop: 40}}>
                <Col style={{textAlign: "center", fontWeight: "bold", marginBottom:40}}><h1><p>Para registrar su presencia,</p><p>por favor inserte</p> su DNI o su CIPA.</h1></Col>
            </Row>
            <Row style={{paddingBottom: 10}}>
                <Col><Button onClick={() => navigate("/paciente/login/dni")} style = {blueBigButton}>AUNTENTICAR CON DNI</Button></Col>
                <Col><Button onClick={() => navigate("/paciente/login/cipa")} style = {blueBigButton}>AUNTENTICAR CON CIPA</Button></Col>
            </Row>
            </Form>
        </Container>
    );
};