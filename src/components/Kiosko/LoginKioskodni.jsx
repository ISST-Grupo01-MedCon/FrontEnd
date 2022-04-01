import {Button, Col, Container, Form, Row} from "react-bootstrap";
import React, {useState, useEffect} from "react";
import {greenButtonStyle} from "../../styles";
import { useNavigate } from "react-router-dom";


export const LoginKioskodni = (props) => {
    const navigate = useNavigate();
    const [dni, setDni] = useState('');
    
    const onChangeDni = (event) =>{
        setDni(event.target.value);
    }
    const submitdni = (event) => {
        let dnis = props.dnis;
        let dni = event.target.value;
        console.log("el dni es"+dni);
        console.log("los dniss"+dnis);
        for(let i in dnis){
            if (i == dni){
                props.buscarid(dni);
            }
        }
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
                            <Button variant="light" size="lg" style={greenButtonStyle} type="submit" onClick={() => navigate("/paciente/ticket")} ticketId = {props.ticketId}>
                                Registrar asistencia
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Row>
        </Container>
    );
};