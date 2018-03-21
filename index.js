// # Arc
// ### A microservice manager
// ![gif](https://media.giphy.com/media/kFyLfPH7FU7zW/giphy.gif)

// Arc loads node modules it depends to operate
const { dotenv } = require(`./dependencies`);

// Arc adds the `.env file` variables to the process
dotenv.config();

// Arc loads paperboy for intersystem communication
const Paperboy = require(`paperboy-communicator`);
const paperboy = new Paperboy({connectionName: `arc`});

// Arc updates the process title
process.title = `@/_arc-${process.title}`;

// Arc loads support modules
const checkConfig         = require(`./support/check_config`);
const messageParser       = require(`./support/message_parser`)({paperboy});
const createWorkerPool    = require(`./support/create_worker_pool`)({paperboy});
const createMicroservices = require(`./support/microservice_creator`);
const setProtocolEvents   = require(`./support/protocol_event_setter`)({paperboy});

// Arc creates a global variable to store a reference to microservices
let allMicroservices = {};

// Arc can use a global function to get all microservices
const getAllMicroservices = () => allMicroservices;

// Arc can parse messages using the message parser support module
const parseMessage = (options) => messageParser(getAllMicroservices(), options);

// Arc can create a microservice worker pool
const workerPool = (options) => createWorkerPool(parseMessage, options);

// Arc can shutdown microservices
const shutdownMicroservices = require(`./support/shutdown_microservices`)({paperboy});

// #### Arc can create pools of microservices
module.exports = (configs = require(`${process.cwd()}/config`)) => {
  return new Promise((resolve, reject) => {
    void async function(){
      try {
        // **Given** Arc checks the config file to see if it has any errors
        const parsedConfigs = await checkConfig(configs);
        
        // **And** Arc creates microservices
        allMicroservices    = await createMicroservices(workerPool, parsedConfigs);
        
        // **And** Arc sets the intersystem communication events for microservies it created
        await setProtocolEvents(allMicroservices);

        // **And* Arc waits for extensions to do their thing
        await Promise.all(module.exports._extensions.map(({extension, options}) => {
          return new Promise((resolve) => {
            resolve(extension({paperboy, microservices: allMicroservices, options}));
          });
        }));
        
        // **And** Arc uses paperboy to let the system know about microservices that are online
        allMicroservices.forEach((microservice) => {
          paperboy.trigger(`@health`, JSON.stringify({
            title: microservice.title,
            metrics: {status: `online`},
            pid: process.pid
          }));
        });

        // **Then** Arc returns the microservices it created
        resolve(allMicroservices);
      } catch (error) {
        
        // **But** Arc returns an error message when something goes wrong
        reject(error);
      }
    }();
  });
};

// Arc adds the steps it uses to the exported module 
// > this is only for testing what Arc can do
module.exports._steps = {
  checkConfig, parseMessage, workerPool,
  createMicroservices, setProtocolEvents, getAllMicroservices
};

// Arc can shutdown the microservices it created
module.exports.shutdownMicroservices = () => shutdownMicroservices(getAllMicroservices());

// Arc can be extended
module.exports._extensions = [];
module.exports.addExtension = (extension, options = {}) => {
  if(typeof extension != `function`) throw Error(`Arc extension must be a function or a promise`);
  module.exports._extensions.push({extension, options});
};