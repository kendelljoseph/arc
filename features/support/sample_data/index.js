module.exports = {
  generic: {
    'test data': `testData-${Math.ceil(Math.random() * 100000)}`,
    'nothing'  : ``
  },
  microserviceManifest: {
    'Test Microservice': {
      paths         : [
        `get/title`,
        `get/path`,
        `get/settings`,
        `async/situation`,
        `process/send`,
        `cache/custom/set`,
        `cache/custom/get`,
      ],
      resource      : `sample_microservice`,
      resourceFolder: `features/support/sample_data`,
      description   : `A microservice for testing`,
      count         : 2,
      settings      : `custom-settings`
    }
  }
};