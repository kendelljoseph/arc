// # Arc | Api Server Resources
// ### Check API options

// Arc checks the API options
module.exports = (options) => {
  
  const { port } = options;
  return new Promise((resolve, reject) => {
    // Arc **rejects** API options that have not set a a port
    if(!port) return reject(new Error(`No port set for api requests`));
    
    // Arc returns the API options if everything is OK
    resolve(options);
  });
};