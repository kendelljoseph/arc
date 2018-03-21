# Arc
[![Build Status](https://travis-ci.org/altereagle/arc.svg?branch=master)](https://travis-ci.org/altereagle/arc)
[![Maintainability](https://api.codeclimate.com/v1/badges/250cba5c85e88cec6dfb/maintainability)](https://codeclimate.com/github/altereagle/arc/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/250cba5c85e88cec6dfb/test_coverage)](https://codeclimate.com/github/altereagle/arc/test_coverage)

A microservice framework


![gif](https://media.giphy.com/media/kFyLfPH7FU7zW/giphy.gif)

## Install
`npm install arcms`

**Example:** Create a microservice
> /microservice/arc.example/index.js

```javascript
module.exports = () => {
  return `Hello, World!`;
};
```

**Example:** Use the microservice with Arc
> /example.js

```javascript
// A developer can set Arc microservice config options
const config = {
  'Example': {
    protocol   : `example-protocol-name://`,
    resource   : `arc.example`,
    description: `This says Hello World`
  }
};

// A developer can set API server options
const apiOptions = {
  port: 8080
};

// A developer can require the Arc library
const arc = require(`arcms`);

// A developer can start their Arc
arc(config, apiOptions)
  .then(() => {
    console.log(`This Arc is online`.bold.cyan);
  });

// A developer can view the API at http://localhost:8080
```

```bash
node example.js
```

---