# Placements

`GET /api/placements` returns `{ "success": true, "data": { "batches": [], "stats": [], "internationalPlacements": [], "destinations": [], "partners": [] } }` populated from the MongoDB `placements` collection.

Returns 404 when the page document has not been seeded and 500 on a database error. Reads never insert or change records.

Run `npm run seed:placements` from the backend directory using the configured `DBURL` (or `MONGODB_URI`). The seed inserts the existing website content from `data/placements.json` only if the page document is missing. Repeated runs preserve existing database content.

The frontend uses `VITE_BACKEND_API_URL`, then `VITE_API_URL`, then `http://localhost:5000`. It includes loading, retry, and empty states.

The migrated content preserves the original published figures. The first two batch totals differ from the sums of their hospital counts; statistics also include previously published promotional figures. Confirm these with the placement office before revising them.

Validation: `npm run test:placements`; frontend: `npm run build`.
