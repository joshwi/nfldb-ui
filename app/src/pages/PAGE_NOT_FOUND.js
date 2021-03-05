import React from "react"
import { Container, Row, Col } from "reactstrap";

function NotFound() {
    return (
        <Container>
            <Row>
                <Col>
                    <div style={{ color: 'white', display: 'table', textAlign: "center", height: '800px', width: "100%" }}>
                        <div style={{ display: 'table-cell', verticalAlign: 'middle', whiteSpace: "nowrap" }}>
                            <h5>404 Not Found</h5>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default NotFound