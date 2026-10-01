# Achievement APIs

Student endpoint: `/api/student-achievements`. Faculty endpoint: `/api/faculty-achievements`.
The existing `/api/achievement` endpoint remains a student alias, including records created before the `type` field existed.

Both endpoints support GET and POST at `/`, and GET, PUT and DELETE at `/:id`.
Updates and deletes are restricted to the endpoint's achievement type.

Fields: `student_or_batch` (recipient name, including faculty), `award_or_title`, `year` (integer 1900–9999), `description`, `category`, `status`, `institution`.
Recipient, award and year are required on creation. Categories: Academic, Sports, Cultural, Research, Community, General. Status: active or inactive.

GET query parameters: `search`, `category`, `year`, `status`, `page`, `limit` (1–100).
Supplying page or limit enables pagination; omitted pagination preserves the admin's full listing.
Response includes `achievements`, `total`, `pagination`, `filters` (category counts and years), and `stats`.
Public pages request `status=active`; filter options are scoped to that status and achievement type.
Reads do not seed or mutate data. The existing student reset/seed action affects students only; no faculty sample records are invented.

Public routes: `/student-achievements`, `/faculty-achievements`.
Admin routes: `/achievements` (students), `/faculty-achievements`.
