// # Arc | Api Server Resources
// ### Render a template

// Arc loads resources for retrieving and rendering templates
const { mustache } = require(`../../dependencies`);
const { readFile } = require(`fs`);

// Arc can render a template using [mustache](https://github.com/janl/mustache.js)
module.exports = (template, data = {}) => {
  // Arc can get file data to render from the `templates` folder
  const getFileData = () => {
    return new Promise((resolve, reject) => {
      readFile(`${__dirname}/templates/${template}`, (error, file) => {
        if (error) return reject(error);
        resolve(file.toString());
      });
    });
  };

  // Arc can render a template using mustache and an object
  const renderTemplate = (rawTemplate) => {
    return Promise.resolve(mustache.render(rawTemplate, data));
  };
  
  // **Given** Arc gets the file data to use as a template
  return getFileData()
    // **Then** Arc returns the rendered template
    .then(renderTemplate);
};