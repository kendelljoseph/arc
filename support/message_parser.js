// # Arc | Support
// ### Message Parser
// - Parses incoming data from microservices sent via `process.send`
module.exports = ({paperboy}) => {
  return (microservices, {microservice, message}) => {
    // Arc detrmines if the microservice has a config file matching known microservices
    const matchingConfig = microservices.find(({title}) => {
      return title === microservice.title;
    });

    // #### Trigger Error, Work, and Job notifications
    
    // Arc will trigger a notification for work errors
    if(message && message.__error) {
      return paperboy.trigger(`@error`, JSON.stringify({title: microservice.title, metrics: message.__error, pid: process.pid}));
    }

    // Arc will trigger a notification for work metrics
    if(message && message.__metrics) {
      return paperboy.trigger(`@work`, JSON.stringify({title: microservice.title, metrics: message.__metrics, pid: process.pid}));
    }

    // Arc will trigger a notification for job metrics
    if(message && message.__job) {
      return paperboy.trigger(`@job`, JSON.stringify({title: microservice.title, metrics: message.__job, pid: process.pid}));
    }

    // #### Trigger Protocol Based Notification
    
    // Arc will not respond if the message is empty
    if(message.constructor === Object && Object.keys(message).length === 0) return;
    
    // Arc will convert the message to a `string` if it is not already
    const responseMessage = typeof message === `string` ? message : JSON.stringify(message);

    // Arc will trigger a notification with the message using the `protocol` if the microservice has a config that matches known microservices
    if(matchingConfig) {
      const { config } = matchingConfig;
      paperboy.trigger(`${config.protocol}${microservice.title}`, responseMessage);
    }

  };
};