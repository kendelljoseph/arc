// # Arc | Api Server Resources
// ### Usage Reporter

// Arc loads dependencies useful for reporting API usage
const {
  morgan,
  'user-agent-parser': userAgentParser
} = require(`../../dependencies`);

// Arc can report API usage
module.exports = ({paperboy, port}) => {
  return morgan(function (tokens, request, resonse) {
    // **Given** Arc extracts useful usage information from the request
    const method        = tokens.method(request, resonse);
    const url           = tokens.url(request, resonse);
    const status        = parseInt(tokens.status(request, resonse));
    const contentLength = tokens.res(request, resonse, `content-length`);
    const responseTime  = parseFloat(tokens[`response-time`](request, resonse));
    const xhr           = request.xhr;
    const query         = request.query;
    const body          = request.body;
    const ip            = request.ip;
    const params        = request.params;
    const {
      browser, engine,
      os, device, cpu
    } = userAgentParser(request.headers[`user-agent`]);
    const apiKey = request.headers[`arc-api-key`] || `public`;
    
    // **Then** Arc triggers an API notification with the usage data
    paperboy.trigger(`@api`, JSON.stringify({
      title: process.pid,
      metrics: {
        status, ip, method, url, apiKey, query, body, params,
        browser, engine, os, device, cpu,
        xhr, contentLength, responseTime, port},
      pid: process.pid
    }));
  });
};