// # Arc | Support
// ### Check Manifest
// - Arc can check the microservice manifest object
module.exports = (manifest) => {
  // **TODO:** Arc will check the values according to a schema using [indicative](indicative.adonisjs.com)
  return new Promise((resolve) => {
    // **Then** the manifest check will return the manifest
    resolve(manifest);
  });
};