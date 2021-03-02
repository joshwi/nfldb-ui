const express = require("express");
const app = express();
const router = express.Router();
router.use(express.json())

//Import API middleware
const axios = require("axios")
const path = require('path')
const morgan = require("morgan");
const requestIp = require("request-ip");
const bodyParser = require('body-parser');
app.use(bodyParser.json());
morgan.token("trueIp", (req) => requestIp.getClientIp(req));
app.use(morgan(":trueIp :method :url :response-time ms"));

//Import Environment Variables
require("dotenv").config({path: path.resolve(__dirname, '../.env')});

let PROXY_URL = process.env.PROXY_URL
let PROXY_TOKEN = process.env.PROXY_TOKEN

async function api_request(url, method, body) {

    let headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + PROXY_TOKEN,
    }
    let output = { message: "Request Failed" }
    if (method === "POST" && body !== undefined) {
        output = axios({
            method: method,
            url: url,
            headers: headers,
            data: body
        }).then(response => {
            return response.data
        }).catch(error => {
            return { message: "Request Failed", error: error }
        })
    }
    else {
        output = axios({
            method: method,
            url: url,
            headers: headers,
        }).then(response => {
            return response.data
        }).catch(error => {
            return { message: "Request Failed", error: error }
        })
    }
    return output
}

app.all("*", async function (req, res, next) {
    let output = { message: "Local proxy error", error: "Not a valid API request!" }
    if (req.url !== undefined && req.method !== undefined) {
        if (req.url.indexOf("/api/static/images") === -1) {
            let url = `${PROXY_URL}${req.url}`
            output = await api_request(url, req.method, req.body)
            return res.send(output)
        }
        else {
            next()
        }
    }
});

//Run Express API Server ------------------------------------------------------------------
const port = process.env.PORT || 3001;

app.use(function (req, res, next) {
    res.status(404).send("404 route does not exist.");
});

app.listen(port, () => {
    console.log(`Running on port:  ${port}`);
});
