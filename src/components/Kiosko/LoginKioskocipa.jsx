import {Button, Col, Container, Form, Row} from "react-bootstrap";
import React, {useState} from "react";
import {greenButtonStyle} from "../../styles";
import { useNavigate } from "react-router-dom";

export const LoginKioskocipa = (props) => {
    const navigate = useNavigate();
    const [CIPA, setCIPA] = useState("");

    const onChangeCIPA = (event) =>{
        setCIPA(event.target.value);
    }
    const submitCIPA = (event) => {
        event.preventDefault();
        props.cambiarModoPaciente("registrado", CIPA, "kioskoCIPA");
        navigate("/paciente/ticket/"+props.getIDPacienteKiosko(CIPA));
    }
    return(
        <Container style={{paddingTop: 40}}>
            <Row>
                <Col style={{textAlign: "center", fontWeight: "bold"}}><h1>Identificación CIPA</h1></Col>
            </Row>
            <Row>
                <Form onSubmit={(event) => {submitCIPA(event)}}>
                    <Row style={{paddingTop: 10}} className="justify-content-md-center">
                        <Col xs={4}>
                            <img alt="Logo MedCon" src="/logo.png"/>
                            <Form.Group style={{paddingTop: 20}} className="mb-3" controlId="formBasicID">
                                <Form.Control type="plainText" placeholder="ID tarjeta" onChange={onChangeCIPA} value={CIPA}/>
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