# API Specifications: EduMetrics Platform

This document describes the REST API endpoints and data payloads supported by the Express backend.

---

## Base URL
`http://localhost:5001/api`

---

## 1. Authentication Endpoints

### Login
Authenticates admin credentials and returns a 24-hour JWT token.

*   **URL:** `/auth/login`
*   **Method:** `POST`
*   **Headers:** `Content-Type: application/json`
*   **Request Body:**
    ```json
    {
      "username": "admin",
      "password": "password123"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "token": "jwt-token-string"
    }
    ```
*   **Error Response (401 Unauthorized):**
    ```json
    {
      "status": "error",
      "statusCode": 401,
      "message": "Invalid username or password"
    }
    ```

---

## 2. Student CRUD & Search Endpoints

All student endpoints require `Authorization: Bearer <token>` in request headers.

### List & Fuzzy Search Students
Returns a paginated list of students with calculated averages. Supports fuzzy search on names.

*   **URL:** `/students`
*   **Method:** `GET`
*   **Query Parameters:**
    *   `page` (optional, default: `1`): The target page index.
    *   `limit` (optional, default: `10`): Number of records per page.
    *   `search` (optional): Name search query (fuzzy matching via Fuse.js).
*   **Success Response (200 OK):**
    ```json
    {
      "students": [
        {
          "id": 1,
          "name": "Arjun Kumar",
          "age": 15,
          "currentClass": "10-A",
          "teluguAverage": 88.3,
          "hindiAverage": 92.1,
          "englishAverage": 85.0,
          "socialStudiesAverage": 90.2
        }
      ],
      "total": 124,
      "page": 1,
      "totalPages": 13
    }
    ```

### Get Student Detail
Returns a single student record with their complete 4x6 subject-month marks grid.

*   **URL:** `/students/:id`
*   **Method:** `GET`
*   **Success Response (200 OK):**
    ```json
    {
      "id": 1,
      "name": "Arjun Kumar",
      "age": 15,
      "currentClass": "10-A",
      "marks": {
        "Telugu": { "January": 80, "February": 85, "March": 90, "April": 88, "May": 92, "June": 95 },
        "Hindi": { "January": 70, "February": 75, "March": 80, "April": 85, "May": 88, "June": 90 },
        "English": { "January": 85, "February": 87, "March": 88, "April": 90, "May": 92, "June": 94 },
        "Social Studies": { "January": 90, "February": 91, "March": 93, "April": 92, "May": 95, "June": 98 }
      }
    }
    ```

### Register Student
Creates a new student and sets up their initial marks grid.

*   **URL:** `/students`
*   **Method:** `POST`
*   **Request Body:**
    ```json
    {
      "name": "Aarav Sharma",
      "age": 14,
      "currentClass": "9-A",
      "marks": {
        "Telugu": { "January": 85, "February": 88, "March": 82, "April": 90, "May": 87, "June": 92 },
        "Hindi": { "January": 78, "February": 80, "March": 75, "April": 82, "May": 84, "June": 79 },
        "English": { "January": 92, "February": 94, "March": 91, "April": 95, "May": 93, "June": 96 },
        "Social Studies": { "January": 88, "February": 85, "March": 89, "April": 87, "May": 90, "June": 91 }
      }
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "id": 101,
      "name": "Aarav Sharma",
      "age": 14,
      "currentClass": "9-A",
      "createdAt": "2026-06-23T17:28:42.000Z",
      "updatedAt": "2026-06-23T17:28:42.000Z"
    }
    ```

### Update Student Record
Modifies student details and updates their monthly academic marks.

*   **URL:** `/students/:id`
*   **Method:** `PUT`
*   **Request Body:** Same schema as Register Student.
*   **Success Response (200 OK):**
    ```json
    {
      "id": 101,
      "name": "Aarav Sharma Updated",
      "age": 15,
      "currentClass": "10-A",
      "createdAt": "2026-06-23T17:28:42.000Z",
      "updatedAt": "2026-06-23T17:32:00.000Z"
    }
    ```

### Delete Student
Deletes the student. Cascade rules clean up associated marks.

*   **URL:** `/students/:id`
*   **Method:** `DELETE`
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Student deleted successfully"
    }
    ```

---

## 3. Analytics Endpoints

### Get Student Performance Trends
Returns monthly score arrays for Telugu, Hindi, English, and Social Studies.

*   **URL:** `/students/:id/analytics`
*   **Method:** `GET`
*   **Success Response (200 OK):**
    ```json
    {
      "student": {
        "id": 1,
        "name": "Arjun Kumar",
        "age": 15,
        "currentClass": "10-A"
      },
      "analytics": {
        "telugu": [80, 85, 90, 88, 92, 95],
        "hindi": [70, 75, 80, 85, 88, 90],
        "english": [85, 87, 88, 90, 92, 94],
        "socialStudies": [90, 91, 93, 92, 95, 98]
      }
    }
    ```
