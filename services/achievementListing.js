const typeFilter = type => ({ type: type === 'faculty' ? 'faculty' : 'student' });

function listingQuery(query, type) {
  const invalid = message => { throw Object.assign(new Error(message), { status: 400 }); };
  const integer = (value, fallback, max) => {
    if (value === undefined || value === '') return fallback;
    if (typeof value !== 'string' || !/^\d+$/.test(value) || Number(value) < 1 || !Number.isSafeInteger(Number(value)) || Number(value) > max) invalid('Invalid pagination or year');
    return Number(value);
  };
  for (const key of ['search', 'category', 'status', 'year']) {
    if (query[key] !== undefined && typeof query[key] !== 'string') invalid(`Invalid ${key}`);
  }
  const base = typeFilter(type);
  if (query.status && query.status !== 'All') {
    if (!['active', 'inactive'].includes(query.status)) invalid('Invalid status');
    base.status = query.status;
  }
  const conditions = [base];
  if (query.year && query.year !== 'All') conditions.push({ year: integer(query.year, undefined, 9999) });
  if (query.category && !['All', 'all'].includes(query.category)) conditions.push({ category: query.category });
  if (query.search?.trim()) {
    const search = query.search.trim().slice(0, 200).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    conditions.push({ $or: ['student_or_batch', 'award_or_title', 'description', 'institution'].map(field => ({ [field]: new RegExp(search, 'i') })) });
  }
  return { base, filter: { $and: conditions }, page: integer(query.page, 1, Number.MAX_SAFE_INTEGER), limit: integer(query.limit, 6, 100), paginated: query.page !== undefined || query.limit !== undefined };
}
module.exports = { typeFilter, listingQuery };
