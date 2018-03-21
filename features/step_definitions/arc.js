/*eslint no-unused-vars: [0]*/

// Dependencies
// ------------
const chai     = require(`chai`);
const should   = chai.should();
const expect   = chai.expect;
const { Given, Then } = require(`cucumber`);

Given(/^arc is ready$/, function(done){
  expect(this.arc).to.exist;
  expect(this.arc).to.be.a(`function`);
  done();
});

Given(/^arc has a step called (.*)$/, function(stepName, done){
  expect(this.arc).to.exist;
  expect(this.arc._steps).to.exist;
  expect(this.arc._steps[stepName]).to.exist;
  done();
});

Then(/^arc shuts down microservices$/, function(){
  expect(this.arc).to.exist;
  expect(this.arc.shutdownMicroservices).to.exist;
  return this.arc.shutdownMicroservices();
});