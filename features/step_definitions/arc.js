/*eslint no-unused-vars: [0]*/

// Dependencies
// ------------
const { expect }      = require(`chai`);
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

Given(/^arc has a property called (.*)$/, function(methodName, done){
  expect(this.arc).to.exist;
  expect(this.arc[methodName]).to.exist;
  done();
});

Then(/^arc shuts down microservices$/, function(){
  expect(this.arc).to.exist;
  expect(this.arc.shutdownMicroservices).to.exist;
  return this.arc.shutdownMicroservices();
});

// TODO: Apply
Given(/^arc adds \ban?\b (.*) extension$/, function(extensionName, done){
  expect(this.sampleData.extension[extensionName]).to.exist;
  expect(this.sampleData.extensionOptions[extensionName]).to.exist;
  this.arc.addExtension(this.sampleData.extension[extensionName], this.sampleData.extensionOptions[extensionName]);
});

// TODO: Apply
Given(/^arc has (.*) extensions$/, function(count, done){
  const expectedNumerOfExtensions = Number(count);
  expect(this.arc).to.exist;
  expect(this.arc._extensions).to.exist;
  expect(this.arc._extensions.length).to.equal(count);
});

// TODO: Arc Voice, Narration
