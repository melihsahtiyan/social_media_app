# Backend Architecture

- Status: accepted
- Deciders: Melih Sahtiyan
- Date: [2024-01-16 when the decision was last updated] <!-- optional. To customize the ordering without relying on Git creation dates and filenames -->
- Tags: [space and/or comma separated list of tags] <!-- optional -->

Technical Story: To start a new project, we needed an initial project architecture that satisfies the first needs of the project. For these reasons, we have chosen monolithic architecture. <!-- optional -->

## Context and Problem Statement

The aim of the monolithic architecture is, it's so simple that one developer can handle easily. For the further development of the project, we can easily add new features and functionalities. And also we can easily deploy the project to the server. If we need to change the architecture to microservices, we can easily do it.

## Decision Drivers <!-- optional -->

- It's easy to develop
- It's easy to deploy
- It's easy to change the architecture

## Considered Options

- Microservices
- Monolithic

## Decision Outcome

Chosen option: "[option 1]", because [justification. e.g., only option, which meets k.o. criterion decision driver | which resolves force force | … | comes out best (see below)].

### Positive Consequences

- [e.g., improvement of quality attribute satisfaction, follow-up decisions required, …]
- …

### Negative Consequences

- [e.g., compromising quality attribute, follow-up decisions required, …]
- …

## Pros and Cons of the Options 


### Monolithic

[example | description | pointer to more information | …]

- Good, because it's easy to develop. We can build whole system into one application.
- Good, because it's easy to deploy. We can deploy whole system into one server including database.
- Bad, because it will get harder to maintain the project when it gets bigger.

### Microservices

[example | description | pointer to more information | …]

- Good, because it's easy to maintain the project when it gets bigger.
- Good, because it seperates the project into small pieces.
- Good, because it's easy to deploy. We can deploy each microservice into different servers.
- Good, because it's easy to manage the project. We can easily monitor the project with different metrics.
- Bad, because it's hard to develop. We need to build seperate applications for each microservice.
- Bad, because it's too complex. We need to manage each microservice separately.
