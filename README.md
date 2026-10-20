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

## Lead storage

Leads are saved in browser localStorage under `homestead-leads`. Sample leads are saved only when this key is missing on the first visit. Adding leads and changing their status or assigned property persists after refresh. An empty saved list stays empty.

Storage is read after the page mounts to avoid hydration errors. Invalid JSON or invalid lead records are reset to an empty list with a message. Missing optional properties are supported. If storage is blocked or full, the app continues for the current session and shows that changes could not be saved.

Data belongs to this browser profile and website origin. It is not shared between users, browsers, devices, or deployment URLs. Clearing browser data removes leads and starts a new first visit. Private browsing may discard data when the session ends. Multiple open tabs do not sync automatically. Browser storage is not a secure database or a backup for sensitive contact information.

No API, database, or server filesystem is used for leads, so this demo can run on Vercel. Existing server-side JSON leads are not migrated automatically. Property images load from Unsplash.

