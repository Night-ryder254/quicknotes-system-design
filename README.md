# QuickNotes API Client & Architecture

## Description
QuickNotes is a full-stack engineering project demonstrating a front-end API client communicating with RESTful endpoints, paired with backend system design documents outlining how to scale the service for 1 million users.

## How to Run the API Client
1. Clone this repository to your local machine.
2. Open `index.html` directly in your web browser (no local server required since it uses the public JSONPlaceholder API).
3. Use the interface to Load, Create, and Delete notes.

## Design Documents
- [API Design](docs/api-design.md)
- [Data Model](docs/data-model.md)
- [Architecture](docs/architecture.md)

## What I Learned
1. **DOM Manipulation & State Management:** I learned how to manage loading, success, and error states dynamically while disabling UI inputs to prevent duplicate submissions.
2. **System Design Fundamentals:** Designing for 1 million users required understanding load estimation math and how caching/read replicas mitigate database bottlenecks.
3. **API Contract Design:** Writing a proper RESTful API design document highlighted the importance of standardizing HTTP methods and status codes for backend teams.