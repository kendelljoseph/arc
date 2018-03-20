Feature: The system has environmental variables set it depends on to do things

  In order to insure that the systems services will run
  The system should check if environmental variables are set

  Scenario: The system needs local environmental variables in order to run
    Given a system has an environmental variable set called ARC_APP_NAME
      And a system has an environmental variable set called ARC_API_KEY
      And a system has an environmental variable set called ARC_NEO4J
      And a system has an environmental variable set called ARC_MONGODB
      And a system has an environmental variable set called ARC_POSTGRES
      And a system has an environmental variable set called ARC_PIVOTAL_TOKEN
      And a system has an environmental variable set called ARC_PIVOTAL_PROJECT
      And a system has an environmental variable set called ARC_GITHUB_REPO
      And a system has an environmental variable set called ARC_GITHUB_WIKI
      And a system has an environmental variable set called ARC_TRAVIS_BADGE_URL
      And a system has an environmental variable set called ARC_TRAVIS_BADGE_IMG_URL
      And a system has an environmental variable set called ARC_CODECLIMATE_BADGE_URL
      And a system has an environmental variable set called ARC_CODECLIMATE_BADGE_IMG_URL
      And a system has an environmental variable set called ARC_CODECLIMATE_COVERAGE_BADGE_URL
      And a system has an environmental variable set called ARC_CODECLIMATE_COVERAGE_BADGE_IMG_URL
      And a system has an environmental variable set called CC_TEST_REPORTER_ID