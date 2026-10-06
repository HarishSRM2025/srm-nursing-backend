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
Reads do not seed or mutate data. Seed data and the reset/seed endpoint have been removed. Existing database records are preserved.

Public routes: `/student-achievements`, `/faculty-achievements`.
Admin routes: `/achievements` (students), `/faculty-achievements`.


## Bulk upload

Both achievement endpoints (and the student alias) support:
- `GET /template`: download a blank Excel workbook with column headers only.
- `POST /bulk-upload`: multipart form data with a single `file` field containing an `.xlsx` workbook, maximum 10 MB and 500 nonempty rows.

Only the first sheet is imported. Use the exact field names above as column headers; `student_or_batch`, `award_or_title`, and `year` are required. Optional blank cells use model defaults (General category, active status, default institution). Formulas and date cells are rejected; enter year as a four-digit integer. The endpoint determines student/faculty type; do not include a type column.

Uploads append records and never reset existing data. Responses contain `total`, `imported`, `failed`, and `results` with Excel row numbers and validation errors. HTTP 201 means all rows imported, 207 means partial success, and 422 means all rows failed. File/header errors return 400 (oversized files: 413). Correct and retry only failed rows to avoid duplicate records.

Use **Bulk Upload** in either admin achievement page. Successful imports refresh the listing; active records appear through the existing public achievement API.

Student and faculty use separate Mongoose models in `models/achivement/studentAchievement.js` and `models/achivement/facultyAchievement.js`. Each schema fixes its type. Both retain the existing `achievements` collection so existing records remain accessible; API queries restrict records by type. Shared field definitions live in `achievementSchema.js`.
