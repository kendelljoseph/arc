// # Arc | Support
// ### Create API Server
// - Arc can create an API server that can communicate with microservices over HTTP

// Arc loads API server creation resources
const checkApiOptions     = require(`./api_server_resources/check_api_options`);
const createExpressServer = require(`./api_server_resources/create_express_server`);
const listenToRequests    = require(`./api_server_resources/listen_to_requests`);

// Arc creates an [express](https://expressjs.com/) server that listens for api requests
module.exports = ({paperboy}) => {
  return ({microservices, options}) => {
    // **Given** Arc checks the API server creation options
    return checkApiOptions(options)
      // **When** Arc creates the express server
      .then((verifiedOptions) => createExpressServer({microservices, paperboy}, verifiedOptions))
      // **Then** Arc will listen to traffic using the express server
      .then(listenToRequests)
      // **And** Arc will trigger a `health` notification for the API server
      .then(({ port }) => {
        paperboy.trigger(`@health`, JSON.stringify({
          title: process.pid,
          metrics: {api:{status: `online`, port: port}}, pid: process.pid}));
      })
      // **But** Arc will trigger a `warning` notification if the API server could not boot
      .catch((error) => {
        paperboy.trigger(`@warn`, JSON.stringify({
          title: process.pid,
          metrics: error.toString ? error.toString() : `api boot error`}));
      });
  };
};