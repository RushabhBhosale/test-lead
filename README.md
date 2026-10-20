# Homestead

A simple Next.js app for property listings and lead management.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000.

## Production

```sh
npm run build
npm start
```

The Next.js backend saves leads in `data/leads.json`. The file is created when a lead is added or updated. Sample leads are shown before the first save. Property images load from Unsplash.

## API

- `GET /api/leads` returns all leads.
- `POST /api/leads` adds a lead with name, email, phone, status, and an optional property.
- `PUT /api/leads` updates a lead using its id and a status or property. An empty property clears the selection.

Status must be New, Contacted, or Converted. Contact fields and status are validated on the server. Email format is validated by the frontend; the server checks that email is provided and no longer than 120 characters.

Run this demo locally or on a single Node.js server with writable, persistent storage. JSON file storage is not suitable for serverless hosting or multiple server instances.
