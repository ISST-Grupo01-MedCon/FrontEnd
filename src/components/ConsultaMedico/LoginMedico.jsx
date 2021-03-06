import {Alert, Button, Col, Container, Form, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {greenButtonStyle, headerStyle, whiteButtonStyle} from "../../styles";
import {useCookies} from "react-cookie";

export const LoginMedico = (props) => {
    const [IDMedico, setIDMedico] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [, setCookie, ] = useCookies(['medico']);
    const [useEffectListo, setUseEffectListo] = useState(false);
    const [autenticarMedico, setAutenticarMedico] = useState(false);

    const navigate = useNavigate();

    const submitLogin = async (event) => {
        event.preventDefault();
        setAutenticarMedico(true);
    }

    useEffect(() => {
        if (useEffectListo) {
            fetch("/medico/autenticar", {
                "headers": {
                    "content-type": "application/x-www-form-urlencoded"
                },
                "method": "POST",
                "body": "username="+IDMedico+"&password="+password
            }).then(respuesta => {
                if (parseInt(respuesta.status) === 401)
                    setShow(true);
                else {
                    fetch('/medicos')
                        .then(respuesta => respuesta.json())
                        .then(medicos => {
                            for (let medico of medicos) {
                                if (medico.usuario === IDMedico) {
                                    // Guardamos el nombre del doctor en una cookie
                                    setCookie('usuarioMedico', IDMedico, { path: '/' });
                                    props.setDoc(medico);
                                    props.setLoggedIn(true);
                                    navigate("/");
                                    break;
                                }
                            }
                        })
                        .catch(() => setShow(true))
                }
            }).catch(() => setShow(true))
            setAutenticarMedico(false);
        } else {
            setUseEffectListo(true);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autenticarMedico]);

    return(
        <Container>
            <Row>
                <Col style={headerStyle}><h1>Identificaci??n</h1></Col>
            </Row>
            <Row>
                <Form onSubmit={(event) => {submitLogin(event)}}>
                    <Row className="justify-content-md-center">
                        <Col xs={4}>
                            <Form.Group className="mb-3" controlId="formBasicID">
                                <Form.Control type="plainText" placeholder="ID m??dico" onChange={(event) => setIDMedico(event.target.value)} value={IDMedico}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control type="password" placeholder="Contrase??a" onChange={(event) => setPassword(event.target.value)} value={password}/>
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
                                    <Alert.Heading>??Error!</Alert.Heading>
                                    <p>
                                        La combinaci??n de ID y contrase??a introducida no es v??lida.
                                        Por favor, compruebe los datos e int??ntelo de nuevo.
                                    </p>
                                </Alert>
                            </Col>
                        </Row> : <></>}
                </Form>
            </Row>
        </Container>
    );
};