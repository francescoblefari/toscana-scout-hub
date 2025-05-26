# AGESCI Toscana Backend

This backend server provides APIs for the AGESCI Toscana application, managing scout camps, news articles, documents, and user authentication.

## Prerequisites

*   Node.js (v14.x or newer recommended)
*   MongoDB (ensure a MongoDB server instance is running and accessible)

## Setup and Installation

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Configuration

The backend uses the following environment variables:

*   `PORT`: The port on which the server will listen. Defaults to `3001`.
*   `MONGODB_URI`: The MongoDB connection string.
    *   Defaults to `mongodb://localhost:27017/agesci_toscana`.
    *   You can set this in your environment or create a `.env` file in the `backend` directory (ensure `.env` is in `.gitignore` if you create it):
        ```
        MONGODB_URI=your_mongodb_connection_string
        PORT=your_preferred_port
        ```
    *(Note: `.env` file handling is not explicitly implemented in the current server setup; this is a general Node.js practice. For now, setting them in the shell environment is the primary way.)*


## Running the Application

1.  **Run the data migration script (usually once):**
    This script populates the MongoDB database with any initial data from the project's JSON files.
    ```bash
    npm run migrate
    ```

2.  **Start the server:**
    ```bash
    npm start
    ```
    The server will typically run on `http://localhost:3001` (or your configured port).

## API Endpoints

The API base URL is `/api`.

### Authentication (`/api/auth`)

*   **`POST /register`**
    *   Description: Registers a new user.
    *   Request Body: `{ "email": "user@example.com", "password": "yourpassword", "role": "user" }` (`role` is optional, defaults to 'user')
    *   Response: `{ "message": "User registered successfully", "token": "...", "user": { ... } }`
*   **`POST /login`**
    *   Description: Logs in an existing user.
    *   Request Body: `{ "email": "user@example.com", "password": "yourpassword" }`
    *   Response: `{ "message": "Login successful", "token": "...", "user": { ... } }`

### Scout Camps (`/api/camps`)

*   **`GET /`**
    *   Description: Get all approved scout camps.
*   **`GET /all`** (Admin only)
    *   Description: Get all scout camps, regardless of status.
    *   Requires Admin Token.
*   **`GET /:id`**
    *   Description: Get a specific scout camp by its ID.
*   **`POST /`**
    *   Description: Propose a new scout camp. Data submitted will be set to 'pending' status.
    *   Request Body: Camp object (see Camp model). Example: `{ "name": "...", "description": "...", ... }`
    *   Requires Auth Token (any authenticated user can propose).
*   **`PUT /:id`** (Admin only)
    *   Description: Update an existing scout camp.
    *   Request Body: Fields to update.
    *   Requires Admin Token.
*   **`DELETE /:id`** (Admin only)
    *   Description: Delete a scout camp.
    *   Requires Admin Token.
*   **`PUT /:id/approve`** (Admin only)
    *   Description: Approve a pending scout camp.
    *   Requires Admin Token.
*   **`PUT /:id/reject`** (Admin only)
    *   Description: Reject a pending scout camp.
    *   Requires Admin Token.

### News Articles (`/api/news`)

*   **`GET /`**
    *   Description: Get all news articles.
*   **`GET /:id`**
    *   Description: Get a specific news article by ID.
*   **`POST /`** (Admin only)
    *   Description: Create a new news article.
    *   Request Body: News article object.
    *   Requires Admin Token.
*   **`PUT /:id`** (Admin only)
    *   Description: Update an existing news article.
    *   Request Body: Fields to update.
    *   Requires Admin Token.
*   **`DELETE /:id`** (Admin only)
    *   Description: Delete a news article.
    *   Requires Admin Token.

### Documents (`/api/documents`)

*   **`GET /`**
    *   Description: Get a list of all document metadata.
*   **`POST /`** (Admin only)
    *   Description: Upload a new document. Expects `multipart/form-data` with a `documentFile` field (the file) and a `title` field.
    *   Requires Admin Token.
*   **`GET /:id/download`**
    *   Description: Download a specific document file.
*   **`DELETE /:id`** (Admin only)
    *   Description: Delete a document (both metadata and the physical file).
    *   Requires Admin Token.

## Authentication & Authorization

*   Most `POST`, `PUT`, `DELETE` endpoints, especially those for admin actions, require an authentication token.
*   The token should be passed in the `Authorization` header as a Bearer token: `Authorization: Bearer your_token_here`.
*   Admin-only routes will return a 403 Forbidden error if a non-admin token (or no token) is provided.
*   The current token is a placeholder (`fake-token-for-{userId}-{userRole}`).

## Data Models (Mongoose Schemas)

*   **User**: `email`, `password` (hashed), `role` (`admin`, `editor`, `user`), `timestamps`.
*   **Camp**: `name`, `description`, `address`, `city`, `province`, `contact` (nested: `phone`, `email`, `responsible`), `capacity`, `services` (array), `status` (`approved`, `pending`, `rejected`), `images` (array of URLs), `addedBy` (string), `addedDate`, `timestamps`.
*   **NewsArticle**: `title`, `content`, `excerpt`, `author`, `date`, `categories` (array), `timestamps`.
*   **Document**: `title`, `filename` (server-side), `originalname`, `mimetype`, `size`, `uploadDate`, `timestamps`.

```
