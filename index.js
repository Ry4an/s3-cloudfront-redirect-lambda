'use strict';

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const PREFERRED_HOST = "www.ry4an.org";
    const host = request.headers.host[0].value
    if (host != PREFERRED_HOST) {
        const response = {
            status: '301',
            statusDescription: 'Moved Permanently',
            headers: {
                location: [{
                    key: 'Location',
                    value: "https://" + PREFERRED_HOST + request.uri
                }]
            }
        };
        console.log('Request: ', request.uri, "Response:", response);
        callback(null, response);
    } else {
        callback(null, request);
    }
};



