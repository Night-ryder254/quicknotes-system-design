# QuickNotes Data Model

## Entities and Relationships
- **users:** Stores account information. One user can have many notes (1:N).
- **notes:** Stores the actual text content. Belongs to one user.
- **tags:** Stores unique categorization labels.
- **note_tags:** A junction table enabling a many-to-many (N:M) relationship between notes and tags.

## SQL vs NoSQL Justification
We chose **SQL (PostgreSQL)** because note-taking applications benefit from strong relational integrity (ACID properties). A user's notes and tags require frequent JOIN operations (e.g., "get all notes with tag 'work'"). The schema is well-defined and highly structured, which SQL handles perfectly.

## Schema Definition (CREATE TABLE)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE note_tags (
    note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (note_id, tag_id)
);
Indexes
SQL
-- Index on user_id to speed up the most common query: fetching a user's notes.
CREATE INDEX idx_notes_user_id ON notes(user_id);
Example Queries
1. Insert a new note:

SQL
INSERT INTO notes (user_id, title, body) 
VALUES ('123-uuid', 'Project Ideas', 'Build a real-time chat app.');
2. Delete a note:

SQL
DELETE FROM notes WHERE id = '456-uuid' AND user_id = '123-uuid';
3. Fetch a user's notes with tags (JOIN):

SQL
SELECT n.title, t.name as tag_name 
FROM notes n
LEFT JOIN note_tags nt ON n.id = nt.note_id
LEFT JOIN tags t ON nt.tag_id = t.id
WHERE n.user_id = '123-uuid';