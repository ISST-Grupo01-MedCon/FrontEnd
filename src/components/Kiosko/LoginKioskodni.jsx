import {Alert, Button, Col, Container, Form, Image, ListGroup, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {greenButtonStyle} from "../../styles";
import { useNavigate } from "react-router-dom";


export const LoginKioskodni = (props) => {
    const navigate = useNavigate();
    const [dni, setDni] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [listaConsultas, setListaConsultas] = useState(false);
    const [consultaElegida, setConsultaElegida] = useState();
    const [loading, setLoading] = useState(false);
    const [useEffectListo, setUseEffectListo] = useState(false);
    const [registroPaciente, setRegistroPaciente] = useState(false);
    
    const onChangeDni = (event) =>{
        setDni(event.target.value);
    }
    const submitdni = async (event) => {
        event.preventDefault();
        setRegistroPaciente(true);
    }

    useEffect(() => {
        const registrarConsultaEnBackEnd = async (idConsulta) => {
            await fetch("/paciente/registroKiosko/"+idConsulta, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        };

        const cargarTicketID = (ticketID) => {
            // Se desactiva el spinner de carga
            setLoading(false);
            // Finalmente cargamos la página del ticket
            navigate("/paciente/ticket?ticketID="+ticketID);
        };

        if (useEffectListo) {
            if (consultaElegida !== undefined) {
                setLoading(true);
                let consulta = listaConsultas[consultaElegida];
                // Registramos el paciente en el BackEnd:
                registrarConsultaEnBackEnd(consulta.id).catch(() => {
                    console.log("Hubo un error al registrar la consulta con id "+consulta.id+" del paciente "+consulta.paciente+" desde el kiosko");
                });
                cargarTicketID(consulta.ticketId);
                setListaConsultas(undefined);
                setConsultaElegida(undefined);
                return;
            }
            setRegistroPaciente(false);
            // Activamos el spinner de carga
            setLoading(true);
            // Buscamos las consultas del paciente
            fetch("/paciente")
                .then(respuesta => respuesta.json())
                .then(pacientes => {
                    // Buscamos el nombre del paciente
                    let nombrePaciente;
                    for (let paciente of pacientes) {
                        if (paciente.dni === dni) {
                            nombrePaciente = paciente.nombre;
                            break;
                        }
                    }
                    // Con el nombre del paciente buscamos sus consultas:
                    fetch("/consultas")
                        .then(respuesta => respuesta.json())
                        .then(consultas => {
                            let consultasPaciente = [];
                            for (let consulta of consultas) {
                                if (consulta.paciente === nombrePaciente) {
                                    consultasPaciente.push(consulta);
                                }
                            }
                            // Una vez que tenemos las consultas, comprobamos si hay una o si hay varias:
                            if (consultasPaciente.length === 1) {
                                // Si el paciente tiene una sola consulta, no se le pregunta nada más y se le muestra su ticketID
                                // Se desactiva el spinner de carga
                                setLoading(false);
                                // Finalmente cargamos la página del ticket
                                navigate("/paciente/ticket?ticketID="+consultasPaciente[0].ticketID);
                            } else if (consultasPaciente.length > 1) {
                                // Si el paciente tiene más de una cita, se le pregunta cuál desea registrar:
                                setListaConsultas(consultasPaciente);
                                // Se desactiva el spinner de carga
                                setLoading(false);
                            }
                        })
                })
                .catch(() => {
                    // Si ha dado error alguno de los fetch, es porque el CIPA no se encuentra en la base de datos de pacientes con cita
                    setShowAlert(true);
                });
        } else {
            setUseEffectListo(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[registroPaciente, consultaElegida]);

    return(
        <Container style={{paddingTop: 40}}>
            <Row>
                <Col style={{textAlign: "center", fontWeight: "bold"}}><h1>{listaConsultas? "Seleccione la consulta que desea atender:" : "Identificación DNI"}</h1></Col>
            </Row>
            <Row>
                {listaConsultas?
                    <Row style={{paddingTop: 10}} className="justify-content-md-center">
                        <Col xs={6}>
                            <ListGroup>
                                {listaConsultas.map((consulta, pos) => <ListGroup.Item key={pos} action onClick={() => setConsultaElegida(pos)}>{consulta.razonConsulta}</ListGroup.Item>)}
                            </ListGroup>
                        </Col>
                    </Row>
                    : <Form onSubmit={(event) => {submitdni(event)}}>
                    <Row style={{paddingTop: 10}} className="justify-content-md-center">
                        <Col xs={4}>
                            <img alt="Logo MedCon" src="/logo.png"/>
                            <Form.Group style={{paddingTop: 20}} className="mb-3" controlId="formBasicPassword" >
                                <Form.Control type="plainText" placeholder="NIF o NIE" onChange={onChangeDni} value={dni}/>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row xs={4} className="justify-content-md-center">
                        <Col>
                            <Button variant="light" size="lg" style={greenButtonStyle} type="submit">
                                Registrar asistencia
                            </Button>
                        </Col>
                    </Row>
                    {loading? <div style={{paddingTop: "20px"}}><Image src={'/spinner.gif'} style={{width: "40px", height: "40px"}}/></div> : <></>}
                    {showAlert?
                        <Row className="justify-content-md-center" style={{paddingTop: "40px"}}>
                            <Col xs={4}>
                                <Alert variant="light" onClose={() => setShowAlert(false)} dismissible>
                                    <Alert.Heading>¡Error!</Alert.Heading>
                                    <p>
                                        El DNI introducido no es correcto o no se encuentra entre los pacientes citados.<br/><br/>
                                        Por favor, compruebe que está bien escrito e inténtelo de nuevo.<br/><br/>
                                        Si el error persiste, pregunte en el mostrador principal.
                                    </p>
                                </Alert>
                            </Col>
                        </Row> : <></>}
                </Form>}
            </Row>
        </Container>
    );
};