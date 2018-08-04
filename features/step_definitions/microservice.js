/*eslint no-unused-vars: [0]*/

// Dependencies
// ------------
const slugify = require(`slugify`);
const chai    = require(`chai`);
const should  = chai.should();
const expect  = chai.expect;
const {Given, When, Then, AfterAll} = require(`cucumber`);

// Microservice Manifest
// ---------------------
Given(/^a system is using a microservice manifest named (.*)$/, function(microsericeTitle, done){
  expect(this.sampleData).to.be.an(`object`);
  expect(this.sampleData.microserviceManifest).to.be.an(`object`);
  const manifest = this.sampleData.microserviceManifest[microsericeTitle];
  expect(manifest).to.be.an(`object`);
  expect(this.data).to.be.an(`object`);
  this.data.manifests = this.data.manifests || [];
  expect(this.data.manifests).to.be.an(`array`);

  let manifestData = {};
  this.data.manifests.push((manifestData[microsericeTitle] = manifest, manifestData));
  done();
});

// Load microservices using arc
// ----------------------------
Given(/^a system loads microservices using arc$/, function(){
  expect(this.arc).to.be.a(`function`);
  expect(this.data).to.be.an(`object`);
  expect(this.data.manifests).to.be.an(`array`);

  this.data.manifests.map((manifest) => {
    expect(manifest).to.be.an(`object`);
  });

  const manifests = Object.assign({}, ...this.data.manifests);

  return new Promise((resolve, reject) => {
    this.arc(manifests)
      .then((microservices) => {
        expect(microservices).to.be.an(`array`);
        expect(microservices.length).to.equal(this.data.manifests.length);

        const normalizeTitle = (title) => slugify(String(title).toLowerCase());

        microservices.forEach((microservice) => {
          expect(microservice.title).to.be.a(`string`);
          expect(microservice.manifest).to.be.an(`object`);
          expect(microservice.pool).to.be.an(`object`);
        });

        this.data.manifests.forEach((manifest) => {
          Object.keys(manifest).forEach((fullTitle) => {
            const title = normalizeTitle(fullTitle);
            const microserviceManifest = manifest[fullTitle];
            const microservice = microservices.find((microservice) => {
              return microservice.title === title;
            });

            expect(microserviceManifest).to.be.an(`object`);
            expect(microservice).to.be.an(`object`);
            expect(microservice.manifest).to.deep.equal(microserviceManifest);
            expect(microservice.pool._config.max).to.equal(microservice.manifest.count);
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
Given(/^paperboy listens to (.*) and sends (.*) to the root path$/, function(fullTitle, dataKey){
  expect(this.paperboy).to.be.an(`object`);
  expect(this.sampleData).to.be.an(`object`);
  expect(this.sampleData.generic).to.be.an(`object`);
  expect(this.sampleData.generic[dataKey]).to.be.a(`string`);
  expect(this.microserices).to.be.an(`object`);
  expect(this.microserices[fullTitle]).to.be.an(`object`);
  const microservice = this.microserices[fullTitle];
  const data         = this.sampleData.generic[dataKey];
  const eventName    = `${microservice.title}`;
  return new Promise((resolve, reject) => {
    this.paperboy.once(eventName, (returnData) => {
      this.paperboyResponse[fullTitle] = returnData;
      resolve();
    })
      .then(() => {
        return this.paperboy.trigger(`@${microservice.title}`, data);
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
  const eventName    = `${microservice.title}`;
  return new Promise((resolve, reject) => {
    this.paperboy.once(eventName, (returnData) => {
      this.paperboyResponse[fullTitle] = returnData;
      resolve();
    })
      .then(() => {
        return this.paperboy.trigger(`@${microservice.title}/${path}`, data);
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

// Cucucmber must be exited manually when an instance of arc is started
AfterAll(function(){
  setTimeout(function(){
    process.exit(0);
  }, 2000);
});