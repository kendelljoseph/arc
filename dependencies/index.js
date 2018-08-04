// # Arc | Dependencies
// ### Arc needs on these modules to operate

// Arc loads these dependencies when it starts
module.exports = {
  // Arc uses [colors](https://github.com/marak/colors.js/)
  colors                 : require(`colors`),

  // Arc uses [dotenv](https://github.com/motdotla/dotenv)
  dotenv                 : require(`dotenv`),

  // Arc uses [generic-pool](https://github.com/coopernurse/node-pool)
  'generic-pool'         : require(`generic-pool`),

  // Arc uses [slugify](https://github.com/simov/slugify)
  slugify                : require(`slugify`),

  // Arc uses [tdigest](https://github.com/welch/tdigest)
  tdigest                : require(`tdigest`)
};