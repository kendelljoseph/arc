// This is the testing world variables available throughout all tests
// ------------------------------------------------------------------

// Load enviornmental variables (.env file) onto the process.env
// -------------------------------------------------------------
require(`dotenv`).config();

// Dependencies
// ------------
const {defineSupportCode: cucumber} = require(`cucumber`);
const Paperboy = require(`paperboy-communicator`);

cucumber(({setWorldConstructor}) => {
  // Set world data
  // --------------
  setWorldConstructor(function(){

    // General data storage
    // --------------------
    this.data = {};

    // Paperboy
    // --------
    this.paperboy = new Paperboy({connectionName:`test-suite`});
    
    // Paperboy responses
    // ------------------
    this.paperboyResponse = {};

    // Sample data
    // -----------
    this.sampleData = require(`./sample_data`);

    // Local dependencies
    // ------------------
    this.dependencies = require(`../../dependencies`);

    // Local package json
    // ------------------
    this.package = require(`../../package.json`);
  });
});