import React from "react";
import {Col, Container, OverlayTrigger, Row, Table, Tooltip, Button} from "react-bootstrap";
import {headerStyle, ladoIconosNormales, transparentButtonStyle} from "../../styles";
import {useNavigate} from "react-router-dom";
import {linkButtonStyle} from "../../styles";

const Fila = (props) => {
    const navigate = useNavigate();
    return (  
    <tr>
        <td>{props.nombre}</td>
        <td>
            <button style={transparentButtonStyle} onClick={() => navigate("/medico/nueva_consulta_paciente/"+props.idPaciente+"?frompd=y")}><OverlayTrigger placement="top" overlay={<Tooltip>Citar</Tooltip>}><img width={ladoIconosNormales} height={ladoIconosNormales} alt={"Citar"} src="/add.svg"/></OverlayTrigger></button>
            <button style={transparentButtonStyle} onClick={() => {props.cambiarModoPaciente("registrado", props.idPaciente, "pd")}}><OverlayTrigger placement="top" overlay={<Tooltip>Registrar asistencia</Tooltip>}><img width={ladoIconosNormales} height={ladoIconosNormales} alt={"Asistencia"} src="/asistencia.svg"/></OverlayTrigger></button>
            <button style={transparentButtonStyle} onClick={() => navigate("/medico/detalles_paciente/"+props.idPaciente+"?from=pd")}><OverlayTrigger placement="top" overlay={<Tooltip>Más opciones</Tooltip>}><img width={ladoIconosNormales} height={ladoIconosNormales} alt={"Ajustes"} src="/options.svg"/></OverlayTrigger></button>
        </td>
    </tr>
);
};

const Filas = (props) => {
    return(
        props.datosPacientesNoAtendidos ? props.datosPacientesNoAtendidos.map((paciente, pos) => {
            return(<Fila key={pos} idPaciente={paciente.id} nombre={props.datosTodosLosPacientes[paciente.id].nombre} cambiarModoPaciente={props.cambiarModoPaciente}/>);
        }) : <></>
    );
}

export const ListaPacientesNoAtendidosMedico = (props) => {
    const navigate = useNavigate();
    let listaOrdenadaAlfabeticamente = props.ordenarAlfabeticamente(JSON.parse(JSON.stringify(props.datosPacientesNoAtendidos)), "ticketIDs");
    return(
        <Container>
            <Row>
            <Col><Button style={linkButtonStyle} onClick={() => navigate("/medico/lista_completa_pacientes")}>Lista completa pacientes</Button></Col>
                <Col style={headerStyle}><h1>Pacientes no atendidos</h1></Col>
                <Col><Button style={linkButtonStyle} onClick={() => navigate("/medico/lista_siguientes_pacientes")}>Siguientes pacientes</Button>
                </Col>
            </Row>
            <Row>

                
                        
            </Row>
    
            <Table responsive>
                <thead>
                <tr>
                    <th>Nombre completo</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                    <Filas datosPacientesNoAtendidos={listaOrdenadaAlfabeticamente} datosTodosLosPacientes={props.datosTodosLosPacientes} cambiarModoPaciente={props.cambiarModoPaciente}
                           getIDPacienteFromTicketID={props.getIDPacienteFromTicketID}/>
                </tbody>
            </Table>
        </Container>);
};