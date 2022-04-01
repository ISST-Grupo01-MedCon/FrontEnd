import {Button, Col, Container} from "react-bootstrap";
import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {ticketTextDataStyle, greenButtonStyle} from "../../styles";

export const PacienteRegistradoKiosko = (props) => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [ticketID, setTicketID] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await (await fetch('/consultas/'+id)).json();
            return data;
        }
        setTimeout(() => {
            //Recogemos los datos del BackEnd de MedCon
            fetchData()
                .catch(console.error)
                .then(paciente => {
                    setTicketID(paciente.ticketId);
                });
        }, 100);
        
    });

    return(
        <Container>
            <Col>
                <h1>Su identificador es:</h1>
                <p style={ticketTextDataStyle}>{ticketID}</p>
                <h1>Su sala de espera es:</h1>
                <p style={ticketTextDataStyle}>PEDIATRÍA</p>
                <Button onClick={() => navigate("/paciente/login")} variant="light" size="lg" style={greenButtonStyle} type="submit">
                    Salir
                </Button>
            </Col>
        </Container>
    );
};