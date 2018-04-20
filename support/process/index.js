// # Arc | Process
// ### Microservice Process
// - This process is forked when creating a microservice

// Arc sets the microservice process title
process.title = `@/unkown-microservice`;

// Arc loads fs
const fs = require(`fs`);

// Arc loads paperboy
const Paperboy = require(`paperboy-communicator`);
let paperboy;

// Arc can exits the microservice as cleanly as possible
const cleanExit = () => process.exit(0);

process.on(`SIGINT`, cleanExit);
process.on(`SIGTERM`, cleanExit);

// Arc monitors process metrics locally
let metrics = {
  job: {
    remaining: 0,
    round    : 0,
    sum      : 0
  },
  pid: process.pid
};

// Arc has a place to store the `work` and `settings` for the microservice process
let work     = null;
let settings = null;

// Arc can set the title and work for the microservice process
const setTitleAndWork = ([title, workName, resourceFolder]) => {
  process.title       = `@/${title}`;
  const workPath = `${process.cwd()}/${resourceFolder}/${workName}`;
  paperboy            = new Paperboy({connectionName: `${title}`});
  paperboy._cacheName = `@cache/${title}`;

  // Arc saves a reference to paperboy on the process
  process.paperboy = paperboy;

  try {
    fs.accessSync(workPath, fs.constants.R_OK | fs.constants.W_OK);
    work                = require(workPath);
    // - Arc notifies the master process that the title and work for this process is set
    process.send(`*setup://title/work/set`);
  } catch (err) {
    if(!workName || workName === `undefined`){
      console.error(`You need to define a resource to use for a microservice in ${process.cwd()}/${resourceFolder}`);
    } else {
      console.error(`${process.cwd()}/${resourceFolder} - does not contain the resource, ${workName}!`);
    }

    // - Arc sets default work for microservices without defined resources
    work = (data) => `You need to create a resource for this microservice here - ${process.cwd()}/${resourceFolder}`;

    // - Arc notifies the master process that the work for this process failed to set
    process.send(`*setup://title/work/set`);
  }
};

// Arc can set the settings for the microservice process
const setSettings = (data) => {
  settings = JSON.parse(data);
  // - Arc notifies the master process that the settings for this process is set
  process.send(`*setup://settings/set`);
};

// Arc can start a job for the microservice process
const startJob = (data) => {
  // Arc increments job metrics when a job is started
  metrics.job.remaining += 1;
  metrics.job.round     += 1;
  metrics.job.sum       += 1;

  return new Promise((resolve, reject) => {
    if(data) return resolve(data);
    reject(`No data sent to ${process.title}`);
  });
};

// Arc can do the job
const doJob = (data) => {
  // - Arc does the work using the data for the job
  return Promise.resolve(work(data));
};

// Arc can end the job
const endJob = (result, error) => {
  metrics.job.remaining -= 1;

  // - Arc caches the result
  const cache = typeof result != `string` ? JSON.stringify(result) : result;

  if(!cache) return;

  paperboy.push(`${paperboy._cacheName}`, cache)
    // - Arc notifies the master process when there is an error caching the result
    .catch((error) => {
      process.send({__error: {
        pid: process.pid,
        message: `microservice cache error`,
        error: error.message,
        data: cache
      }});
    });

  // - Arc sends the result or errors to the master process
  process.send(result || error);

  // - Arc sends the metrics to the master process
  process.send({__metrics: metrics});
  if(metrics.job.remaining === 0) {
    metrics.job.round = 0;
  }
};

// This process can get or set cached data
process.cache = (key, value) => {
  return new Promise((resolve, reject) => {
    // Arc checks if the key and the value exist
    const keyExists = (typeof key === `string`);
    const valueExists = (value != undefined);
    const setData = keyExists && valueExists;
    const getData = keyExists && !valueExists;

    // Arc sets the cache key
    const cacheKey = (setData || getData)
      ? `${paperboy._cacheName}/${key}`
      : paperboy._cacheName;

    // Arc caches the data using `Paperboy` if the cache method is used for saving data
    if(setData) {
      return paperboy.push(cacheKey, value)
        .then(() => {
          resolve(value);
        })
        .catch(reject);
    }

    // Arc gets cached data using `Paperboy` if the cache method is used for retrieving data
    return paperboy.pull(cacheKey)
      .then(resolve)
      .catch(reject);
  });
};
// Arc saves a record of remaining job and round counts
let remainingCounts = [];
let roundCounts     = [];

// Arc loads requirements for calculating percentiles
const calculatePercentile = require(`./calculate_percentile`);

// Arc can get the job medians
const getJobMedians = () => {
  return {
    remaining: calculatePercentile(remainingCounts),
    round    : calculatePercentile(roundCounts),
    pid      : process.pid
  };
};

// #### Process Message Handling
process.on(`message`, (job) => {
  // **Given** Arc sets the work this process will do
  if(!work) {
    const setupProtocol = `*setup://`;
    const setupOptions = job.split(setupProtocol);
    if (setupOptions[0] === ``) {
      const titleAndWork = setupOptions[1].split(`//`);
      return setTitleAndWork(titleAndWork);
    } else {
      return process.send(`${setupProtocol}need-work`);
    }
  }

  // **And** Arc sets the settings for this process
  if(!settings && typeof job === `string`) {
    const settingsProtocol = `*settings://`;
    const settingsOptions = job.split(settingsProtocol);
    if (settingsOptions[0] === ``) {
      const jobSettings = settingsOptions[1].split(`/`);
      setSettings(jobSettings);
      return;
    }
  }

  // **And** Arc will skip doing work if there is no work to do
  if(!work) return;

  // **When** the process notifies the master process that the it is starting the job
  remainingCounts.push(metrics.job.remaining);
  roundCounts.push(metrics.job.round);
  process.send({
    __job: {
      remaining: metrics.job.remaining
      // TODO: Optimize for scale
      //median   : getJobMedians()
    }
  });

  void async function() {
    try {
      // **And** the process starts the job
      const incoming = await startJob(job);

      // **Then** the process does the work
      let result = await doJob({incoming, settings});

      // **And** the process ends the job
      endJob(result);

      // **And** the process notifies the master process when the job is done
      process.send({
        __job: {
          remaining: metrics.job.remaining
          // TODO: Optimize for scale
          //median   : getJobMedians()
        }
      });
    } catch (error) {
      // **But** the process ends the job sending the errors when they are caught
      endJob(null, error);
    }
  }();
});