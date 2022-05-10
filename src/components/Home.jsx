
import {Button, Col, Container, Image, Row, Stack} from "react-bootstrap";
import {blueButton} from "../styles";
import {useNavigate} from "react-router-dom";

export const Home = (props) => {
    const siguienteConsulta = props.getSiguienteConsulta(parseInt(-1));
    const navigate = useNavigate();
    return(
        <Container fluid>
            <Col>
                <Row>
                <p style = {{fontSize: 40, fontWeight: "bold"}}>Bienvenido de nuevo: Dr. {props.doc}</p>
                    <Col>
                        <Image fluid width={1000} height={1000} src="/imagenPrincipal.svg" />
                    </Col>
                    <Col>
                        <Stack style={{border: "none"}} gap={5}>
                            <Row style={{justifyContent: "center", paddingTop: 150}}><Button style={{...blueButton, height: 150, width: 400, fontSize: 30}} onClick={() => navigate("/medico/lista_siguientes_pacientes")}  size="lg">Lista de pacientes</Button></Row>
                            <Row style={{justifyContent: "center"}}><Button style={{...blueButton, height: 150, width: 400, fontSize: 30}} onClick={() =>  {props.cambiarModoConsultaPaciente("llamado", siguienteConsulta, "idConsulta"); navigate("/medico/detalles_paciente/"+siguienteConsulta.id);}} size="lg">Llamar al siguiente paciente</Button></Row>
                        </Stack>
                    </Col>
                </Row>
            </Col>
        </Container>
    );
}