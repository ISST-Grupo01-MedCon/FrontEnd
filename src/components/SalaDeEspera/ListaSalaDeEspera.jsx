import React from "react";
import {Container, Table} from "react-bootstrap";

const Fila = (props) => {
    return (<tr>
        <td>{props.iden}</td><td>{props.consulta}</td>
    </tr>);
};

const Filas = (props) => {
    return(props.datosPacientesLlamados.map((paciente, pos) => {
        return(<Fila key={pos} iden={paciente.ticketID} consulta={paciente.id}/>);
    }));
}

export const ListaSalaDeEspera = (props) => {
    return(
        <Container>
            <Table responsive>
                <thead>
                <tr>
                    <th>Identificador</th>
                    <th>Sala de espera</th>
                </tr>
                </thead>
                <tbody>
                <Filas datosPacientesLlamados={props.datosPacientesLlamados}/>
                </tbody>
            </Table>
        </Container>);
};