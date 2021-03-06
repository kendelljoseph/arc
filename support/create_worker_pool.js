// # Arc | Support
// ### Create Microservice Worker Pool

// Arc loads a child process forker
const { fork } = require(`child_process`);

// Arc loads dependencies required to create microservice pools
const { 'generic-pool': genericPool } = require(`../dependencies`);

// Arc creates a microservice worker pool
module.exports = ({paperboy}) => {
  return (parseMessage, {title, manifest}) => {
    // #### Microservice Pool Configuration
    manifest.maxLoad        = manifest.maxLoad || 1;
    manifest.resourceFolder = manifest.resourceFolder || `microservice`;
    manifest.count          = manifest.count || 1;
    manifest.startOnline    = manifest.startOnline || false;
    manifest.description    = manifest.description || `describe what this does`;

    const {
      // * Arc gets the resource to use from the manifest
      resource,

      // * Arc gets the max load from the manifest
      maxLoad,

      // * Arc gets the resource folder to use from the manifest
      resourceFolder,

      // * Arc gets the initial process count from the manifest
      count,

      // * Arc gets the initial starting state from the manifest
      startOnline,

      // * Arc gets the description from the manifest
      description,

      // * Arc gets the settings to pass to the microservice pool from the manifest
      settings
    } = manifest;

    return genericPool.createPool({
      // #### Microservice Creation

      // **Given** a new microservice needs to be created to add to the pool
      create: function() {


        // **When** Arc creates the microservice object
        const microservice = {
          // **And** Arc adds the configurations to the object
          title, settings, resource, maxLoad,

          // **And** Arc forks a process for the microservice
          process : fork(`${__dirname}/process`, { stdio: `inherit` })
        };

        // **Then** Arc triggers a health notification to indicate the microservice was created
        paperboy.trigger(`@health`, JSON.stringify({
          title: title, metrics: {
            status: `created`, resource, resourceFolder, description,
            pid: microservice.process.pid
          }, pid: process.pid}));

        return new Promise((resolve, reject) => {
          // Arc sets local variables indicating the `resource` and `settings` have been set for the microservice
          let resourceSet = false;
          let settingsSet = settings != undefined ? false : true;

          // #### Microservice setup

          // Arc creates an event listener for microservice setup events
          const setupListener = (message) => {
            // **Given** Arc listens for setup oriented events indicating the `resource` and `settings` are set for the microservice
            if(message === `*setup://title/work/set`) resourceSet = true;
            if(message === `*setup://settings/set`)   settingsSet = true;

            // **When** the setup listener is called and the resource and settings have been set for the microservice
            if(resourceSet && settingsSet) {
              // **Then** Arc will remove the setup listener
              microservice.process.removeListener(`message`, setupListener);

              // **And** Arc will trigger a health notification for the microservice
              paperboy.trigger(`@health`, JSON.stringify({
                title: microservice.title,
                metrics: {
                  message: `online`,
                  pid: microservice.process.pid
                }, pid: process.pid}));

              // **And** Arc will add the `message` event listener for the microservice
              microservice.process.on(`message`, (message) => {
                parseMessage({microservice, message});
              });

              // **And** Arc will return the microservice
              resolve(microservice);
            }
          };

          // #### The microservices are setup by sending data to the process

          // Arc adds an event listener that listens for microservice setup events
          microservice.process.on(`message`, setupListener);

          // Arc sends the title, resource, and resource folder to the microservice
          microservice.process.send(`*setup://${title}//${resource}//${resourceFolder || ``}`);

          // Arc sends the settings to the microservice
          if(settings) microservice.process.send(`*settings://${JSON.stringify(settings)}`);
        });
      },

      // #### The microservice pool kills processes that are destroyed
      destroy: function(microservice) {
        // Arc kills processes that are destroyed by the pool
        microservice.process.kill();

        // Arc triggers a health notification for the killed microservice process
        paperboy.trigger(`@health`, JSON.stringify({
          title: microservice.title,
          metrics: {
            destroyed: microservice.process.pid
          }, pid: process.pid}));

        // Arc returns the microservice with a killed process
        return Promise.resolve(microservice);
      },
    }, {
      // Arc sets the minimum number of microservice processes available in the pool
      min      : startOnline ? 1 : 0,

      // Arc sets the maximum number of microservices in the pool
      max      : count,

      // Arc will start the microservice process immediately by default
      autostart: startOnline ? true : false
    });
  };
};