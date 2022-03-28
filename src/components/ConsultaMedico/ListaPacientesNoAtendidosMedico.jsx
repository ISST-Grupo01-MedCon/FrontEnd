import React from "react";
import {Col, Container, OverlayTrigger, Row, Table, Tooltip} from "react-bootstrap";
import {headerStyle, ladoIconosNormales, transparentButtonStyle} from "../../styles";
import {useNavigate} from "react-router-dom";

const Fila = (props) => {
    const navigate = useNavigate();
    return (<tr>
        <td>{props.nombre}</td>
        <td>
            <button style={transparentButtonStyle} onClick={() => navigate("/medico/nueva_consulta_paciente/"+props.idPaciente+"?frompd=y")}><OverlayTrigger placement="top" overlay={<Tooltip>Citar</Tooltip>}><img width={ladoIconosNormales} height={ladoIconosNormales} alt={"Citar"} src="/add.svg"/></OverlayTrigger></button>
            <button style={transparentButtonStyle} onClick={() => {props.cambiarModoPaciente("registrado", props.idPaciente, "pd")}}><OverlayTrigger placement="top" overlay={<Tooltip>Registrar asistencia</Tooltip>}><img width={ladoIconosNormales} height={ladoIconosNormales} alt={"Asistencia"} src="/asistencia.svg"/></OverlayTrigger></button>
            <button style={transparentButtonStyle} onClick={() => navigate("/medico/detalles_paciente/"+props.idPaciente+"?from=pd")}><OverlayTrigger placement="top" overlay={<Tooltip>Más opciones</Tooltip>}><img width={ladoIconosNormales} height={ladoIconosNormales} alt={"Ajustes"} src="/options.svg"/></OverlayTrigger></button>
        </td>
    </tr>);
};

const Filas = (props) => {
    return(
        props.datosPacientesNoAtendidos.map((idPaciente, pos) => {
            return(<Fila key={pos} idPaciente={idPaciente} nombre={props.datosTodosLosPacientes[idPaciente]}  cambiarModoPaciente={props.cambiarModoPaciente}/>);
        })
    );
}

export const ListaPacientesNoAtendidosMedico = (props) => {
    let listaOrdenadaAlfabeticamente = props.ordenarAlfabeticamente(JSON.parse(JSON.stringify(props.datosPacientesNoAtendidos)), "ids");
    return(
        <Container>
            <Row>
                <Col style={headerStyle}><h1>Pacientes no atendidos</h1></Col>
            </Row>
            <Table responsive>
                <thead>
                <tr>
                    <th>Nombre completo</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                    <Filas datosPacientesNoAtendidos={listaOrdenadaAlfabeticamente} datosTodosLosPacientes={props.datosTodosLosPacientes} cambiarModoPaciente={props.cambiarModoPaciente}/>
                </tbody>
            </Table>
        </Container>);
};