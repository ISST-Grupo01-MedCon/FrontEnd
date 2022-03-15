import {data} from '../../data/pacientesNoAtendidosMedico';
import React from "react";
import {Col, Container, Row, Table} from "react-bootstrap";

let datos = JSON.parse(JSON.stringify(data));

const Fila = (props) => {
    return (<tr>
        <td><img width={50} height={50} alt={"Drag"} src="/drag.png"/></td><td>{props.nombre}</td><td><img width={50} height={50} alt={"Tick"} src="/tick.png"/><img width={50} height={50} alt={"Cruz"} src="/cruz.png"/><img width={50} height={50} alt={"Ajustes"} src="/ajustes.png"/></td>
    </tr>);
};

const Filas = () => {
    return(
        datos.map((nombrePersona, idx) => {
            return(<Fila key={idx} nombre={nombrePersona}/>);
        })
    );
}

export const ListaPacientesNoAtendidosMedico = (props) => {
    return(
        <Container>
            <Row>
                <Col style={{textAlign: "center", fontWeight: "bold"}}><h1>Pacientes no atendidos</h1></Col>
            </Row>
            <Table responsive>
                <thead>
                <tr>
                    <th>Mover</th>
                    <th>Nombre completo</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                    <Filas/>
                </tbody>
            </Table>
        </Container>);
};