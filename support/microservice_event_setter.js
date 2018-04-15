// # Arc | Support
// ### Event Setter
// - Sets the paperboy event associated with microservices by the microservice event

// **Given** Arc has microservices
module.exports = ({paperboy}) => {
  return (microservices) => {
    return new Promise((resolve) => {
      microservices.forEach(({pool, manifest, title}) => {
        // **When** Arc has a method to enable listening for events by the title of the microservice
        const listenToEvents = (eventName, path = null) => {

          // **And** Paperboy recieves an event that matches the `title` of the microservice
          paperboy.on(eventName, (data) => {
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

                // The microservice will send the `path`, the `title` and the `data` to the process
                microservice.process.send({path: path, title: title, data});
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

        // #### Listen to events using the microservice title

        // Arc will listen to `root` events for this microservice `ex: microservice-example`
        listenToEvents(`@${title}`);

        // Arc will Listen to events with `paths` for this microservice `ex: microservice-example/path`
        if(manifest.paths && manifest.paths.length) {
          manifest.paths.forEach((path) => {
            if((typeof path) != `string`) return;
            paperboy.trigger(`@health`, JSON.stringify({
              title  : title,
              metrics: {addedPath: path},
              pid    : process.pid
            }));

            listenToEvents(`@${title}/${path}`, path);
          });
        }
      });

      // Arc will always resolve after setting events for microservices
      resolve();
    });
  };
};