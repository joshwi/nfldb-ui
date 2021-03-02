import React from "react"
import { Container, Row, Col } from "reactstrap";

function NotFound() {
    return (
        <Container style={{  paddingLeft: "150px", textAlign: "center", color: "white", marginTop: "45vh" }}>
            <Row style={{ marginTop: "50px", }}>
                <Col><h5>404 Not Found</h5></Col>
            </Row>
        </Container>
    )
}

export default NotFound