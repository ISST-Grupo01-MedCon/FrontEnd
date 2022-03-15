import {data} from '../../data/pacientesPresentesConsultaMedico';
import React from "react";
import {Button, Col, Container, Row, Table} from "react-bootstrap";

let datos = JSON.parse(JSON.stringify(data));

const Fila = (props) => {
    return (<tr>
        <td><img width={50} height={50} alt={"Drag"} src="/drag.png"/></td><td>{props.iden}</td><td>{props.nombre}</td><td><img width={50} height={50} alt={"Tick"} src="/tick.png"/><img width={50} height={50} alt={"Cruz"} src="/cruz.png"/><img width={50} height={50} alt={"Ajustes"} src="/ajustes.png"/></td>
    </tr>);
};

const Filas = () => {
    return(
        datos.map((arrPersona, idx) => {
            return(<Fila key={idx} iden={arrPersona[0]} nombre={arrPersona[1]}/>);
        })
    );
}

export const ListaSiguientesPacientesMedico = (props) => {
    return(
    <Container>
        <Row>
            <Col style={{textAlign: "center", fontWeight: "bold"}}><h1>Siguientes pacientes</h1></Col>
        </Row>
        <Row>
            <Col xs={{ order: 'last' }}><a style={{color: "#23216e", textDecoration: "none", fontWeight: "bold"}} href={"/medico/lista_completa_pacientes"}>Lista completa pacientes</a></Col>
            <Col xs><Button variant={"light"}  size="lg" style={{backgroundColor: "#23216e", color: "#FFFFFF"}}>Llamar siguiente paciente</Button></Col>
            <Col xs={{ order: 'first' }}><a style={{color: "#23216e", textDecoration: "none", fontWeight: "bold"}} href={"/medico/lista_pacientes_descartados"}>Pacientes descartados</a></Col>
        </Row>
        <Table responsive>
            <thead>
            <tr>
                <th>Mover</th>
                <th>Identificador</th>
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