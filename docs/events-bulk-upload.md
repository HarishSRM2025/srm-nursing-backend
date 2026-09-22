# Bulk event upload

`POST /api/events/bulk-upload`

In Postman, select **Body > form-data**, add a **File** field named `file`, and select your `.xlsx` workbook. Let Postman set the multipart Content-Type including its boundary.

```powershell
curl.exe -X POST http://localhost:5000/api/events/bulk-upload -F "file=@C:/path/to/events.xlsx"
```

Use [events-import-template.xlsx](events-import-template.xlsx). Replace its sample event before importing. Run `npm run template:events` to regenerate the sample.

Only the first worksheet is imported. Row 1 must contain field names. Each subsequent nonempty row creates a new event. Header names are case-sensitive; unknown or duplicate headers reject the workbook to prevent accidental data loss. Only `title` is required; other columns can be omitted or blank. `_id` and `__v` are not import columns.

| Column | Format |
| --- | --- |
| title | Required, nonempty text |
| description | Text |
| startDate, endDate | Excel date cells or ISO strings such as `2026-10-01`, `2026-10-01T09:00:00+05:30` |
| venue, category | Text |
| tags | Comma-separated, e.g. `nursing, students` |
| image | Comma-separated paths relative to the source uploads folder |
| status | `Upcoming`, `Ongoing`, `Completed`, `Cancelled`; blank defaults to `Upcoming` |
| registrationFee | Text or number, saved as a string |
| isActive | `ACTIVE`, `INACTIVE`; blank defaults to `ACTIVE` |
| registrationLink | Text URL |

Excel dates, date-only strings, and timestamps without a timezone are interpreted as UTC. Use an ISO string with an explicit offset for local times. If both dates are present, endDate must not precede startDate. Formulas and Excel errors are rejected; paste their values instead. A comma is a separator, so image filenames containing commas are not supported.

## Images

The backend reads from the **project-root uploads folder**, which is the sibling of `srm-nursing-backend`. It copies images into **srm-nursing-backend/uploads**, already served by the existing `/uploads` route. Source files are retained.

Example image cell:

```text
uploads/2023/11/event1.png, uploads/2023/11/event2.png
```

The `uploads/` prefix is optional. Windows backslashes also work. Image order is preserved, including the first image used as the event cover. Absolute paths, URLs, and paths or symlinks escaping the source folder are rejected. Supported image formats are PNG, JPEG, GIF, and WebP, with extension and file signature checks.

The source folder must exist on the machine running the backend. Deploy the images there before using a remotely hosted API; a spreadsheet cannot access your computer's files remotely.

Limits: 10 MB per workbook, 500 nonempty event rows, 100 images per event, and 20 MB per image. A blank image cell creates an event with an empty image array.

## Results

Each event is validated before copying its images. A missing or invalid image rejects that entire event. Failed events do not stop other rows. If copying or saving fails, newly copied files for that event are removed; cleanup failures are reported as warnings.

HTTP statuses: `201` all rows imported, `207` some rows imported, `422` all rows failed, `400` invalid workbook/request, `413` workbook too large, `500` unexpected request-level failure. `success` is true only when all rows were imported. Excel row numbers include the header.

```json
{
  "success": false,
  "total": 2,
  "imported": 1,
  "failed": 1,
  "results": [
    { "row": 2, "title": "Workshop", "success": true, "eventId": "...", "imageCount": 2 },
    { "row": 3, "title": "Seminar", "success": false, "error": "Image not found: missing.png" }
  ]
}
```

This is a create-only import. Reuploading successful rows creates duplicate events. After a partial import, upload only the failed rows. Existing events and source images are unchanged. The route follows the existing event routes' access configuration.

Run `npm run test:events-import` to verify parsing, filesystem handling, and the multipart endpoint. Tests use temporary images and mocked database saves; they do not write to the application database.

Workbook parsing uses [ExcelJS](https://github.com/exceljs/exceljs#reading-xlsx).
