// # Arc | Api Server Resources
// ### Authenticate Requests
// - Arc can authenticate requests sent to the API server

// Arc adds `.env` variables to the process
require(`dotenv`).config();

// Arc checks the request `headers` and responds when the API key is not authorized
module.exports = ({headers}, response, next) => {
  // Arc gets the API key from the header of the request
  const apiKey = headers[`arc-api-key`];
  
  // Arc checks if the API key matches the api key set in the `.env` file
  const arcApiKey    = process.env.ARC_API_KEY;
  const validRequest = apiKey === arcApiKey;
  
  // Arc **skips authentication** if there is no API key set in the `.env` file
  if(!arcApiKey) return next();
  
  // Arc rejects requests that do not have a valid API key
  if(!validRequest) {
    response.status(403);
    return response.json({error: `unauthorized api key`});
  }
};