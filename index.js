"use strict";

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const INDEX_DOCUMENT = "index.html";
    const PREFERRED_HOST = "www.ry4an.org";
    const host = request.headers.host[0].value;
    const path = require("path");
    const parsed_path = path.parse(request.uri);
    if (host != PREFERRED_HOST) {
        const hostResponse = {
            status: "301",
            statusDescription: "Moved Permanently",
            headers: {
                location: [{
                    key: "Location",
                    value: "https://" + PREFERRED_HOST + request.uri
                }]
            }
        };
        console.log("Canonicalize host: ", JSON.stringify(request),
                    "Response: ", JSON.stringify(hostResponse));
        callback(null, hostResponse);
    } else if (request.uri.substr(-1) === "/") { // directory request
        // append index.html and continue request
        request.uri += INDEX_DOCUMENT;
        console.log("Added index document: ", JSON.stringify(request));
        callback(null, request);
    } else if (parsed_path.ext === "") { // no file extension
        const dirResponse = {
            status: "301",
            statusDescription: "Moved Permanently",
            headers: {
                location: [{
                    key: "Location",
                    value: "https://" + PREFERRED_HOST + request.uri + "/"
                }]
            }
        };
        console.log("Append trailing slash: ", JSON.stringify(request),
                    "Response: ", JSON.stringify(dirResponse));
        callback(null, dirResponse);
    } else {
        console.log("No Change: ", JSON.stringify(request));
        callback(null, request); // no change
    }
};



