const express = require("express");
const fs = require("fs");
const app = express();

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/list", function (req, res) {
    const rawdata = fs.readFileSync('register.json');
    res.send(rawdata);
});

function resolveVideo(parameter) {
    const rawdata = fs.readFileSync('register.json');
    const parsedJson = JSON.parse(rawdata);
    return parsedJson.videos;
}

app.get("/video/:videoid", function (req, res) {
    const range = req.headers.range;
    const accessip = req.ip;
    const videoUrl = req.params.videoid;
    // console.log(videoUrl);
    const videoJson = resolveVideo(videoUrl);
    const videoSRC = videoJson[videoUrl];

    if (!videoUrl) {
        res.status(400).send("No video with id: " + videoSRC + " found");
    }

    if (!range) {
        res.status(400).send("Requires Range header");
    }
    
    const videoPath = videoSRC;
    const videoSize = fs.statSync(videoSRC).size;

    const CHUNK_SIZE = 4 ** 11;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize -1);

    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    console.log("_" + accessip +"_ Blog requested: " + start);

    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});

app.listen(3000, function () {
    console.log("Listening to port 8000");
})
