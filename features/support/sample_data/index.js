module.exports = {
  generic: {
    'test data'         : `testData-${Math.ceil(Math.random() * 100000)}`,
    'test protocol data': `test://`,
    'test path data'    : `get/path`,
    'test settings data': `custom-settings`
  },
  microserviceManifest: {
    'Test Microservice': {
      protocol      : `test://`,
      paths         : [
        `get/protocol`,
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
      maxWorkTime   : 10000,
      settings      : `custom-settings`
    }
  },
  paperboy: {
    keys: {
      'test key': `paperboy-test-key`
    },
    values: {
      'test value': `paperboy-test-value`
    },
    events: {
      'test event': `_this-is-a-test://`
    },
    data: {
      'test data': `paperboy test data!`
    }
  }
};