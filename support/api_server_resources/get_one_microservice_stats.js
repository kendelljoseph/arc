// # Arc | Api Server Resources
// ### Get stats for a particular microservice

// Arc loads resources for finding a microservice
const findMicroservice = require(`./find_microservice`);

// Arc can get stats for a particular microservice
module.exports = ({microservices}) => {
  return (request, response) => {
    
    // Arc gets the microservice slug from the request parameters
    const { microserviceTitleSlug } = request.params;
    
    // Arc can respond with a json with stats for a microservice
    const replyWithStats = (stats) => {
      response.json(stats);
    };
    
    // Arc can get microservice stats
    const getMicroserviceStats = ({pool, config, title}) => {
      return new Promise((resolve, reject) => {
        // **Given** Arc acquires a microservice from the pool
        pool.acquire()
          .then((microservice) => {
            // **And** Arc releases the microservice into the pool
            pool.release(microservice);
            
            // **When** Arc gets the configurations stats from the microservice
            const {settings, resource, protocol, maxLoad, process} = microservice;
            
            // **And** Arc gets the process stats from the microservice process
            const {pid, connected} = process;
            
            // **And** Arc gets the pool stats from the microservice pool
            const {size, available, borrowed, pending, max, min, spareResourceCapacity} = pool;

            // **Then** Arc will return the combined stats as a single object
            resolve({
              settings, resource, protocol, maxLoad, title, config,
              process: {pid, connected},
              pool: {size, available, borrowed, pending, max, min, spareResourceCapacity}
            });
          })
          
          // **But** Arc will return an error if an error is caught
          .catch(() => {
            reject(`Oops, let someone know there was an acquisition problem, sorry!`);
          });
      });
    };
    
    // #### Get Microservice Stats Using API Resources
    
    // **Given** Arc finds the microservice using a slug
    findMicroservice({microservices, microserviceTitleSlug})
      // **When** Arc gets stats for the microservice
      .then(getMicroserviceStats)
      
      // **Then** Arc replies with microservice stats
      .then(replyWithStats)
      
      // **But** Arc replies with an error if one was caught
      .catch((error) => {
        response.json({error: error.message ? error.message : error});
      });
  };
};