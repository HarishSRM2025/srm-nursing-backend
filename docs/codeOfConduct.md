# Code of Conduct

- Public endpoint: `GET /api/code-of-conduct` returns `{ success: true, data: [...] }` with sections in display order. An unseeded database returns an empty array.
- Admin endpoint: `PUT /api/code-of-conduct/:id` accepts a section object and returns `{ success: true, data: section }`. Uses the existing admin Bearer token; checks the user still exists and has the admin role. Returns 400 for invalid content, 404 for unknown section IDs, and 500 for database failures.
- Section IDs: `general-rules`, `disciplinary-committee`, `students`, `dress`, `hostel`, `ragging`, `principal`, `faculty`, `support`.
- Each section has a required title. Content includes institution details, introductions, paragraphs, committee rows, numbered rules, boys/girls dress rules, subclauses, punishments, and appeals. Save a section in full; empty lists remove its entries. Other sections remain unchanged.
- Admin navigation: **Code of Conduct** (`/code-of-conduct`). Add, edit, remove, and reorder rules; edit committee members and nested details. Save or discard before switching sections. Public content updates on reload. Existing images remain bundled with the frontend.
- Seed: `npm run seed:code-of-conduct` uses `DBURL` or `MONGODB_URI` from the backend `.env`. Inserts missing sections from `data/codeOfConduct.json` without overwriting existing records.
- Tests: `npm run test:code-of-conduct`. Build each frontend using `npm run build`.

The seed preserves the existing institutional policy text; it does not constitute a policy review or revision.
