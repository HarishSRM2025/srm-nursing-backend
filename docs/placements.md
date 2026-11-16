# Placements

`GET /api/placements` returns `{ "success": true, "data": { "batches": [], "stats": [], "internationalPlacements": [], "destinations": [], "partners": [] } }` populated from the MongoDB `placements` collection.

Returns 404 when the page document has not been seeded and 500 on a database error. Reads never insert or change records.

Run `npm run seed:placements` from the backend directory using the configured `DBURL` (or `MONGODB_URI`). The seed inserts the existing website content from `data/placements.json` only if the page document is missing. Repeated runs preserve existing database content.

The frontend uses `VITE_BACKEND_API_URL`, then `VITE_API_URL`, then `http://localhost:5000`. It includes loading, retry, and empty states.

The migrated content preserves the original published figures. The first two batch totals differ from the sums of their hospital counts; statistics also include previously published promotional figures. Confirm these with the placement office before revising them.

Validation: `npm run test:placements`; frontend: `npm run build`.

Admin: open `/placements` in the admin panel to add, edit, or remove records in all five sections, including nested batch hospitals. Save each section before switching sections. Discard reloads database content.

`PUT /api/placements/:section` accepts `{ "items": [...] }`, where section is `batches`, `stats`, `internationalPlacements`, `destinations`, or `partners`. Requires the existing admin login Bearer token and an existing user with role `admin`. Only the selected section is replaced; an empty array clears it. Invalid records return 400. Successful saves return the same full-page response as GET and appear on the public site when reloaded.
