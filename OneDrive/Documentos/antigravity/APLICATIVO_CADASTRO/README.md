# Client Registration Application

A simple full-stack web application for managing client registrations.

## Stack
- **Frontend**: React (Vite)
- **Backend**: Node.js (Express)
- **Database**: PostgreSQL

## Prerequisites
- Node.js (v14+)
- PostgreSQL

## Setup

1.  **Database**:
    Create a PostgreSQL database (e.g., `cadastro_clientes`).
    Update `server/.env` with your connection string:
    ```
    DATABASE_URL=postgres://user:password@localhost:5432/cadastro_clientes
    ```

2.  **Install Dependencies**:
    ```bash
    # Backend
    cd server
    npm install

    # Frontend
    cd client
    npm install
    ```

## Running the Application

1.  **Start Backend**:
    ```bash
    cd server
    npm run dev
    ```
    The server runs on `http://localhost:3000`.

2.  **Start Frontend**:
    ```bash
    cd client
    npm run dev
    ```
    The application runs on `http://localhost:5173`.

## Testing

- **Backend**: `cd server && npm test`
- **Frontend**: `cd client && npm test`
