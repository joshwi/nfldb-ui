import React from "react";
import { Collapse, Navbar, Nav, NavItem, NavLink, Row, NavbarText } from 'reactstrap';
import { Link } from "react-router-dom";

function HEADER(props) {

  return (
    <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 2 }}>
      <Navbar color="dark" dark expand="md" style={{ marginLeft: "50px" }}>
        <Collapse navbar>
          <Nav>
            <NavItem>
              <NavLink><Link to="/" style={{ color: "white" }}><i className="bi bi-server" style={{color: "white"}}/><span style={{marginLeft: "5px"}}>NFLdb</span></Link></NavLink>
            </NavItem>
            <NavItem>
              <NavLink><Link to={`/${props.site.params && props.site.params.view ? props.site.params.view : "table"}/league`} onClick={()=> props.actions.setParams({schema: "league"})} style={{ color: "white" }}>League</Link></NavLink>
            </NavItem>
            <NavItem>
              <NavLink><Link to={`/${props.site.params && props.site.params.view ? props.site.params.view : "table"}/season`} onClick={()=> props.actions.setParams({schema: "seasons"})} style={{ color: "white" }}>Seasons</Link></NavLink>
            </NavItem>
            <NavItem>
              <NavLink><Link to={`/${props.site.params && props.site.params.view ? props.site.params.view : "table"}/team`} onClick={()=> props.actions.setParams({schema: "teams"})} style={{ color: "white" }}>Teams</Link></NavLink>
            </NavItem>
            <NavItem>
              <NavLink><Link to={`/${props.site.params && props.site.params.view ? props.site.params.view : "table"}/player`} onClick={()=> props.actions.setParams({schema: "players"})} style={{ color: "white" }}>Players</Link></NavLink>
            </NavItem>
          </Nav>
        </Collapse>
        <NavbarText style={{ float: "right" }}>
          <Row md="10"></Row>
        </NavbarText>
      </Navbar>
    </div>
  );
}

export default HEADER;