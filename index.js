"use strict";

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const INDEX_DOCUMENT = "index.html";
    const PREFERRED_HOST = "ry4an.org";
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
        { before: /^\/unblog\/threads.html$/,
          after: "/unblog/" },
        { before: /^\/unblog\/RecentChanges$/,
          after: "/unblog/atom.atom" },
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
        { before: /^\/surveillance\/.*$/,
          after: "/unblog/post/mpls-surveillance-shut-down/" },
        { before: /^\/unblog\/perlmimio-2002-04-21.tar.gz$/,
          after: "/unblog/post/2003-04-21/" },
        { before: /^\/unblog\/WikiChump-1.0.tar.gz$/,
          after: "/unblog/static/attachments/2003-07-14-wikichump.tar.gz" },
        { before: /^\/unblog\/Net-Friends-1.01.tar.gz$/,
          after: "/unblog/static/attachments/2004-01-11-Net-Friends-1.00.tar.gz" },
        { before: /^\/home\/?$/,
          after: "/unblog/" },
        { before: /^\/unblog\/static\/attachments\/2004-07-22-remote-color-bashrc$/,
          after: "/unblog/static/attachments/2004-07-22-remote-color-bashrc.sh" },
        { before: /^\/unblog\/static\/attachments\/2003-06-08-savelinks$/,
          after: "/unblog/static/attachments/2003-06-08-savelinks.sh" },
        { before: /^\/s\//,
          after: "http://short.brase.com/" },
        { before: /^\/262\//,
          after: "http://www.troop262.org/" },
        { before: /^\/hg\/resume\/rev\//,
          after: "https://bitbucket.org/Ry4an/resume/commits/" },
        { before: /^\/hg\/resume.*/,
          after: "https://bitbucket.org/Ry4an/resume" },
        { before: /^\/hg\/unblog.*/,
          after: "https://bitbucket.org/Ry4an/unblog" },
        { before: /^\/hg\/dotfiles.*/,
          after: "https://bitbucket.org/Ry4an/dotfiles" },
        { before: /^\/hg\/ad2kinesis.*/,
          after: "https://bitbucket.org/Ry4an/ad2kinesis" },
        { before: /^\/hg\/calendarboard.*/,
          after: "https://github.com/Ry4an/calendarboard" }
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
        if (replacementResult.charAt(0) == "/") {
            replacementResult = "https://" + PREFERRED_HOST + replacementResult;
        }
        const replacementResponse = {
            status: "301",
            statusDescription: "Moved Permanently",
            headers: {
                location: [{
                    key: "Location",
                    value: replacementResult
                }]
            }
        };
        console.log("Replacement: ", JSON.stringify(request),
                    "Response: ", JSON.stringify(replacementResponse));
        callback(null, replacementResponse);
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



