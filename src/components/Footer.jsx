import { Container, Col, Row, Image } from "react-bootstrap";
import { footerStyle } from "../styles";

export const Footer = (props) => {
    return (
        <Container fluid style={{paddingTop: 20}}>
            <Row>
                <Col style={footerStyle}><br />
                    <Image style={{paddingRight: 40}} fluid width={110} height={110} src="/SaludMadrid.svg.png" /> Copyright {(new Date()).getFullYear()}. All Rights Reserved<br /><br />
                </Col>
            </Row>
        </Container>
    );
}