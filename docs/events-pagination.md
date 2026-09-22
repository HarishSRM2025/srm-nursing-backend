# Event batches

`GET /api/events/get-all-events?page=1&limit=10`

The endpoint returns only the requested batch using MongoDB `skip` and `limit`, ordered by `_id` descending. Defaults: page 1, limit 10. The maximum limit is 100. Pages beyond the last page are clamped to the last available page.

Optional query parameters: `search` (title or description), `category`, `status`, `year`, `month` (Jan–Dec), `tags` (comma-separated), `activeOnly=true`, and `includeFilters=true`.

Public listings also send `scope=events` or `scope=cne`. Events includes only the Event/Events category (case-insensitive, ignoring surrounding whitespace); CNE excludes those categories, including uncategorized records. The scope applies to records, counts, and sidebar metadata before pagination. Admin requests without a scope continue to include all categories.

The response includes `events` and `pagination: { page, limit, total, totalPages }`. With `includeFilters=true`, `filters` contains category counts, years, and total across the complete active scope, independent of the selected page and search filters. Year/month filtering uses Asia/Kolkata time.

Admin requests 10 events per page; the public site requests 6 active events per page. Both reset to page 1 on filter changes and cancel superseded requests. The dashboard uses `pagination.total` for its event count.

Run `node --test tests/eventListing.test.js` for query validation, batch boundaries, empty results, and metadata checks. These tests use a mocked model, not a live database.
