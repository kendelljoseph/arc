// # Arc | Support
// ### Microservice Creation
// * Arc creates microservices using a `worker pool` and a `manifest`

// Arc loads resources it needs for microservice creation
const { slugify } = require(`../dependencies`);

module.exports = (workerPool, microserviceManifest) => {
  return new Promise((resolve) => {
    // **Given** Arc gets the titles of the microservices from the manifest object
    const titles = Object.keys(microserviceManifest);

    // **When** Arc creates microservices by their titles
    const microservices = titles.map((unformattedTitle) => {
      // **And** Arc gets the manifest for the microservice
      const manifest = microserviceManifest[unformattedTitle];
      // **TODO:** remove special characters from the microservice title

      // **And** Arc creates a slug from the microservice title
      const title = slugify(String(unformattedTitle).toLocaleLowerCase());

      // **Then** Arc returns the microservice with the `title`, `manifest` and `pool` set
      return { title, manifest, pool: workerPool({title, manifest})};
    });

    // Arc returns the microservices it created
    resolve(microservices);
  });
};