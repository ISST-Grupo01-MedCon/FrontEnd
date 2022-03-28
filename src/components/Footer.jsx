import {Container, Col, Row} from "react-bootstrap";
import {footerStyle} from "../styles";

export const Footer = (props) => {
    return(
    <Container fluid>
        <Row>
            <Col style={footerStyle}><br/>Copyright {(new Date()).getFullYear()}. All Rights Reserved<br/><br/></Col>
        </Row>
    </Container>
    );
}