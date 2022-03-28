import React from "react";
import {Col, Container, OverlayTrigger, Row, Table, Tooltip} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {headerStyle, ladoIconosNormales, transparentButtonStyle} from "../../styles";

const Fila = (props) => {
    const navigate = useNavigate();
    return (<tr>
        <td>{props.nombre}</td>
        <td>
            <button style={transparentButtonStyle} onClick={() => props.cambiarModoPaciente("registrado", props.idPaciente, "tp")}><OverlayTrigger placement="top" overlay={<Tooltip>Registrar asistencia</Tooltip>}><img width={ladoIconosNormales} height={ladoIconosNormales} alt={"Asistencia"} src="/asistencia.svg"/></OverlayTrigger></button>
            <button style={transparentButtonStyle} onClick={() => navigate(`/medico/detalles_paciente/${props.idPaciente}?from=tp`)}><OverlayTrigger placement="top" overlay={<Tooltip>Más opciones</Tooltip>}><img width={ladoIconosNormales} height={ladoIconosNormales} alt={"Ajustes"} src="/options.svg"/></OverlayTrigger></button>
        </td>
    </tr>);
};

const Filas = (props) => {
    const getIDPaciente = (nombrePaciente) => {
        for (let id in props.datosTodosLosPacientesSinOrdenar) {
            if (nombrePaciente === props.datosTodosLosPacientesSinOrdenar[id])
                return id;
        }
        return -1;
    };

    return(
        props.datosTodosLosPacientes.map((nombrePaciente, pos) => {
            return(<Fila key={pos} idPaciente={getIDPaciente(nombrePaciente)} nombre={nombrePaciente} cambiarModoPaciente={props.cambiarModoPaciente}/>
            );
        })
    );
}

export const ListaCompletaPacientesMedico = (props) => {
    let listaOrdenadaAlfabeticamente = props.ordenarAlfabeticamente(JSON.parse(JSON.stringify(props.datosTodosLosPacientes)));
    return(
        <Container>
            <Row>
                <Col style={headerStyle}><h1>Lista completa de pacientes</h1></Col>
            </Row>
            <Table responsive>
                <thead>
                <tr>
                    <th>Nombre completo</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                    <Filas datosTodosLosPacientes={listaOrdenadaAlfabeticamente} datosTodosLosPacientesSinOrdenar={props.datosTodosLosPacientes} cambiarModoPaciente={props.cambiarModoPaciente}/>
                </tbody>
            </Table>
        </Container>);
};