Feature: Arc

  Scenario: A system wants to use arc to manage microservices
    Given arc is ready
      And arc has a step called checkConfig
      And arc has a step called parseMessage
      And arc has a step called workerPool
      And arc has a step called createMicroservices
      And arc has a step called setProtocolEvents
      # TODO: Test if the steps actually return what they should