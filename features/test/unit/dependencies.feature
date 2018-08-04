Feature: Arc Dependencies

  In order to insure that arc will run
  Check if dependencies are installed

  Scenario: Arc needs to use a resource that should be installed using NPM
    Given arc has dependencies
    Then arc has the dependency colors installed
      And arc has the dependency dotenv installed
      And arc has the dependency generic-pool installed
      And arc has the dependency slugify installed
      And arc has the dependency tdigest installed
      And arc has the development dependency chai included in the package
      And arc has the development dependency cucumber included in the package
      And arc has the development dependency mocha included in the package
      And arc has the development dependency nodemon included in the package
      And arc has the development dependency nyc included in the package