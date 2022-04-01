import {Container, Col, Row, Image} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import React from "react";
import {whiteButtonStyle} from "../../styles";

export const CabeceraPaciente = (props) => {
    return(
        <Container fluid="true">
            <Row>
                <Col><Button variant="light" size="lg" style={whiteButtonStyle} onClick={props.volver}>Volver</Button></Col>
                <Col><h2>Paciente: {props.datosTodosLosPacientes[parseInt(props.id)].nombre}</h2></Col>
                <Col><Image rounded width={100} height={100} alt={"Foto de perfil de "+props.datosTodosLosPacientes[parseInt(props.id)].nombre} src="/profile.png"/></Col>
            </Row>
        </Container>
    );
};