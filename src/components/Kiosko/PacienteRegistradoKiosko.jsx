import {Button, Col, Container} from "react-bootstrap";
import React from "react";


export const PacienteRegistradoKiosko = (props) => {
    return(
        <Container>
            <Col>
                <h1>Su identificador es:</h1>
                <p style={{fontSize: 36}}>X46</p>
                <h1>Su sala de espera es:</h1>
                <p style={{fontSize: 36}}>PEDIATRÍA</p>
                <a href="/paciente/login">
                    <Button variant="light" size="lg" style={{backgroundColor: "#6bb549", color: "#FFFFFF"}} type="submit">
                        Salir
                    </Button>
                </a>
            </Col>
        </Container>
    );
};