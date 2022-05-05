import {Button, Col, Container} from "react-bootstrap";
import React from "react";
import {useNavigate} from "react-router-dom";
import {ticketTextDataStyle, greenButtonStyle} from "../../styles";

export const PacienteRegistradoKiosko = (props) => {
    const navigate = useNavigate();
    const query = props.useQuery();
    const ticketID = query.get("ticketID");

    return(
        <Container style={{paddingTop: 40}}>
            <Col>
                <h1>Su identificador es:</h1>
                <p style={ticketTextDataStyle}>{ticketID}</p>
                <h1>Su sala de espera es:</h1>
                <p style={ticketTextDataStyle}>{props.salaDeEspera}</p>
                <Button onClick={() => navigate("/paciente/login")} variant="light" size="lg" style={greenButtonStyle} type="submit">
                    Salir
                </Button>
            </Col>
        </Container>
    );
};