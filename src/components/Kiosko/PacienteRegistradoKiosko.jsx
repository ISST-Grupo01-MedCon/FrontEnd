import {Button, Col, Container} from "react-bootstrap";
import React, { useEffect, useState } from "react";
import {ticketTextDataStyle, greenButtonStyle} from "../../styles";

export const PacienteRegistradoKiosko = (props) => {

    useEffect(() => {
        /*const fetchData = async () => {
            const data = await (await fetch('http://localhost:8080/consultas')).json();
            return data;
        }
        //Recogemos los datos del BackEnd de MedCon
        fetchData()
            .catch(console.error)
            .then(data => {
                let arraySP = [];
                let arrayPD = [];
                let arrayTLP = [];

                // Clasificamos los pacientes en función de sus atributos
                for (let i in data) {
                    arrayTLP[parseInt(data[i].id)] = data[i].paciente;
                    if (data[i].descartado) {
                        arrayPD.push(parseInt(data[i].id));
                    } else if ((data[i].ticketId !== null) && (data[i].ticketId !== undefined) && (data[i].ticketId !== "")) {
                        arraySP.push([data[i].ticketId, parseInt(data[i].id)]);
                    }
                }

                setDatosTodosLosPacientes(arrayTLP);
                setDatosSiguientesPacientes(arraySP);
                setPacientesNoAtendidos(arrayPD);
            });*/
        
    }, []);

    const getTicket = () =>{
        let id = parseInt(props.useQuery("id"));
        for(let paciente of props.datosSiguientesPacientes){
            if(parseInt(paciente[1]) === id){
                return paciente[0];
            }
        }
    }

    return(
        <Container>
            <Col>
                <h1>Su identificador es:</h1>
                <p style={ticketTextDataStyle}>{getTicket()}</p>
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