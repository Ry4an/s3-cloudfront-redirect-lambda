"use strict";

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const INDEX_DOCUMENT = "index.html";
    const PREFERRED_HOST = "www.ry4an.org";
    const host = request.headers.host[0].value;
    const path = require("path");
    const parsed_path = path.parse(request.uri);
    const REPLACEMENTS = [
        { before: /^\/unblog\/UnBlog\/(\d\d\d\d-\d\d-\d\d).*/,
          after: "/unblog/post/$1/" },
        { before: /^\/unblog\/Resume.*/,
          after: "/unblog/resume/" },
        { before: /^\/unblog\/InRemembrance.*/,
          after: "/unblog/inrememberance/" },
        { before: /^\/unblog\/Ry4anBrase.*/,
          after: "/unblog/about/" },
        { before: /^\/unblog\/UnBlog\/?$/,
          after: "/unblog/" },
        { before: /^\/rss.xml$/,
          after: "/unblog/atom.atom" },
        { before: /^\/unblog\/atom\/?$/,
          after: "/unblog/atom.atom" },
        { before: /^\/unblog\/rss.xml/,
          after: "/unblog/atom.atom" },
        { before: /^\/resume\/?$/,
          after: "/unblog/resume/" },
        { before: /^\/resume\/index.html$/,
          after: "/unblog/resume/" },
        { before: /^\/resume\/skills-and-chronology.txt/,
          after: "/unblog/resume/" },
        { before: /^\/pepermail\/unblog.*$/,
          after: "/unblog/" },
        { before: /^\/resume.html.*/,
          after: "/unblog/resume/" },
        { before: /^\/projects\/?$/,
          after: "/unblog/" },
        { before: /^\/home\/?$/,
          after: "/unblog/" }
    ];
    let changed = false;
    let replacementResult = null;
    for (let replacement of REPLACEMENTS) {
        replacementResult = request.uri.replace(replacement.before, replacement.after);
        if (replacementResult != request.uri) { // change made
            changed = true;
            break;
        }
    }
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
    } else if (changed) {  // REPLACEMENTS match
        const replacementResponse = {
            status: "301",
            statusDescription: "Moved Permanently",
            headers: {
                location: [{
                    key: "Location",
                    value: "https://" + PREFERRED_HOST + replacementResult
                }]
            }
        };
        console.log("Replacement: ", JSON.stringify(request),
                    "Response: ", JSON.stringify(replacementResponse));
        callback(null, replacementResponse);
    } else if (request.uri.startsWith("/s/")) { // url shortener
        const shortnerResponse = {
            status: "301",
            statusDescription: "Moved Permanently",
            headers: {
                location: [{
                    key: "Location",
                    value: "http://short.brase.com/" + request.uri.substring(3)
                }]
            }
        };
        console.log("URL Shortener: ", JSON.stringify(request),
                    "Response: ", JSON.stringify(shortnerResponse));
        callback(null, shortnerResponse);
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



