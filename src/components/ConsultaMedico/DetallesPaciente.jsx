import React from "react";
import {useParams, useNavigate} from "react-router-dom";
import {Col, Container, OverlayTrigger, Row, Table, Tooltip} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {CabeceraPaciente} from "./CabeceraPaciente";
import {greenButtonStyle, ladoCruzPequena, ladoLapizPequeno,blueButton, transparentButtonStyle} from "../../styles";

const Fila = (props) => {
    return (<tr>
        <td>{props.comentario}</td><td>{props.fecha}</td>
        <td>
            <OverlayTrigger placement="top" overlay={<Tooltip>Eliminar</Tooltip>}><button style={transparentButtonStyle}><img width={ladoCruzPequena} height={ladoCruzPequena} alt={"Cruz"} src="/cruz.png"/></button></OverlayTrigger>
            <OverlayTrigger placement="top" overlay={<Tooltip>Editar</Tooltip>}><button style={transparentButtonStyle}><img width={ladoLapizPequeno} height={ladoLapizPequeno} alt={"Editar"} src="/pencil.svg"/></button></OverlayTrigger>
        </td>
    </tr>);
};

const Filas = (props) => {
    return(props.datos.map((arrDatos, idx) => {
            return(<Fila key={idx} idx={idx} comentario={arrDatos[0]} fecha={arrDatos[1]}/>);
        })
    );
}

export const DetallesPaciente = (props) => {
    const {id} = useParams();
    const navigate = useNavigate();
    const query = props.useQuery();
    const from = query.get("from");
    const idSiguientePaciente = props.getIDSiguientePaciente(parseInt(id));
    const volver = () => {
        if (from === "pd")
            navigate("/medico/lista_pacientes_descartados");
        else if (from === "tp")
            navigate("/medico/lista_completa_pacientes");
        else
            navigate("/medico/lista_siguientes_pacientes");
    };
    const irANuevaConsultaPaciente = () => {
        if ((from === "tp") || (from === "pd"))
            navigate("/medico/nueva_consulta_paciente/"+id+"?from="+from);
        else
            navigate("/medico/nueva_consulta_paciente/"+id);
    };
    const irARecetasPaciente = () => {
        if ((from === "tp") || (from === "pd"))
            navigate("/medico/recetas_paciente/"+id+"?from="+from);
        else
            navigate("/medico/recetas_paciente/"+id);
    };
    const irAPruebasPaciente = () => {
        if ((from === "tp") || (from === "pd"))
            navigate("/medico/pruebas_paciente/"+id+"?from="+from);
        else
            navigate("/medico/pruebas_paciente/"+id);
    };
    return(
        <Container fluid="true">
            <Row>
            <CabeceraPaciente volver={volver} id={id} datosTodosLosPacientes={props.datosTodosLosPacientes}/>
            </Row>
            <Row>
                <Col md={{offset: 1, span: 5}}>
                    <h3>Historia clínica</h3>
                    <Table responsive>
                        <thead>
                        <tr>
                            <th>Motivo consulta</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            <Filas datos={props.datosHistoriaClinica}/>
                        </tbody>
                    </Table>
                </Col>
                <Col md={{offset: 2, span: 3}}>
                    <br/>
                    <br/>
                    <br/>
                    <Row><Button variant="light" size="lg" style={greenButtonStyle} onClick={irANuevaConsultaPaciente}>Nueva consulta</Button></Row>
                    <Row><Button variant="light" size="lg" style={greenButtonStyle} onClick={irARecetasPaciente}>Ver recetas</Button></Row>
                    <Row><Button variant="light" size="lg" style={greenButtonStyle} onClick={irAPruebasPaciente}>Pruebas médicas</Button></Row>
                    {((from !== "tp") && (from !== "pd")) ? <Row>{(idSiguientePaciente === -1) ? <Button variant="light" size="lg" style={greenButtonStyle} disabled>Siguiente paciente</Button> : <Button variant="light" size="lg" style={greenButtonStyle} onClick={() => {props.cambiarModoPaciente("atendido", id); navigate("/medico/detalles_paciente/"+idSiguientePaciente);}}>Siguiente paciente</Button>}</Row> : <></>}
                </Col>
            </Row>
        </Container>
    )
}