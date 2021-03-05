import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../static/css/main.css"

function SIDEBAR(props) {

    const [open, SetOpen] = useState(false)

    function toggle() {
        SetOpen(!open)
    }

    return (
        <nav id="sidebar" className={`col-md-2 d-none d-md-block bg-dark sidebar${open ? " active" : ""}`}>
            <div className="sidebar-sticky">
                <div className="toggle-btn" onClick={() => toggle()}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <ul style={{ marginTop: "75px" }} className="nav flex-column">
                    <li className="nav-item" style={{ height: "50px", backgroundColor: "transparent" }}>
                        <Link to={`/table/${props.site.params && props.site.params.schema ? props.site.params.schema : "season"}`} onClick={()=> props.actions.setParams({view: "table"})} style={{ color: "white" }}>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "inherit" }}>
                                <i className="bi bi-table" style={{color: "white"}}/>
                                {open === true && (
                                    <span style={{ backgroundColor: "transparent" }}>
                                        <div className="nav-link">Table</div>
                                    </span>
                                )}
                            </div>
                        </Link>
                    </li>
                    <li className="nav-item" style={{ height: "50px", backgroundColor: "transparent" }}>
                        <Link to={`/chart/${props.site.params && props.site.params.schema ? props.site.params.schema : "season"}`} onClick={()=> props.actions.setParams({view: "chart"})} style={{ color: "white" }}>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "inherit" }}>
                                <i className="bi bi-bar-chart" style={{color: "white"}}/>
                                {open === true && (
                                    <span style={{ backgroundColor: "transparent" }}>
                                        <div className="nav-link">Chart</div>
                                    </span>
                                )}
                            </div>
                        </Link>
                    </li>
                    <li className="nav-item" style={{ height: "50px", backgroundColor: "transparent" }}>
                        <Link to={`/explorer/${props.site.params && props.site.params.schema ? props.site.params.schema : "season"}`} onClick={()=> props.actions.setParams({view: "explorer"})} style={{ color: "white" }}>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "inherit" }}>
                            <i className="bi bi-cursor" style={{color: "white"}}/>
                                {open === true && (
                                    <span style={{ backgroundColor: "transparent" }}>
                                        <div className="nav-link">Explorer</div>
                                    </span>
                                )}
                            </div>
                        </Link>
                    </li>
                    <li className="nav-item" style={{ height: "50px", backgroundColor: "transparent" }}>
                        <Link to={`/map/${props.site.params && props.site.params.schema ? props.site.params.schema : "season"}`} onClick={()=> props.actions.setParams({view: "map"})} style={{ color: "white" }}>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "inherit" }}>
                                <i className="bi bi-map" style={{color: "white"}}/>
                                {open === true && (
                                    <span style={{ backgroundColor: "transparent" }}>
                                        <div className="nav-link">Map</div>
                                    </span>
                                )}
                            </div>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default SIDEBAR;