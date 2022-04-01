import {Button, Col, Container, Form, Row} from "react-bootstrap";
import React,{useState, useEffect}  from "react";
import {greenButtonStyle} from "../../styles";
import {useNavigate} from "react-router-dom";
export const LoginKiosko = (props) => {
    const navigate = useNavigate();


    return(
        <Container>
            <Row className="justify-content-md-center">
                        <Col xs={4}>
                            <img alt="Logo MedCon" src="/logo.png"/>
                        </Col>
            </Row>
            <Row>
                <Col style={{textAlign: "center", fontWeight: "bold", marginBottom:100}}><h1><p>PARA REGISTRAR SU PRESENCIA</p><p>POR FAVOR ELIJA SI INSERTAR</p> SU DNI O SU CIPA</h1></Col>
            </Row>
            <Row>
                <Form>
                    <Button onClick={() => navigate("/paciente/login/dni")} style = {{padding: 100, marginRight: 100, fontSize:35}} >AUNTENTICAR CON DNI</Button>
                    <Button onClick={() => navigate("/paciente/login/cipa")} dnis = {props.dnis} style = {{padding: 100, fontSize:35}}>AUNTENTICAR CON CIPA</Button>
                    <Row xs={4} className="justify-content-md-center">
                    </Row>
                </Form>
            </Row>
        </Container>
    );
};