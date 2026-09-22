const Events = require('../models/events/events');
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const TIMEZONE = 'Asia/Kolkata';

function invalid(message) { return Object.assign(new Error(message), { statusCode: 400 }); }
function stringParam(query, key) {
    const value = query[key];
    if (value === undefined) return '';
    if (typeof value !== 'string' || value.length > 500) throw invalid(`Invalid ${key}`);
    return value.trim();
}
function numberParam(query, key, fallback, maximum) {
    const value = stringParam(query, key);
    if (!value) return fallback;
    if (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) < 1 || Number(value) > maximum) {
        throw invalid(`${key} must be between 1 and ${maximum}`);
    }
    return Number(value);
}

function listingQuery(query) {
    const page = numberParam(query, 'page', 1, 1000000);
    const limit = numberParam(query, 'limit', 10, 100);
    const base = {};
    const activeOnly = stringParam(query, 'activeOnly');
    if (activeOnly && !['true', 'false'].includes(activeOnly)) throw invalid('Invalid activeOnly');
    if (activeOnly === 'true') base.isActive = { $ne: 'INACTIVE' };
    const scope = stringParam(query, 'scope');
    if (scope && !['events', 'cne'].includes(scope)) throw invalid('Invalid scope');
    // Support the existing Events label and singular Event imports, regardless of case.
    const eventCategory = /^\s*events?\s*$/i;
    if (scope) base.$and = [{ category: scope === 'events' ? eventCategory : { $not: eventCategory } }];
    const filter = { ...base };
    const search = stringParam(query, 'search');
    if (search) {
        const regex = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filter.$or = ['title', 'description'].map(field => ({ [field]: { $regex: regex, $options: 'i' } }));
    }
    const category = stringParam(query, 'category');
    if (category) filter.category = category;
    const status = stringParam(query, 'status');
    if (status) {
        if (!['Upcoming', 'Ongoing', 'Completed', 'Cancelled'].includes(status)) throw invalid('Invalid status');
        filter.status = status;
    }
    const tags = stringParam(query, 'tags');
    if (tags) filter.tags = { $in: tags.split(',').map(tag => tag.trim()).filter(Boolean) };
    const year = stringParam(query, 'year');
    const month = stringParam(query, 'month');
    const dateFilters = [];
    if (year) {
        if (!/^\d{4}$/.test(year) || Number(year) < 1900 || Number(year) > 9999) throw invalid('Invalid year');
        dateFilters.push({ $eq: [{ $year: { date: '$startDate', timezone: TIMEZONE } }, Number(year)] });
    }
    if (month) {
        if (!MONTHS.includes(month)) throw invalid('Invalid month');
        dateFilters.push({ $eq: [{ $month: { date: '$startDate', timezone: TIMEZONE } }, MONTHS.indexOf(month) + 1] });
    }
    if (dateFilters.length) filter.$expr = { $and: dateFilters };
    const includeFilters = stringParam(query, 'includeFilters');
    if (includeFilters && !['true', 'false'].includes(includeFilters)) throw invalid('Invalid includeFilters');
    return { page, limit, base, filter, includeFilters: includeFilters === 'true' };
}

async function listEvents(query, Model = Events) {
    const options = listingQuery(query);
    const total = await Model.countDocuments(options.filter);
    const totalPages = Math.max(1, Math.ceil(total / options.limit));
    const page = Math.min(options.page, totalPages);
    // _id provides a stable newest-first order even for imported events without timestamps.
    const events = await Model.find(options.filter).sort({ _id: -1 })
        .skip((page - 1) * options.limit).limit(options.limit).lean();
    const result = { success: true, events, pagination: { page, limit: options.limit, total, totalPages } };
    if (options.includeFilters) {
        const [facets] = await Model.aggregate([
            { $match: options.base },
            { $facet: {
                categories: [
                    { $group: { _id: '$category', count: { $sum: 1 } } },
                    { $sort: { _id: 1 } }
                ],
                years: [
                    { $match: { startDate: { $type: 'date' } } },
                    { $group: { _id: { $year: { date: '$startDate', timezone: TIMEZONE } } } },
                    { $sort: { _id: -1 } }
                ],
                total: [{ $count: 'count' }]
            } }
        ]);
        result.filters = {
            categories: (facets?.categories || []).filter(item => typeof item._id === 'string' && item._id.trim())
                .map(item => ({ name: item._id, count: item.count })),
            years: (facets?.years || []).map(item => String(item._id)),
            total: facets?.total[0]?.count || 0
        };
    }
    return result;
}

module.exports = { listEvents, listingQuery };
