import React from "react";
import {useParams, useNavigate} from "react-router-dom";
import {Col, Container, Form, OverlayTrigger, Row, Table, Tooltip} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {CabeceraPaciente} from "./CabeceraPaciente";
import {greenButtonStyle, ladoCruzPequena, ladoLapizPequeno, transparentButtonStyle} from "../../styles";

const Fila = (props) => {
    return (<tr>
        <td></td><td></td>
        <td>
            <OverlayTrigger placement="top" overlay={<Tooltip>Eliminar</Tooltip>}><button style={transparentButtonStyle}><img width={ladoCruzPequena} height={ladoCruzPequena} alt={"Cruz"} src="/cruz.png"/></button></OverlayTrigger>
            <OverlayTrigger placement="top" overlay={<Tooltip>Editar</Tooltip>}><button style={transparentButtonStyle}><img width={ladoLapizPequeno} height={ladoLapizPequeno} alt={"Editar"} src="/pencil.svg"/></button></OverlayTrigger>
        </td>
    </tr>);
};

const Filas = (props) => {
    return(Array.from({length:6},(v,k)=>k+1).map((arrDatos, idx) => {
            return(<Fila key={idx}/>);
        })
    );
}

export const PruebasMedicasPaciente = (props) => {
    const {id} = useParams();
    const navigate = useNavigate();
    const query = props.useQuery();
    const from = query.get("from");
    const volver = () => {
        if ((from === "tp") || (from === "pd"))
            navigate("/medico/detalles_paciente/"+id+"?from="+from);
        else
            navigate("/medico/detalles_paciente/"+id);
    };
    return(
      <Container fluid="true">
        <CabeceraPaciente volver={volver} id={id} nombre={props.getConsultaFromId(id).paciente}/>
        <Row>
            <Col md={{offset: 1, span: 5}}>
                <h3>Pruebas médicas</h3>
                <Table responsive>
                    <thead>
                    <tr>
                        <th>Pruebas médicas</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                        <Filas/>
                    </tbody>
                </Table>
            </Col>
            <Col md={{offset: 2, span: 3}}>
                <br/>
                <br/>
                <br/>
                <Row><h4>Nueva prueba médica:</h4></Row>
                <Row>
                    <Col>
                        <Form>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Control as="textarea" rows={10} />
                            </Form.Group>

                            <Button variant="light" size="lg" style={greenButtonStyle} type="submit">
                                Crear
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Col>
        </Row>
    </Container>
    )
}