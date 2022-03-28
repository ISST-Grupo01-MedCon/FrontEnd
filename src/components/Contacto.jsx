import {Col, Row, Container, Form, Button, Image} from "react-bootstrap";
import {greenButtonStyle} from "../styles";

export const Contacto = (props) => {
  return(
      <Container>
          <Row>
            <Col>
                <Form>
                    <Form.Group as={Row} className="mb-3" id="inlineFormInputName">
                        <Form.Label column sm="2">
                            Nombre*:
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control type="text" />
                        </Col>
                    </Form.Group>


                    <Form.Group as={Row} className="mb-3" id="inlineFormInputSurname">
                        <Form.Label column sm="2">
                            Apellidos*:
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control type="text" />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                        <Form.Label column sm="2">
                            Email:
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control type="text" />
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Mensaje*:</Form.Label>
                        <Form.Control as="textarea" rows={10} />
                    </Form.Group>

                    <Button variant="light" size="lg" style={greenButtonStyle} type="submit">
                        Enviar
                    </Button>
                </Form>
            </Col>
            <Col>
                <Image fluid width={1000} height={1000} src="/imagenSecundaria.svg" />
            </Col>
          </Row>
      </Container>
  );
};