import {Container, Col, Row} from "react-bootstrap";

export const Footer = (props) => {
    return(
    <Container fluid>
        <Row>
            <Col className={"color-primario"} style={{textAlign: "center"}}><br/>Copyright {(new Date()).getFullYear()}. All Rights Reserved<br/><br/></Col>
        </Row>
    </Container>
    );
}