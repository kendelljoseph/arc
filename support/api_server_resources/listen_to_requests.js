// # Arc | Api Server Resources
// ### Listen for traffic

// Arc can listen to API traffic using an HTTP server
module.exports = ({app, server, port}) => {
  return new Promise((resolve) => {
    server.listen(port, () => {
      resolve({app, server, port});
    });
  });
};
