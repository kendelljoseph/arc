// Sample service for testing
// --------------------------
module.exports = ({settings = {}, incoming = {}}) => {
  const {protocol, path, data} = incoming;

  const pathRelatedThings = {
    'get/protocol': () => {
      return protocol;
    },
    'get/path': () => {
      return path;
    },
    'get/settings': () => {
      return settings;
    },
    'async/situation': () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(data), Math.ceil(Math.random() * 1000));
      });
    },
    'process/send': () => {
      process.send(data);
    },
    'cache/custom/set': () => {
      return process.cache(`custom`, data);
    },
    'cache/custom/get': () => {
      return process.cache(`custom`);
    }
  };

  // Do path related things
  // ----------------------
  if(path != null) return pathRelatedThings[path]();

  return data;
};