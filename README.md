# Task Manager Frontend

React frontend for the Task Manager application, built with Vite and styled with Tailwind CSS.

## Features

- Create an account, log in, and log out
- Create and delete tasks, and mark pending tasks as completed
- Filter tasks by status and navigate paginated results
- Keep the login token in browser local storage

## Requirements

- Node.js and npm
- The Task Manager API running locally or at a reachable URL


## Setup

From this directory, install the dependencies:

```bash
npm install
```

The frontend uses `http://localhost:5000` as the API URL by default. To use a different API URL, create a `.env` file in this directory:

```env
VITE_API_URL=http://localhost:5000
```

Restart the Vite development server after changing environment variables.

## Development

Start the development server:

```bash
npm run dev
```

Vite prints the local URL in the terminal; the default is `http://localhost:5173`.

## Production

Create an optimized production build:

```bash
npm run build
```

To serve the production build locally for a preview:

```bash
npm run preview
```

## Available scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite development server    |
| `npm run build`   | Build the frontend into `dist/`      |
| `npm run preview` | Preview the production build locally |
