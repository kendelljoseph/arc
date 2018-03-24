// # Arc | Support
// ### Protocol Event Setter
// - Sets the paperboy event associated with microservices by the microservice `protocol`

// **Given** Arc has microservices
module.exports = ({paperboy}) => {
  return (microservices) => {
    return new Promise((resolve) => {
      microservices.forEach(({pool, manifest, title}) => {
        // **When** Arc has a method to enable listening for events by a `protocol event name`
        const listenToEvents = (protocolEventName, path) => {
          
          // **And** Paperboy recieves an event that matches that `protocol event name`
          paperboy.on(protocolEventName, (data) => {
            // **Then** the microservice will be acquired
            pool.acquire()
              .then((microservice) => {

                // The microservice has a release listener to determine when to release the service back to the pool
                const releaseListener = (message = {}) => {
                  const job = message.__job;

                  if(job) {
                    const { remaining } = job;
                    
                    // **TODO:** This kind of adjustment should eventually be done using machine learning
                    
                    // The microservice will be released into the pool **if the number of remaining jobs is less than the maximum load**
                    if(remaining < Math.abs(microservice.maxLoad)) {
                      microservice.process.removeListener(`message`, releaseListener);
                      pool.release(microservice);
                    }
                  }
                };
                
                // The microservice adds the release listener to the process
                microservice.process.on(`message`, releaseListener);
                
                // The microservice will send the `path`, the `protocol` and the `data` to the process
                microservice.process.send({path: path || null, protocol: manifest.protocol, data});
              })
              
              // Arc will trigger an error notification if there was a problem acquiring the microservice
              .catch(() => {
                paperboy.trigger(`@error`, JSON.stringify({
                  title: title,
                  metrics: {message: `acqusition error`},
                  pid: process.pid
                }));
              });
          })
            // Arc will trigger an error notification if there was a problem setting the event using `Paperboy`
            .catch(() => {
              paperboy.trigger(`@error`, JSON.stringify({
                title: title,
                metrics: {message: `paperboy error`},
                pid: process.pid}));
            });
        };

        // #### Listen to events using the protocol
        
        // Arc will listen to `root` protocol events for this microservice `ex: my-service://`
        listenToEvents(manifest.protocol);

        // Arc will Listen to protocol events with `paths` for this microservice `ex: my-service://some-path`
        if(manifest.paths && manifest.paths.length) {
          manifest.paths.forEach((path) => {
            if((typeof path) != `string`) return;
            paperboy.trigger(`@health`, JSON.stringify({
              title: title,
              metrics: {addedPath: path},
              pid: process.pid}));
            listenToEvents(`${manifest.protocol}${path}`, path);
          });
        }
      });

      // Arc will always resolve after setting protocol events for microservices
      resolve();
    });
  };
};