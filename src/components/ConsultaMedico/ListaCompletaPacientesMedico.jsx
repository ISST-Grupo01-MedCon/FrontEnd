import React from "react";
import {Col, Container, OverlayTrigger, Row, Table, Tooltip, Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {headerStyle, ladoIconosNormales, transparentButtonStyle, linkButtonStyle} from "../../styles";


const Fila = (props) => {
    const navigate = useNavigate();
    return (<tr>
        <td>{props.nombre}</td>
        <td>
            <button style={transparentButtonStyle} onClick={() => props.cambiarModoConsultaPaciente("registrado", props.consulta, "consulta")}><OverlayTrigger placement="top" overlay={<Tooltip>Registrar asistencia</Tooltip>}><img width={ladoIconosNormales} height={ladoIconosNormales} alt={"Asistencia"} src="/asistencia.svg"/></OverlayTrigger></button>
            <button style={transparentButtonStyle} onClick={() => navigate(`/medico/detalles_paciente/${props.consulta.id}?from=tp`)}><OverlayTrigger placement="top" overlay={<Tooltip>Más opciones</Tooltip>}><img width={ladoIconosNormales} height={ladoIconosNormales} alt={"Ajustes"} src="/options.svg"/></OverlayTrigger></button>
        </td>
    </tr>);
};

const Filas = (props) => {
    return(
        props.datosTodosLosPacientes.map((paciente, pos) => {
            return(<Fila key={pos} consulta={props.getConsultaFromNombrePaciente(paciente.nombre)} nombre={paciente.nombre} cambiarModoConsultaPaciente={props.cambiarModoConsultaPaciente}/>
            );
        })
    );
}

export const ListaCompletaPacientesMedico = (props) => {
    const navigate = useNavigate();
    let listaOrdenadaAlfabeticamente = props.ordenarAlfabeticamente(JSON.parse(JSON.stringify(props.datosTodosLosPacientes)));
    return(
        <Container>
            <Row>
            <Col ><Button style={linkButtonStyle} onClick={() => navigate("/medico/lista_pacientes_descartados")}>Pacientes descartados</Button></Col>
                <Col style={headerStyle}><h1>Lista completa de pacientes</h1></Col>
                <Col><Button style={linkButtonStyle} onClick={() => navigate("/medico/lista_siguientes_pacientes")}>Siguientes pacientes</Button></Col>
            </Row>
            <Table responsive>
                <thead>
                <tr>
                    <th>Nombre completo</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                    <Filas datosTodosLosPacientes={listaOrdenadaAlfabeticamente} getConsultaFromNombrePaciente={props.getConsultaFromNombrePaciente} datosTodosLosPacientesSinOrdenar={props.datosTodosLosPacientes} cambiarModoConsultaPaciente={props.cambiarModoConsultaPaciente}/>
                </tbody>
            </Table>
        </Container>);
};