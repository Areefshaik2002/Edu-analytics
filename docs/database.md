# Database Design: EduMetrics Platform

This document describes the schema structure, PostgreSQL relationships, and integrity rules used in the database.

---

## 1. Entity Relationship Diagram

```
+---------------+             +------------------+
|   students    |             |     subjects     |
+---------------+             +------------------+
| id (PK)       |             | id (PK)          |
| name          |             | subject_name (U) |
| age           |             +------------------+
| current_class |                      |
| created_at    |                      |
| updated_at    |                      |
+---------------+                      |
       |                               |
       | 1                             | 1
       |                               |
       | Has Many                      | Has Many
       |                               |
       |           +-------+-----------+
       |           |       |
       v           v       v
     +-----------------------+
     |         marks         |
     +-----------------------+
     | id (PK)               |
     | student_id (FK)       |
     | subject_id (FK)       |
     | month_id (FK)         |
     | marks (Float)         |
     +-----------------------+
       ^
       | Belongs To (Many to 1)
       |
       | 1
+---------------+
|    months     |
+---------------+
| id (PK)       |
| month_name (U)|
+---------------+
```

---

## 2. Table Specifications

### `students`
Tracks student identification and class placement.
*   `id`: `SERIAL PRIMARY KEY`
*   `name`: `VARCHAR(255) NOT NULL`
*   `age`: `INTEGER NOT NULL`
*   `current_class`: `VARCHAR(50) NOT NULL`
*   `created_at`: `TIMESTAMP DEFAULT NOW()`
*   `updated_at`: `TIMESTAMP NOT NULL`

### `subjects`
Dynamic list of academic subjects.
*   `id`: `SERIAL PRIMARY KEY`
*   `subject_name`: `VARCHAR(100) UNIQUE NOT NULL` (e.g. `Telugu`, `Hindi`, `English`, `Social Studies`)

### `months`
Pre-defined academic month timeline.
*   `id`: `SERIAL PRIMARY KEY`
*   `month_name`: `VARCHAR(50) UNIQUE NOT NULL` (e.g. `January` through `June`)

### `marks`
Junction table tracking score performance for each student per subject per month.
*   `id`: `SERIAL PRIMARY KEY`
*   `student_id`: `INTEGER REFERENCES students(id) ON DELETE CASCADE`
*   `subject_id`: `INTEGER REFERENCES subjects(id) ON DELETE RESTRICT`
*   `month_id`: `INTEGER REFERENCES months(id) ON DELETE RESTRICT`
*   `marks`: `DOUBLE PRECISION NOT NULL` (ranges `0.0` - `100.0`)
*   **Unique Index:** Unique composite key on `[student_id, subject_id, month_id]` to enforce one score per student/subject/month.

---

## 3. Database Integrity & Cascade Operations
*   **Cascade Delete:** When a student is deleted, all matching performance score records in the `marks` table are cleaned up immediately via database-level `ON DELETE CASCADE`.
*   **Restrict Delete:** To prevent data loss, deletion of `subjects` or `months` that are referenced in `marks` is blocked via `ON DELETE RESTRICT`.
