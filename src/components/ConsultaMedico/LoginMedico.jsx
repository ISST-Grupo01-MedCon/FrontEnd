import {Alert, Button, Col, Container, Form, Row} from "react-bootstrap";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {greenButtonStyle, headerStyle, whiteButtonStyle} from "../../styles";
import {useCookies} from "react-cookie";

export const LoginMedico = (props) => {
    const [IDMedico, setIDMedico] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [, setCookie, ] = useCookies(['medico']);

    const navigate = useNavigate();

    const submitLogin = async (event) => {
        event.preventDefault();
        let respuesta = await fetch("/medico/autenticar", {
            "headers": {
                "content-type": "application/x-www-form-urlencoded"
            },
            "method": "POST",
            "body": "username="+IDMedico+"&password="+password
        })
        if (parseInt(respuesta.status) === 401)
            setShow(true);
        else {
            let doctores = await props.peticionHTML('/medicos');
            for (let doctor of doctores) {
                if (doctor.usuario === IDMedico) {
                    // Guardamos el nombre del doctor en una cookie
                    setCookie('usuarioMedico', doctor.usuario, { path: '/' });
                    props.setDoc(doctor);
                    props.setLoggedIn(true);
                    navigate("/");
                    break;
                }
            }
        }
    }

    return(
        <Container>
            <Row>
                <Col style={headerStyle}><h1>Identificación</h1></Col>
            </Row>
            <Row>
                <Form onSubmit={(event) => {submitLogin(event)}}>
                    <Row className="justify-content-md-center">
                        <Col xs={4}>
                            <Form.Group className="mb-3" controlId="formBasicID">
                                <Form.Control type="plainText" placeholder="ID médico" onChange={(event) => setIDMedico(event.target.value)} value={IDMedico}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control type="password" placeholder="Contraseña" onChange={(event) => setPassword(event.target.value)} value={password}/>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row xs={4} className="justify-content-md-center">
                        <Col>
                            <Button onClick={() => navigate("/contacto")} variant="light" size="lg" style={whiteButtonStyle}>Incidencia</Button>
                        </Col>
                        <Col>
                            <Button variant="light" size="lg" style={greenButtonStyle} type="submit">
                                Login
                            </Button>
                        </Col>
                    </Row>
                    {show?
                        <Row className="justify-content-md-center" style={{paddingTop: "40px"}}>
                            <Col xs={4}>
                                <Alert variant="light" onClose={() => setShow(false)} dismissible>
                                    <Alert.Heading>¡Error!</Alert.Heading>
                                    <p>
                                        La combinación de ID y contraseña introducida no es válida.
                                        Por favor, compruebe los datos e inténtelo de nuevo.
                                    </p>
                                </Alert>
                            </Col>
                        </Row> : <></>}
                </Form>
            </Row>
        </Container>
    );
};