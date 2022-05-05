import {Alert, Button, Col, Container, Form, Image, Row} from "react-bootstrap";
import React, {useState} from "react";
import {greenButtonStyle} from "../../styles";
import { useNavigate } from "react-router-dom";

export const LoginKioskocipa = (props) => {
    const navigate = useNavigate();
    const [CIPA, setCIPA] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);

    const onChangeCIPA = (event) =>{
        setCIPA(event.target.value);
    }
    const submitCIPA = async (event) => {
        event.preventDefault();
        // Activamos el spinner de carga
        setLoading(true);
        // Registramos el paciente
        props.cambiarModoPaciente("registrado", CIPA, "kiosko");
        try {
            // Buscamos el ID del paciente (de su consulta)
            let idPaciente;
            let consultas = await (await fetch("/consultas")).json();
            let pacientes = await (await  fetch("/paciente")).json();
            // Buscamos el nombre del paciente por su CIPA, y con su nombre buscamos su consulta para obtener el ID
            for (let paciente of pacientes) {
                if (parseInt(paciente.cipa) === parseInt(CIPA)) {
                    for (let consulta of consultas) {
                        if (consulta.paciente === paciente.nombre) {
                            idPaciente = consulta.id;
                            break;
                        }
                    }
                    break;
                }
            }
            // Como todavía no tenemos su ticketID, ponemos uno que nos permita distinguir si ya tenemos el ticketID correcto
            let ticketID = "ZZZ";
            while (ticketID === "ZZZ") {
                // Repetimos la petición hasta que el ticketID esté guardado
                let consulta = await (await fetch("/consultas/"+idPaciente)).json();
                if ((consulta.ticketId !== null) || (consulta.ticketId !== undefined) || (consulta.ticketId !== "")) {
                    ticketID = consulta.ticketId;
                    break;
                }
            }
            // Finalmente cargamos la página del ticket
            navigate("/paciente/ticket?ticketID="+ticketID);
        } catch (e) {
            // Si ha dado error alguno de los fetch, es porque el CIPA no se encuentra en la base de datos de pacientes con cita
            setShowAlert(true);
        }
        // Se desactiva el spinner de carga
        setLoading(false);
    }
    return(
        <Container style={{paddingTop: 40}}>
            <Row>
                <Col style={{textAlign: "center", fontWeight: "bold"}}><h1>Identificación CIPA</h1></Col>
            </Row>
            <Row>
                <Form onSubmit={(event) => {submitCIPA(event)}}>
                    <Row style={{paddingTop: 10}} className="justify-content-md-center">
                        <Col xs={4}>
                            <img alt="Logo MedCon" src="/logo.png"/>
                            <Form.Group style={{paddingTop: 20}} className="mb-3" controlId="formBasicID">
                                <Form.Control type="plainText" placeholder="ID tarjeta" onChange={onChangeCIPA} value={CIPA}/>
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
                                        El CIPA introducido no es correcto o no se encuentra entre los pacientes citados.<br/><br/>
                                        Por favor, compruebe que está bien escrito e inténtelo de nuevo.<br/><br/>
                                        Si el error persiste, pregunte en el mostrador principal.
                                    </p>
                                </Alert>
                            </Col>
                        </Row> : <></>}
                </Form>
            </Row>
        </Container>
    );
};