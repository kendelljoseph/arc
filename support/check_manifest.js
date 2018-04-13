// # Arc | Support
// ### Check Manifest
// - Arc can check the microservice manifest object
module.exports = (manifest = {}) => {
  // **TODO:** Arc will check the values according to a schema using [indicative](indicative.adonisjs.com)
  // * [Pivotal Story](https://www.pivotaltracker.com/story/show/156256071)
  return new Promise((resolve) => {
    if(Object.keys(manifest).length === 0 && manifest.constructor === Object) {
      console.error(`This Arc manifest is empty!`.red);
    }
    // **Then** the manifest check will return the manifest
    resolve(manifest);
  });
};