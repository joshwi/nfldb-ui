import React from "react";
import { Collapse, Navbar, Nav, NavItem, NavLink, Row, NavbarText } from 'reactstrap';
import { Link } from "react-router-dom";

function HEADER() {

  return (
    <div style={{position: "fixed", top: 0,  width: "100%", zIndex: 2}}>
      <Navbar color="dark" dark expand="md" style={{marginLeft: "50px"}}>
        <Collapse navbar>
          <Nav>
            <NavItem>
            <NavLink><Link to="/" style={{color: "white"}}>NFLdb</Link></NavLink>
            </NavItem>
            <NavItem>
            <NavLink><Link to="/" style={{color: "white"}}>League</Link></NavLink>
            </NavItem>
            <NavItem>
            <NavLink><Link to="/" style={{color: "white"}}>Seasons</Link></NavLink>
            </NavItem>
            <NavItem>
            <NavLink><Link to="/" style={{color: "white"}}>Teams</Link></NavLink>
            </NavItem>
            <NavItem>
            <NavLink><Link to="/" style={{color: "white"}}>Players</Link></NavLink>
            </NavItem>
          </Nav>
        </Collapse>
        <NavbarText style={{float: "right"}}>
          <Row md="10"></Row>
        </NavbarText>

      </Navbar>

    </div>
  );
}

export default HEADER;