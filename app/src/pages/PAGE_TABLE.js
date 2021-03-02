/*eslint-disable*/
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Label, InputGroup, InputGroupAddon, InputGroupText, Button, Dropdown, DropdownToggle, DropdownItem, DropdownMenu, Input } from "reactstrap"
import { useParams } from "react-router-dom";
import Table from "../components/TABLE"

import { get } from "../utility/REST";

function Component(props) {

    const { site, category, schema } = useParams()

    const [node, SetNode] = useState('')

    const [data, SetData] = useState([])

    const [keys, SetKeys] = useState({})

    const [query, SetQuery] = useState({})

    const [search, SetSearch] = useState(false)

    useEffect(() => {
        SetNode(`${site}_${category}_${schema}_games`)
    }, [site, category, schema])

    useEffect(() => {
        if (props.keys[node] !== undefined) {
            SetKeys(props.keys[node])
        }
    }, [props.keys, node])

    useEffect(() => {
        if (keys.primaryKeys !== undefined && keys.primaryKeys.length > 3 ) {
            let input = {}
            keys.primaryKeys.slice(0, 2).map((entry) => {
                if (query[entry] === undefined) {
                    input[entry] = ""
                }
                else {
                    input[entry] = query[entry]
                }
            })
            SetQuery(input)
            SetSearch(!search)
        }
    }, [keys])

    useEffect(() => {
        let url = new URL(window.location.origin + "/api/db/neo4j/query")
        let cypher = ``
        Object.keys(query).map((entry,index) => {
            if(index === 0){
                cypher += `n.${entry}=~\"(?i)${query[entry]}.*\"`
            }else{
                cypher += `AND n.${entry}=~\"(?i)${query[entry]}.*\"`
            }
        })
        let params = {source: node, query: cypher}
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        if (Object.keys(query).length > 0) {
            get(url).then(result => SetData(result))
        }
    }, [search])

    return (
        <Container fluid={true}>
            <Row style={{ margin: "25px", textAlign: "center", color: "white" }}>
                <Col><h3>NFLdb</h3></Col>
            </Row>
            <Row style={{ marginTop: "20px", height: "75px" }}>
                <Col sm={{ size: 1 }} />
                <Col sm={{ size: 8 }} />
                {/* <Col sm={{ size: 1 }} style={{ textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", height: "inherit" }}>
                    <Dropdown isOpen={openSource} toggle={() => SetOpenSource(!openSource)}>
                        <DropdownToggle caret>
                            Source
                        </DropdownToggle>
                        <DropdownMenu>
                            {Object.keys(nodes).map(entry => {
                                return <DropdownItem onClick={() => SetSource(entry)}>{entry}</DropdownItem>
                            })}
                        </DropdownMenu>
                    </Dropdown>
                </Col> */}
                {/* {
                    Object.keys(filters).filter(entry => filters[entry] === true).length === Object.keys(query).length && Object.keys(query).map((entry, index) => {
                        if (index < 3) {
                            return <Col style={{ textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", height: "inherit" }}>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>{entry}</InputGroupText>
                                    </InputGroupAddon>
                                    <Input placeholder={query[entry]} value={query[entry] !== undefined && query[entry] !== "all" ? query[entry] : null} onChange={(e) => SetQuery({ ...query, [entry]: e.target.value })} />
                                </InputGroup>
                            </Col>
                        }
                        else { return <></> }
                    })
                } */}
                {/* {Object.keys(filters).length > 0 && (
                    <Col sm={{ size: 1 }} style={{ textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", height: "inherit" }}>
                        <Dropdown isOpen={openFilters} toggle={() => SetOpenFilters(!openFilters)}>
                            <DropdownToggle caret>
                                Filters
                            </DropdownToggle>
                            <DropdownMenu>
                                {Object.keys(filters).sort().map((entry, index) => {
                                    return <DropdownItem>
                                        <Label style={{ marginLeft: "5px" }} onClick={() => SetFilters({ ...filters, [entry]: !filters[entry] })} check>
                                            <Input type="checkbox" defaultChecked={filters[entry]} />{' '}
                                            {entry}
                                        </Label>
                                    </DropdownItem>
                                })}
                            </DropdownMenu>
                        </Dropdown>
                    </Col>
                )} */}
                {/* {Object.keys(headers).length > 0 && (
                    <Col sm={{ size: 1 }} style={{ textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", height: "inherit" }}>
                        <Dropdown isOpen={openHeaders} toggle={() => SetOpenHeaders(!openHeaders)}>
                            <DropdownToggle caret>
                                Headers
                            </DropdownToggle>
                            <DropdownMenu>
                                {Object.keys(filters).sort().map((entry, index) => {
                                    return <DropdownItem>
                                        <Label style={{ marginLeft: "5px" }} onClick={() => SetFilters({ ...filters, [entry]: !filters[entry] })} check>
                                            <Input type="checkbox" defaultChecked={headers[entry]} onClick={() => SetHeaders({ ...headers, [entry]: !headers[entry] })} />{' '}
                                            {entry}
                                        </Label>
                                    </DropdownItem>
                                })}
                            </DropdownMenu>
                        </Dropdown>
                    </Col>
                )} */}
                <Col sm={{ size: 1 }} style={{ textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", height: "inherit" }}>
                    <Button color="success" onClick={() => SetSearch(!search)}>Search</Button>
                </Col>
                <Col sm={{ size: 1 }} />
            </Row>
            {/* {Object.keys(query).length > 3 &&
                <Row style={{ marginTop: "20px", height: "75px" }}>
                    <Col sm={{ size: 1 }} />
                    {
                        Object.keys(filters).filter(entry => filters[entry] === true).length === Object.keys(query).length && Object.keys(query).map((entry, index) => {
                            console.log("->", index)
                            if (index > 2 && index < 8) {
                                return <Col sm={{ size: 2 }} style={{ textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", height: "inherit" }}>
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>{entry}</InputGroupText>
                                        </InputGroupAddon>
                                        <Input placeholder={query[entry]} value={query[entry] !== undefined && query[entry] !== "all" ? query[entry] : null} onChange={(e) => SetQuery({ ...query, [entry]: e.target.value })} />
                                    </InputGroup>
                                </Col>
                            }
                            else { return <></> }
                        })
                    }
                    <Col sm={{ size: 1 }} />
                </Row>} */}
            <Row style={{ marginTop: "20px" }}>
                <Col style={{ display: "flex", justifyContent: "center", height: "inherit", width: "90vw" }}>
                    {data.length === 0 && <Spinner style={{ width: '3rem', height: '3rem', margin: "50px" }} />}
                    {data.length > 0 && <Table headers={keys.primaryHeaders} keys={keys.primaryKeys} data={data} />}
                </Col>
            </Row>
        </Container>
    )
}

export default Component