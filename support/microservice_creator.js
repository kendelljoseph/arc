// # Arc | Support
// ### Microservice Creation
// * Arc creates microservices using a `worker pool` and `configuration`

// Arc loads resources it needs for microservice creation
const { slug } = require(`../dependencies`);

module.exports = (workerPool, configs) => {
  return new Promise((resolve) => {
    // **Given** Arc gets the titles of the microservices from the configurations object
    const titles = Object.keys(configs);
    
    // **When** Arc creates microservices by their titles
    const microservices = titles.map((unformattedTitle) => {
      // **And** Arc gets the configuration for the microservice
      const config = configs[unformattedTitle];
      // **TODO:** remove special characters from the microservice title
      
      // **And** Arc creates a slug from the microservice title
      const title = slug(String(unformattedTitle).toLocaleLowerCase());
      
      // **Then** Arc returns the microservice with the `title`, `config` and `pool` set
      return { title, config, pool: workerPool({title, config})};
    });

    // Arc returns the microservices it created
    resolve(microservices);
  });
};