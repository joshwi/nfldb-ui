import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../static/css/main.css"

function SIDEBAR() {

    const [open, SetOpen] = useState(false)

    function toggle(){
        SetOpen(!open)
        if(open === false){
            document.getElementById("main").classList.toggle('active')
            // document.getElementById("main").style.marginLeft = "200px";
        }
        else{
            document.getElementById("main").classList.toggle('active')
            // document.getElementById("main").style.marginLeft = "50px";
        }
    }

    return (
        // <div className="container-fluid">
        // <div className="row">
        <nav id="sidebar" className={`col-md-2 d-none d-md-block bg-dark sidebar${open ? " active" : ""}`}>
            <div className="sidebar-sticky">
                <div className="toggle-btn" onClick={() => toggle()}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <ul style={{ marginTop: "75px" }} className="nav flex-column">
                    <li className="nav-item" style={{ height: "50px", backgroundColor: "transparent" }}>
                        <Link to="/table" style={{ color: "white" }}>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "inherit" }}>
                                <span style={{ backgroundColor: "transparent" }}>

                                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-table" fill="white" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z" />
                                    </svg>

                                </span>
                                {open === true && (
                                    <span style={{ backgroundColor: "transparent" }}>
                                        <div className="nav-link">Table</div>
                                    </span>
                                )}
                            </div>
                        </Link>
                    </li>
                    <li className="nav-item" style={{ height: "50px", backgroundColor: "transparent" }}>
                        <Link to="/" style={{ color: "white" }}>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "inherit" }}>
                                <span style={{ backgroundColor: "transparent" }}>
                                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-bar-chart" fill="white" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5h-2v12h2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z" />
                                    </svg>
                                </span>
                                {open === true && (
                                    <span style={{ backgroundColor: "transparent" }}>
                                        <div className="nav-link">Chart</div>
                                    </span>
                                )}
                            </div>
                        </Link>
                    </li>
                    <li className="nav-item" style={{ height: "50px", backgroundColor: "transparent" }}>
                        <Link to="/" style={{ color: "white" }}>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "inherit" }}>
                                <span style={{ backgroundColor: "transparent" }}>
                                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-cursor" fill="white" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103zM2.25 8.184l3.897 1.67a.5.5 0 0 1 .262.263l1.67 3.897L12.743 3.52 2.25 8.184z" />
                                    </svg>
                                </span>
                                {open === true && (
                                    <span style={{ backgroundColor: "transparent" }}>
                                        <div className="nav-link">Explorer</div>
                                    </span>
                                )}
                            </div>
                        </Link>
                    </li>
                    <li className="nav-item" style={{ height: "50px", backgroundColor: "transparent" }}>
                        <Link to="/" style={{ color: "white" }}>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "inherit" }}>
                                <span style={{ backgroundColor: "transparent" }}>
                                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-map" fill="white" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M15.817.113A.5.5 0 0 1 16 .5v14a.5.5 0 0 1-.402.49l-5 1a.502.502 0 0 1-.196 0L5.5 15.01l-4.902.98A.5.5 0 0 1 0 15.5v-14a.5.5 0 0 1 .402-.49l5-1a.5.5 0 0 1 .196 0L10.5.99l4.902-.98a.5.5 0 0 1 .415.103zM10 1.91l-4-.8v12.98l4 .8V1.91zm1 12.98l4-.8V1.11l-4 .8v12.98zm-6-.8V1.11l-4 .8v12.98l4-.8z" />
                                    </svg>
                                </span>
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
        // </div>
        // </div>
    )
}

export default SIDEBAR;