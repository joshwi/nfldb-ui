/*eslint-disable*/
//JS Packages
import React, { useState, useEffect } from "react";
import mapboxgl from 'mapbox-gl';
//React components


function MAP(props) {

    // useEffect(() => { console.log(props.data) }, [props.data])

    var peerSource, initialFeatures

    const [viewPort, SetViewPort] = useState({
        latitude: 38,
        longitude: -100,
        zoom: 4
    })

    useEffect(() => {

            // mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
            mapboxgl.accessToken = "pk.eyJ1IjoianNod2lsbGlhbXMiLCJhIjoiY2tmNjdxam96MDJ3bDJ5cXA4MGJ4OTM5ZCJ9.0-i8n1QaPoRrdYFBt_OdDQ"
            var map = new mapboxgl.Map({
                container: 'mapbox',
                style: 'mapbox://styles/mapbox/dark-v10',
                center: [viewPort.longitude, viewPort.latitude],
                zoom: viewPort.zoom
            });
    }, [])

    // searchbox onkeyup brings you here - passed value is the search string
    function searchPeers(search) {
        // console.log(search)
        // if nothing (search cleared), reset to initial features
        if (search == '') {
            var newFeatures = initialFeatures
        } else {
            // var newFeatures = initialFeatures.filter((peer) => peer.properties.description.toLowerCase().includes(search))   // searched based on peer description only
            var newFeatures = initialFeatures.filter((peer) => Object.keys(peer.properties).some(k => peer.properties[k].toLowerCase().includes(search)))   // search across all peer properties
        }

        peerSource._data.features = newFeatures.flat()  // remove extra depth of array [[],[],[]] => [,,]
        peerSource.setData(peerSource._data)   // update map source (data the visual layer is referencing)
    }

    // useEffect(() => { console.log(props.data) }, [props.data])

    return (
        <>
            <header>
                <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v1.8.1/mapbox-gl.js'></script>
                <link href='https://api.mapbox.com/mapbox-gl-js/v1.8.0/mapbox-gl.css' rel='stylesheet' />
                <style>
                    {`
                    /* clears the 'X' from Internet Explorer - avoids user clearing search field and missing onkeyup event to repopulate peers */
                    /*input[type= search]{display: none; width : 0; height: 0; } */
                    /*input[type=search]::-ms-reveal {display: none; width : 0; height: 0; } */

                    /* clears the 'X' from Chrome - avoids user clearing search field and missing onkeyup event to repopulate peers */
                    /*input[type="search"]::-webkit-search-decoration, */
                    /*input[type="search"]::-webkit-search-cancel-button, */
                    /*input[type="search"]::-webkit-search-results-button, */
                    /*input[type="search"]::-webkit-search-results-decoration {display: none; } */

                    body {
                        margin: 0;
                        padding: 0;
                    }

                    #mapbox {
                        // position: absolute;
                        top: 0;
                        bottom: 0;
                        width: 100%;
                    }

                    #search {
                        position: absolute;
                        top: 100px;
                        left: 45%;
                        z-index: 5;
                    }
                    `}
                </style>
            </header>
            <body>
                {/* {props.data.features !== undefined && props.data.features.length === 0 && (
                    <div className='col-md-12 flex-center panel'>
                    </div>
                )}
                {props.data.features !== undefined && props.data.features.length > 0 && ( */}
                    <>
                        <input type="search" id="search" class="form-control col-2" placeholder="Search NFLdb" onChange={(e) => searchPeers(e.target.value)}></input>
                        <div style={{ height: "100vh", width: "100vw" }} id="mapbox"></div>
                    </>
                {/* )} */}
            </body>
        </>
    )
}

export default MAP;