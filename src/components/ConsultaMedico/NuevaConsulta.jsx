import React, {useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {Col, Container, Form, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from  "react-datepicker";
import es from 'date-fns/locale/es';
import {CabeceraPaciente} from "./CabeceraPaciente";
import {greenButtonStyle, whiteButtonStyle} from "../../styles";
registerLocale('es', es)

export const NuevaConsulta = (props) => {
    const [startDate, setStartDate] = useState(new Date());
    const {id} = useParams();
    const navigate = useNavigate();
    const query = props.useQuery();
    const from = query.get("from");
    const frompd = query.get("frompd");
    const volver = () => {
        if ((from === "tp") || (from === "pd"))
            navigate("/medico/detalles_paciente/"+id+"?from="+from);
        else if (frompd === 'y')
            navigate("/medico/lista_pacientes_descartados");
        else
            navigate("/medico/detalles_paciente/"+id);
    };
    return(
        <Container fluid="true">
            <CabeceraPaciente volver={volver} id={id} nombre={props.getConsultaFromId(id).paciente}/>
            <Row>
                <Col md={{offset: 1, span: 5}}>
                    <h3>Nueva consulta</h3>
                </Col>
            </Row>
            <Row>
                <Form>
                    <Row>
                        <Col md={{offset: 1, span: 5}}>
                                <Form.Group as={Row} className="mb-3" id="formPlaintextEmail">
                                    <Form.Label column sm="3">
                                        Motivo consulta:
                                    </Form.Label>
                                    <Col sm="9">
                                        <Form.Control type="text" />
                                    </Col>
                                </Form.Group>


                                <Form.Group as={Row} className="mb-3" id="inlineFormInputSurname">
                                    <Form.Label column sm="3">
                                        Fecha:
                                    </Form.Label>
                                    <Col sm="9">
                                        <DatePicker dateFormat="dd/MM/yyyy" locale="es" selected={startDate} onChange={(date) => setStartDate(date)} customInput={<Form.Control type="text" />} />
                                    </Col>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Descripción:</Form.Label>
                                    <Form.Control as="textarea" rows={10} />
                                </Form.Group>
                        </Col>
                        <Col md={{offset: 2, span: 3}}>
                            <br/>
                            <br/>
                            <br/>
                            <Row><Button variant="light" size="lg" style={whiteButtonStyle} onClick={volver}>Atrás</Button></Row>
                            <Row><Button variant="light" size="lg" style={greenButtonStyle} type="submit">Crear</Button></Row>
                        </Col>
                    </Row>
                </Form>
            </Row>
        </Container>
    )
}