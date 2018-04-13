/*eslint no-unused-vars: [0] no-console: ["error", { allow: ["info", "error"] }] */
// # Arc Monitor
// ### Monitor Arc activitiy

// Arc monitor loads dependencies
const {colors} = require(`../dependencies`);

// Arc monitor loads support modules
const Paperboy = require(`paperboy-communicator`);
const paperboy = new Paperboy({connectionName: `monitor`});

// Arc monitor can parse incoming data
const parseData = (data) => JSON.parse(data);

module.exports = ({paperboy}) => {
  // Arc monitor listens to work metrics
  paperboy.on(`@work`, (data) => {
    const {title, metrics} = parseData(data);
    console.info(`@work/${title}`.bold.cyan, metrics);
  });

  // Arc monitor listens to errors
  paperboy.on(`@error`, (data) => {
    const {title, metrics} = parseData(data);
    console.info(`@error/${title}`.bold.red, metrics);
  });

  // Arc monitor listens to health metrics
  paperboy.on(`@health`, (data) => {
    const {title, metrics} = parseData(data);
    console.info(`@health/${title}`.green, metrics);
  });

  // Arc monitor listens to messages
  process.on(`message`, ({title, pid}) => {
    console.info(`@monitor/${title}/${pid}`.bold.blue);
    process.send(true);
  });
};