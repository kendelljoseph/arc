/*eslint no-unused-vars: [0]*/

// Dependencies
// ------------
const chai     = require(`chai`);
const should   = chai.should();
const expect   = chai.expect;
const { defineSupportCode: cucumber } = require(`cucumber`);

cucumber(({Given, Then}) => {
  // Arc
  // --------
  Given(/^arc is ready$/, function(done){
    const arc = require(`../../index.js`);
    expect(arc).to.exist;
    expect(arc).to.be.a(`function`);
    this.arc = arc;
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
});