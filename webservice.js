const express = require("express");
const fs = require("fs");
const app = express();

function printFileAccess(filename) {
    console.log(`${filename} has been requested`);
}

function requestResource(res, path) {
    if (fs.existsSync(__dirname + "/" + path)) {
        res.sendFile(__dirname + "/" + path)
    } else {
        let pathParts = path.split("/");
        console.log(`File request denied resource: ${pathParts[pathParts.length - 1]}`);
    }
}

app.get("/", function (req, res) {
    requestResource(res, "index.html");
});

app.get("/assets/styles/:stylename", function (req, res) {
    requestResource(res, "assets/styles/" + req.params.stylename);
});

app.get("/assets/images/:imgname", function (req, res) {
    requestResource(res, "assets/images/" + req.params.imgname);
});

app.listen(3000, function () {
    console.log("Listening to port 3000");
})