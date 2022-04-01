import {Button, Col, Container, Form, Row} from "react-bootstrap";
import React, {useState, useEffect} from "react";
import {greenButtonStyle} from "../../styles";
import { useNavigate } from "react-router-dom";


export const LoginKioskodni = (props) => {
    const navigate = useNavigate();
    const [dni, setDni] = useState("");
    const [ticket, setTicket] = useState();
    
    const onChangeDni = (event) =>{
        setDni(event.target.value);
    }
    const submitdni = (event) => {
        event.preventDefault();
        props.cambiarModoPaciente("registrado", dni, "kiosko");
        navigate("/paciente/ticket/"+props.getIDPacienteKiosko(dni)+"?dni="+dni);
    }
    return(
        <Container>
            <Row>
                <Col style={{textAlign: "center", fontWeight: "bold"}}><h1>Identificación DNI</h1></Col>
            </Row>
            <Row>
                <Form onSubmit = {(event)=>{console.log("algo"); submitdni(event)}}>
                    <Row className="justify-content-md-center">
                        <Col xs={4}>
                            <img alt="Logo MedCon" src="/logo.png"/>
                            <Form.Group className="mb-3" controlId="formBasicPassword" >
                                <Form.Control type="plainText" placeholder="NIF o NIE" onChange ={onChangeDni} value={dni}/>
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