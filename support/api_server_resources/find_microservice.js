// # Arc | Api Server Resources
// ### Finds a microservice

// Arc can find a microservice by **the title as a slug**
module.exports = ({microservices, microserviceTitleSlug}) => {
  return new Promise((resolve, reject) => {
    const microservice = microservices.find(({title}) => title === microserviceTitleSlug);
    // Arc returns the microservice if it was found
    if(microservice) return resolve(microservice);
    
    // Arc rejects the request if a microservice could not be found
    reject(`There is no service named ${microserviceTitleSlug}`);
  });
};