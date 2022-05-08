import '../App.css';
import React, {useEffect, useState} from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Navbar} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {greenButtonStyle, whiteNoBorderButton} from "../styles";
import {useCookies} from "react-cookie";

function Header(props) {
    const navigate = useNavigate();
    const [, , removeCookie] = useCookies(['medico']);
    const [cerrarSesion, setCerrarSesion] = useState(false);

    const login_logout_action = async () => {
        if (props.loggedIn) {
            // Eliminamos la cookie del doctor
            removeCookie('usuarioMedico');
            // Esperamos a que la cookie se haya borrado del todo antes de irnos a la página de login
            setCerrarSesion(true);
            await setTimeout(async () => {
                await logout();
                navigate("/medico/login");
            }, 1000);
        } else {
            navigate("/medico/login");
        }
    };

    const logout = async () => {
        try {
            await fetch("/medico/logout");
        } catch(e) {}
        props.setLoggedIn(false);
    };

    useEffect(() => {
        if (cerrarSesion) {
            // Eliminamos la cookie del doctor
            removeCookie('usuarioMedico');
            fetch("/medico/logout")
                .then(() => {
                    navigate("/medico/login");
                    props.setLoggedIn(false);
                });
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cerrarSesion]);

    return (
        <Navbar>
            <Container>
                <Navbar.Brand href="/"><img src="/logo.png" alt="Logo de MedCon"/></Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        <Container fluid>
                            <Row>
                                {props.mostrarHomeyCola? <Col md="auto"><Button onClick={() => navigate("/")} variant="light" size="lg" style={whiteNoBorderButton}>Home</Button></Col> : <></>}
                                {props.mostrarHomeyCola? <Col md="auto"><Button onClick={() => navigate("/medico/lista_siguientes_pacientes")} variant="light" size="lg" style={whiteNoBorderButton}>Gestión de la cola</Button></Col> : <></>}
                                <Col md="auto"><Button onClick={() => navigate("/contacto")} variant="light" size="lg" style={whiteNoBorderButton}>Contacto</Button></Col>
                                <Col md="auto"><Button onClick={login_logout_action} variant="light" size="lg" style={greenButtonStyle}>{props.loggedIn? "Logout" : "Login"}</Button></Col>
                            </Row>
                        </Container>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
