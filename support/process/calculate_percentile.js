// # Arc | Process
// ### Calculates percentiles

// Arc loads requirements for calculating percentiles
const { TDigest } = require(`tdigest`);

// Arc can calculate percentiles using an array
module.exports = (values = [], percentile = 0.5, significantFigures = 0) => {
  // **Given** Arc creates a percentile calculator
  const calculator  = new TDigest();
  
  // **When** Arc adds the values to calculate to the calculator
  calculator.push(values);
  
  // **And** Arc compresses and summarizes the percentile data
  calculator.compress();
  calculator.summary();
  
  // **Then** Arc returns the percentile for the calculated data
  return calculator.percentile(percentile).toFixed(significantFigures);
};