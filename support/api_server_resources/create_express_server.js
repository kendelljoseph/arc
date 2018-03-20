// # Arc | Api Server Resources
// ### Create Express Server
// - Arc creates an [Express](https://expressjs.com) server that can communicate with microservices over HTTP
// - The express server also shows `stats`, `stories` and microservice details

// Arc loads resources it needs to create and monitor an express server
const {
  express, http,
  'body-parser': bodyParser,
  'express-query-int': intParser,
  'express-query-date': dateParser,
  'express-query-boolean': booleanParser
} = require(`../../dependencies`);
const https = require(`https`);

// Arc loads the `package.json`
const packageJson             = require(`../../package.json`);

// Arc loads resources for API authentication
const authentication          = require(`./authentication`);

// Arc loads resources for microservice usage
const usageReporter           = require(`./usage_reporter`);

// Arc loads resources for microservice stats reporting
const getAllMicroserviceStats = require(`./get_all_microservice_stats`);
const getOneMicroserviceStats = require(`./get_one_microservice_stats`);

// Arc loads resources for communicating microservice data over HTTP
const getMicroserviceData     = require(`./get_microservice_data`);

// Arc loads resources for rendering HTML templates
const renderTemplate          = require(`./render_template`);

// #### Express Server
module.exports = ({ microservices, paperboy }, { port, apiRootPath }) => {
  return new Promise((resolve) => {
    // **Given** Arc creates an express app to manage API HTTP traffic
    const app    = new express();
    const server = http.createServer(app);

    // **When** Arc configures the express app to support API data
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(booleanParser());
    app.use(intParser());
    app.use(dateParser());
    
    // **Then** Arc will monitor the HTTP traffic
    app.use(usageReporter({paperboy, port}));
    
    // **And** Arc will authenticate HTTP traffic
    app.use(authentication);

    // #### API Routes
    
    // The API has a route to view microservice stats`
    app.get(`/view-stats/:microserviceTitleSlug`, (request, response) => {
      const { microserviceTitleSlug } = request.params;
      renderTemplate(`view-stats.html`, {slug: microserviceTitleSlug})
        .then((html) => {
          response.send(html);
        })
        .catch((error) => {
          response.send(error.message);
        });
    });
    
    // The API serves static files in the `/public` directory
    app.use(`/`, express.static(`${__dirname}/public`));
    
    // The API has a route to return user stories from [pivotal tracker](https://www.pivotaltracker.com)
    app.use(`/stories`, (request, response) => {
      const getStories = () => {
        const token     = process.env.ARC_PIVOTAL_TOKEN;
        const projectId = process.env.ARC_PIVOTAL_PROJECT;
        
        let path = `/services/v5/projects/${projectId}`;
        path += `/stories?filter=state:delivered,finished,rejected,started`;
        path += `,unstarted,unscheduled`;
        path += `&limit=20`;
        const options = {
          path,
          hostname: `www.pivotaltracker.com`,
          method: `GET`,
          headers: {
            'X-TrackerToken': token
          }
        };
        return new Promise((resolve, reject) => {
          https.get(options, (res) => {
            let data = ``;
    
            res.on(`data`, (chunk) => data += chunk);
            res.on(`end`, () => resolve(JSON.parse(data)));
    
          }).on(`error`, reject);
        });
      };
      
      const respond = (data) => {
        response.send(data);
      };
      
      getStories()
        .then(respond)
        .catch(respond);
    });
    
    // The API has a route to get `all` microservice stats
    app.get(`/stats`, getAllMicroserviceStats({microservices}));
    
    // The API has a route to get stats for a specific microservice
    app.get(`/stats/:microserviceTitleSlug`, getOneMicroserviceStats({microservices}));
    
    // The API has a route to **get data from a microservice**
    app.get(`${apiRootPath || ``}/:microservice/:path?`, getMicroserviceData({paperboy, microservices}));
    
    // The API has a route to show a `root` view
    app.get(`/`, (request, response) => {
      renderTemplate(`root.html`, {
        appName           : process.env.ARC_APP_NAME || `Arc`,
        githubRepo        : process.env.ARC_GITHUB_REPO || `/`,
        wiki              : process.env.ARC_GITHUB_WIKI || `/`,
        travisBadgeUrl    : process.env.ARC_TRAVIS_BADGE_URL,
        travisBadgeImg    : process.env.ARC_TRAVIS_BADGE_IMG_URL,
        ccBadgeUrl        : process.env.ARC_CODECLIMATE_BADGE_URL,
        ccBadgeImg        : process.env.ARC_CODECLIMATE_BADGE_IMG_URL,
        ccCoverageBadgeUrl: process.env.ARC_CODECLIMATE_COVERAGE_BADGE_URL,
        ccCoverageBadgeImg: process.env.ARC_CODECLIMATE_COVERAGE_BADGE_IMG_URL,
        pivotalToken      : process.env.ARC_PIVOTAL_TOKEN,
        pivotalProject    : process.env.ARC_PIVOTAL_PROJECT,
        packageInfo: {
          name   : packageJson.name,
          version: packageJson.version,
          url    : {
            milestones: `https://docs.google.com/spreadsheets/d/1ilqpRmQ3VusuBfarcAol6VfgkF3njrbA8DgKnZ4T19c/edit?usp=sharing`,
            bugs      : packageJson.bugs.url,
            homepage  : packageJson.homepage,
            wiki      : `https://github.com/altereagle/arc/wiki`,
          }
        }
      })
        .then((html) => {
          response.send(html);
        })
        .catch((error) => {
          response.send(error.message);
        });
      
    });
    
    // Arc returns the express app, the server, and the port
    resolve({app, server, port});
  });
};
