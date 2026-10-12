# QuickNotes API Design

## REST Endpoints

| Method | Path | Description | Success Status |
|---|---|---|---|
| POST | `/api/v1/users` | Register a new user | 201 Created |
| GET | `/api/v1/notes` | List all notes for the authenticated user | 200 OK |
| POST | `/api/v1/notes` | Create a new note | 201 Created |
| GET | `/api/v1/notes/{id}` | Retrieve a specific note by ID | 200 OK |
| PUT | `/api/v1/notes/{id}` | Update an existing note | 200 OK |
| DELETE | `/api/v1/notes/{id}` | Delete a note | 204 No Content |

## Request / Response Examples

### List Notes (GET `/api/v1/notes`)
**Response (200 OK)**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Meeting notes",
      "body": "Discussed API architecture.",
      "created_at": "2026-10-12T10:00:00Z"
    }
  ],
  "meta": { "total": 1, "page": 1 }
}
Create Note (POST /api/v1/notes)
Request

JSON
{
  "title": "Shopping List",
  "body": "Milk, Eggs, Bread"
}
Response (201 Created)

JSON
{
  "id": 2,
  "title": "Shopping List",
  "body": "Milk, Eggs, Bread",
  "created_at": "2026-10-12T10:05:00Z"
}
Error Handling
The API uses standard HTTP status codes:

400 Bad Request: Invalid input (e.g., title missing).

401 Unauthorized: Missing or invalid authentication token.

403 Forbidden: Attempting to access another user's note.

404 Not Found: Note ID does not exist.

500 Internal Server Error: Unexpected backend failure.

Example Error Body (400 Bad Request):

JSON
{
  "error": {
    "code": 400,
    "message": "Validation failed",
    "details": ["Title is required and must be under 100 characters"]
  }
}