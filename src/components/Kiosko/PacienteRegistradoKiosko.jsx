import {Button, Col, Container} from "react-bootstrap";
import React from "react";
import {ticketTextDataStyle, greenButtonStyle} from "../../styles";

export const PacienteRegistradoKiosko = (props) => {
    return(
        <Container>
            <Col>
                <h1>Su identificador es:</h1>
                <p style={ticketTextDataStyle}>{props.identificador}</p>
                <h1>Su sala de espera es:</h1>
                <p style={ticketTextDataStyle}>PEDIATRÍA</p>
                <a href="/paciente/login">
                    <Button variant="light" size="lg" style={greenButtonStyle} type="submit">
                        Salir
                    </Button>
                </a>
            </Col>
        </Container>
    );
};