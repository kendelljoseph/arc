// # Arc | Dependencies
// ### Arc needs on these modules to operate

// Arc loads these dependencies when it starts
module.exports = {
  // Arc uses [colors](https://github.com/marak/colors.js/)
  colors                 : require(`colors`),
  
  // Arc uses [mustache](https://github.com/janl/mustache.js)
  mustache               : require(`mustache`),
  
  // Arc uses [dotenv](https://github.com/motdotla/dotenv)
  dotenv                 : require(`dotenv`),
  
  // Arc uses [generic-pool](https://github.com/coopernurse/node-pool)
  'generic-pool'         : require(`generic-pool`),
  
  // Arc uses [slug](https://github.com/dodo/node-slug)
  slug                   : require(`slug`),
  
  // Arc uses [tdigest](https://github.com/welch/tdigest)
  tdigest                : require(`tdigest`),
  
  // Arc uses [express](https://expressjs.com/)
  express                : require(`express`),
  
  // Arc uses [morgan](https://github.com/expressjs/morgan)
  morgan                 : require(`morgan`),
  
  // Arc uses [http](https://nodejs.org/api/http.html) _(native module)_
  http                   : require(`http`),
  
  // Arc uses [body-parser](https://github.com/expressjs/body-parser)
  'body-parser'          : require(`body-parser`),
  
  // Arc uses [express-query-boolean](https://github.com/mariusc23/express-query-boolean)
  'express-query-boolean': require(`express-query-boolean`),
  
  // Arc uses [express-query-int](https://github.com/mariusc23/express-query-int)
  'express-query-int'    : require(`express-query-int`),
  
  // Arc uses [express-query-date](https://github.com/mariusc23/express-query-date)
  'express-query-date'   : require(`express-query-date`),
  
  // Arc uses [user-agent-parser](https://www.npmjs.com/package/ua-parser-js)
  'user-agent-parser'    : require(`user-agent-parser`)
};