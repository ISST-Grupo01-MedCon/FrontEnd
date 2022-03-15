import {data} from '../../data/pacientesSalaDeEspera';
import React from "react";
import {Container, Table} from "react-bootstrap";

let datos = JSON.parse(JSON.stringify(data));

const Fila = (props) => {
    return (<tr>
        <td>{props.iden}</td><td>{props.consulta}</td>
    </tr>);
};

const Filas = () => {
    return(
        datos.map((arrPaciente, idx) => {
            return(<Fila key={idx} iden={arrPaciente[0]} consulta={arrPaciente[1]}/>);
        })
    );
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
                <Filas/>
                </tbody>
            </Table>
        </Container>);
};