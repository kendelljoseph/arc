// # Arc | Support
// ### Check Config
// - Arc can check the microservice configuration object
module.exports = (config) => {
  // **TODO:** Arc will check the values according to a schema using [indicative](indicative.adonisjs.com)
  return new Promise((resolve) => {
    // **Then** the config check will return the config
    resolve(config);
  });
};