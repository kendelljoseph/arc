Feature: Arc

  Scenario: A system wants to use arc to manage microservices
    Given arc is ready
      And arc has a property called _extensions
      And arc has a property called addExtension
      And arc has a property called shutdownMicroservices
      And arc has a property called _steps
    Given arc has a step called checkManifest
      And arc has a step called parseMessage
      And arc has a step called workerPool
      And arc has a step called createMicroservices
      And arc has a step called setMicroserviceEvents
      # TODO: Test if the steps actually return what they should