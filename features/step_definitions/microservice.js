/*eslint no-unused-vars: [0]*/

// Dependencies
// ------------
const slug   = require(`slug`);
const chai   = require(`chai`);
const should = chai.should();
const expect = chai.expect;
const { defineSupportCode: cucumber } = require(`cucumber`);

cucumber(({Given, When, Then}) => {
  // Microservice Config
  // -------------------
  Given(/^a system is using a microservice config named (.*)$/, function(microsericeTitle, done){
    expect(this.sampleData).to.be.an(`object`);
    expect(this.sampleData.config).to.be.an(`object`);
    const config = this.sampleData.config[microsericeTitle];
    expect(config).to.be.an(`object`);
    expect(this.data).to.be.an(`object`);
    this.data.configs = this.data.configs || [];
    expect(this.data.configs).to.be.an(`array`);

    let configData = {};
    this.data.configs.push((configData[microsericeTitle] = config, configData));
    done();
  });

  // Load microservices using arc
  // ----------------------------
  Given(/^a system loads microservices using arc$/, function(){
    expect(this.arc).to.be.a(`function`);
    expect(this.data).to.be.an(`object`);
    expect(this.data.configs).to.be.an(`array`);

    this.data.configs.map((config) => {
      expect(config).to.be.an(`object`);
    });

    const configs = Object.assign({}, ...this.data.configs);

    return new Promise((resolve, reject) => {
      this.arc(configs)
        .then((microservices) => {
          expect(microservices).to.be.an(`array`);
          expect(microservices.length).to.equal(this.data.configs.length);

          const normalizeTitle = (title) => slug(String(title).toLowerCase());

          microservices.forEach((microservice) => {
            expect(microservice.title).to.be.a(`string`);
            expect(microservice.config).to.be.an(`object`);
            expect(microservice.pool).to.be.an(`object`);
          });

          this.data.configs.forEach((config) => {
            Object.keys(config).forEach((fullTitle) => {
              const title = normalizeTitle(fullTitle);
              const microserviceConfig = config[fullTitle];
              const microservice = microservices.find((microservice) => {
                return microservice.title === title;
              });

              expect(microserviceConfig).to.be.an(`object`);
              expect(microservice).to.be.an(`object`);
              expect(microservice.config).to.deep.equal(microserviceConfig);
              expect(microservice.pool._config.max).to.equal(microservice.config.count);
              this.microserices = this.microserices || {};
              expect(this.microserices).to.be.an(`object`);
              this.microserices[fullTitle] = microservice;
            });
          });
        })
        .then(resolve)
        .catch(reject);
    });
  });

  // Send data to the microservice
  // -----------------------------
  Given(/^paperboy listens to (.*) and sends (.*) to the root protocol$/, function(fullTitle, dataKey){
    expect(this.paperboy).to.be.an(`object`);
    expect(this.sampleData).to.be.an(`object`);
    expect(this.sampleData.generic).to.be.an(`object`);
    expect(this.sampleData.generic[dataKey]).to.be.a(`string`);
    expect(this.microserices).to.be.an(`object`);
    expect(this.microserices[fullTitle]).to.be.an(`object`);
    const microservice = this.microserices[fullTitle];
    const data         = this.sampleData.generic[dataKey];
    const eventName    = `${microservice.config.protocol}${microservice.title}`;
    return new Promise((resolve, reject) => {
      this.paperboy.once(eventName, (returnData) => {
        this.paperboyResponse[fullTitle] = returnData;
        resolve();
      })
        .then(() => {
          return this.paperboy.trigger(microservice.config.protocol, data);
        })
        .catch(reject);
    });
  });

  // Send data to the microservice at a path
  // ---------------------------------------
  Given(/^paperboy listens to (.*) and sends (.*) to the path (.*)$/, function(fullTitle, dataKey, path){
    expect(this.paperboy).to.be.an(`object`);
    expect(this.sampleData).to.be.an(`object`);
    expect(this.sampleData.generic).to.be.an(`object`);
    expect(this.sampleData.generic[dataKey]).to.be.a(`string`);
    expect(this.microserices).to.be.an(`object`);
    expect(this.microserices[fullTitle]).to.be.an(`object`);
    const microservice = this.microserices[fullTitle];
    const data         = this.sampleData.generic[dataKey];
    const eventName    = `${microservice.config.protocol}${microservice.title}`;
    return new Promise((resolve, reject) => {
      this.paperboy.once(eventName, (returnData) => {
        this.paperboyResponse[fullTitle] = returnData;
        resolve();
      })
        .then(() => {
          return this.paperboy.trigger(`${microservice.config.protocol}${path}`, data);
        })
        .catch(reject);
    });
  });

  Given(/^a system parses the paperboy response for (.*) as a json$/, function(fullTitle, done){
    expect(this.paperboyResponse[fullTitle]).to.exist;
    this.paperboyResponse[fullTitle] = JSON.parse(this.paperboyResponse[fullTitle]);
    done();
  });

  Given(/^a system sees the paperboy response for (.*) exists$/, function(fullTitle, done){
    expect(this.paperboyResponse[fullTitle]).to.exist;
    done();
  });

  Given(/^a system sees the paperboy response for (.*) that has a (.*) property$/, function(fullTitle, property, done){
    expect(this.paperboyResponse[fullTitle]).to.exist;
    expect(this.paperboyResponse[fullTitle][property]).to.exist;
    done();
  });

  Given(/^a system sees the paperboy response for (.*) matches (.*)$/, function(fullTitle, dataKey, done){
    expect(this.paperboyResponse[fullTitle]).to.exist;
    expect(this.sampleData).to.be.an(`object`);
    expect(this.sampleData.response).to.be.an(`object`);
    expect(this.sampleData.response[dataKey]).to.exist;
    expect(this.paperboyResponse[fullTitle]).to.deep.equal(this.sampleData.response[dataKey]);
    done();
  });

  Given(/^a system sees the paperboy response for (.*) has a property named (.*) that is set to (.*)$/, function(fullTitle, property, dataKey, done){
    expect(this.paperboyResponse[fullTitle]).to.exist;
    expect(this.paperboyResponse[fullTitle][property]).to.exist;
    expect(this.sampleData).to.be.an(`object`);
    expect(this.sampleData.response).to.be.an(`object`);
    expect(this.sampleData.response[dataKey]).to.exist;
    expect(this.paperboyResponse[fullTitle][property]).to.deep.equal(this.sampleData.response[dataKey]);
    done();
  });
});