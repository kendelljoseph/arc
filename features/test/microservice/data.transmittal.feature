Feature: Microservices

  Scenario: A system has a microservice
    Given arc is ready
      And a system is using a microservice manifest named Test Microservice
      And paperboy is ready
    When a system loads microservices using arc
      And paperboy listens to Test Microservice and sends test data to the root protocol
      And paperboy listens to Test Microservice and sends test protocol data to the path get/protocol
      And paperboy listens to Test Microservice and sends test path data to the path get/path
      And paperboy listens to Test Microservice and sends test settings data to the path get/settings
      And paperboy listens to Test Microservice and sends test data to the path async/situation
      And paperboy listens to Test Microservice and sends test data to the path process/send
      And paperboy listens to Test Microservice and sends test data to the path cache/custom/set
      And paperboy listens to Test Microservice and sends test data to the path cache/custom/get
      # TODO: Test the response for these (the step defintions are alreay written)
    Then arc shuts down microservices