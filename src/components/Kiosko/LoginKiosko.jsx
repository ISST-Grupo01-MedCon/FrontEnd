import {Button, Col, Container, Form, Row} from "react-bootstrap";
import React from "react";
import {blueBigButton} from "../../styles";
import {useNavigate} from "react-router-dom";
export const LoginKiosko = (props) => {
    const navigate = useNavigate();

    return(
        <Container>
            <Form>
            <Row className="justify-content-md-center">
                <Col xs={4}>
                    <img alt="Logo MedCon" src="/logo.png"/>
                </Col>
            </Row>
            <Row>
                <Col style={{textAlign: "center", fontWeight: "bold", marginBottom:100}}><h1><p>PARA REGISTRAR SU PRESENCIA</p><p>POR FAVOR ELIJA SI INSERTAR</p> SU DNI O SU CIPA</h1></Col>
            </Row>
            <Row>
                <Col><Button onClick={() => navigate("/paciente/login/dni")} style = {blueBigButton}>AUNTENTICAR CON DNI</Button></Col>
                <Col><Button onClick={() => navigate("/paciente/login/cipa")} style = {blueBigButton}>AUNTENTICAR CON CIPA</Button></Col>
            </Row>
            </Form>
        </Container>
    );
};