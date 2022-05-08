import {Col, Row, Container, Image} from "react-bootstrap";
import {headerStyle} from "../styles";
import React from "react";
import {Footer} from "./Footer";

export const PaginaDeCarga = (props) => {
    return(
        <Container>
            <Row>
                <Col style={{paddingTop: "20px"}}>
                    <Row style={headerStyle}><h1>Cargando MedCon. Espere por favor...</h1></Row>
                    <div style={{paddingTop: "20px", textAlign: "center"}}><Image src={'/spinner.gif'} style={{width: "100px", height: "100px"}}/></div>
                    <Image fluid width={1000} height={1000} src="/imagenSecundaria.svg" />
                </Col>
            </Row>
        </Container>
    );
};