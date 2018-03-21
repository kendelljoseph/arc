// # Arc | Support
// ### Shutdown microservices
// - Arc can shutdown microservice processes

// Arc requires a paperboy instance to shutdown microservices
module.exports = ({paperboy}) => {
  // Arc rejects shutdown requests without a paperboy instance
  if (!paperboy) throw Error(`Microservices shutdown requires paperboy!`);

  return (microservices) => {
    return new Promise((allResolved, rejectFailure) => {
      // Arc rejects shutdown requests when there are no microservices to shut down
      if(!microservices.length) return rejectFailure(new Error(`Arc has no microservices to shut down!`));
      
      const promises = microservices.map(({config, pool}) => {
        return new Promise((resolve, reject) => {
          const count        = config.count;
          let totalDestroyed = 0;

          // **Given** Arc can run a recursive process death until all are destroyed -- **Muahahaha!**
          const destroyNext = () => {
            if(totalDestroyed === count) return;
            pool.acquire()
              .then((microservice) => {
                return pool.destroy(microservice);
              })
              .then(() => {
                totalDestroyed++;
                if(totalDestroyed === count) return resolve();
                destroyNext();
              })
              .catch(reject);
          };

          // **Then** Arc starts destroying microservices
          destroyNext();
        });
      });

      return Promise.all(promises)
        .then(() => {
          // Arc triggers a health notification indicating microservices have been shut down
          paperboy.trigger(`@health`, JSON.stringify({
            title: process.pid,
            metrics: {
              shutdownMicroservices: true
            }, pid: process.pid}));
        })
        .then(allResolved)
        .catch(rejectFailure);
    });
  };
};