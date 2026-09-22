const ExcelJS = require('exceljs');
const fs = require('node:fs/promises');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { constants } = require('node:fs');
const Events = require('../models/events/events');

const columns = ['title', 'description', 'startDate', 'endDate', 'venue', 'category', 'tags', 'image', 'status', 'registrationFee', 'isActive', 'registrationLink'];
const sourceRoot = path.resolve(__dirname, '../../uploads');
const destinationRoot = path.resolve(__dirname, '../uploads');

function badRequest(message) {
    return Object.assign(new Error(message), { statusCode: 400 });
}

function cellValue(cell) {
    const value = cell.value;
    if (value === null || value === undefined) return '';
    if (value instanceof Date) return value;
    if (typeof value === 'object') {
        if (value.richText) return value.richText.map(part => part.text).join('').trim();
        if (value.hyperlink) return String(value.text || value.hyperlink).trim();
        throw new Error(`Cell ${cell.address}: formulas and error cells are not supported; paste values instead`);
    }
    return typeof value === 'string' ? value.trim() : value;
}

function parseDate(value, field) {
    if (value instanceof Date && Number.isFinite(value.getTime())) return value;
    // Require unambiguous ISO dates. Bare dates and timezone-less times are UTC.
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})?)?$/.test(value)) {
        throw new Error(`${field} must be an Excel date cell or an ISO date (YYYY-MM-DD)`);
    }
    const [year, month, day] = value.slice(0, 10).split('-').map(Number);
    const calendar = new Date(0);
    calendar.setUTCFullYear(year, month - 1, day);
    if (calendar.getUTCFullYear() !== year || calendar.getUTCMonth() !== month - 1 || calendar.getUTCDate() !== day) {
        throw new Error(`${field} contains an invalid date`);
    }
    const normalized = value.includes('T') && !/(Z|[+-]\d{2}:\d{2})$/.test(value) ? `${value}Z` : value;
    const parsed = new Date(normalized);
    if (!Number.isFinite(parsed.getTime())) throw new Error(`${field} contains an invalid date`);
    return parsed;
}

function inside(root, target) {
    const relative = path.relative(root, target);
    return relative !== '' && relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

async function resolveImage(reference, root) {
    const normalized = reference.replace(/\\/g, '/').replace(/^uploads\//i, '');
    if (path.isAbsolute(normalized) || path.win32.isAbsolute(normalized) || normalized.includes(':')) {
        throw new Error(`Image path must be relative to uploads: ${reference}`);
    }
    const candidate = path.resolve(root, normalized);
    if (!inside(root, candidate)) throw new Error(`Image path is outside uploads: ${reference}`);
    let real;
    try { real = await fs.realpath(candidate); } catch {
        throw new Error(`Image not found: ${reference}`);
    }
    if (!inside(root, real)) throw new Error(`Image path is outside uploads: ${reference}`);
    const stat = await fs.stat(real);
    if (!stat.isFile() || stat.size === 0 || stat.size > 20 * 1024 * 1024) {
        throw new Error(`Image must be a nonempty file of at most 20 MB: ${reference}`);
    }
    const extension = path.extname(real).toLowerCase();
    const handle = await fs.open(real, 'r');
    const header = Buffer.alloc(12);
    try { await handle.read(header, 0, header.length, 0); } finally { await handle.close(); }
    const signatures = {
        '.png': header.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex')),
        '.jpg': header[0] === 255 && header[1] === 216 && header[2] === 255,
        '.jpeg': header[0] === 255 && header[1] === 216 && header[2] === 255,
        '.gif': ['GIF87a', 'GIF89a'].includes(header.toString('ascii', 0, 6)),
        '.webp': header.toString('ascii', 0, 4) === 'RIFF' && header.toString('ascii', 8, 12) === 'WEBP'
    };
    if (!signatures[extension]) throw new Error(`Image must be a valid PNG, JPEG, GIF, or WebP: ${reference}`);
    return { path: real, extension };
}

async function importEvents(buffer, options = {}) {
    const EventModel = options.EventModel || Events;
    const source = options.sourceRoot || sourceRoot;
    const destination = options.destinationRoot || destinationRoot;
    const workbook = new ExcelJS.Workbook();
    try { await workbook.xlsx.load(buffer); } catch { throw badRequest('Unable to read Excel file; provide a valid .xlsx workbook'); }
    const sheet = workbook.worksheets[0];
    if (!sheet) throw badRequest('Workbook has no worksheets');
    const headers = new Map();
    sheet.getRow(1).eachCell((cell, index) => {
        let name;
        try { name = String(cellValue(cell)); } catch (error) { throw badRequest(error.message); }
        if (!name) return;
        if (!columns.includes(name)) throw badRequest(`Unknown column: ${name}`);
        if (headers.has(name)) throw badRequest(`Duplicate column: ${name}`);
        headers.set(name, index);
    });
    if (!headers.has('title')) throw badRequest('The first row must contain a title column');
    const rows = [];
    sheet.eachRow((row, number) => {
        if (number > 1 && row.values.some(value => value !== null && value !== undefined && String(value).trim() !== '')) rows.push(row);
    });
    if (!rows.length) throw badRequest('Workbook contains no event rows');
    if (rows.length > 500) throw badRequest('Upload at most 500 events per workbook');

    const results = [];
    for (const row of rows) {
        const copied = [];
        let title = '';
        try {
            const data = {};
            for (const [name, index] of headers) {
                const value = cellValue(row.getCell(index));
                if (value !== '') data[name] = value;
            }
            title = String(data.title || '').trim();
            if (!title) throw new Error('title is required');
            data.title = title;
            for (const name of ['startDate', 'endDate']) {
                if (data[name] !== undefined) data[name] = parseDate(data[name], name);
            }
            if (data.startDate && data.endDate && data.endDate < data.startDate) throw new Error('endDate must be on or after startDate');
            data.tags = data.tags === undefined ? [] : String(data.tags).split(',').map(tag => tag.trim()).filter(Boolean);
            const references = data.image === undefined ? [] : String(data.image).split(',').map(ref => ref.trim()).filter(Boolean);
            if (references.length > 100) throw new Error('An event may contain at most 100 images');
            data.image = [];
            const event = new EventModel(data);
            if (!event.title) throw new Error('title must contain text, not only HTML tags');
            title = event.title;
            await event.validate();
            const images = [];
            if (references.length) {
                let root;
                try { root = await fs.realpath(source); } catch { throw new Error('Source uploads folder is not available on the backend server'); }
                for (const reference of references) images.push(await resolveImage(reference, root));
                await fs.mkdir(destination, { recursive: true });
            }
            for (const image of images) {
                const name = `${randomUUID()}${image.extension}`;
                const target = path.join(destination, name);
                // Record the target first so partial copies are also cleaned on failure.
                copied.push(target);
                await fs.copyFile(image.path, target, constants.COPYFILE_EXCL);
                event.image.push(`uploads/${name}`);
            }
            await event.save();
            results.push({ row: row.number, title, success: true, eventId: String(event._id), imageCount: event.image.length });
        } catch (error) {
            const cleanup = await Promise.allSettled(copied.map(file => fs.unlink(file)));
            const cleanupFailed = cleanup.some(result => result.status === 'rejected' && result.reason.code !== 'ENOENT');
            results.push({ row: row.number, title, success: false, error: error.message,
                ...(cleanupFailed ? { warning: 'Some copied images could not be removed; check backend uploads' } : {}) });
        }
    }
    const imported = results.filter(result => result.success).length;
    return { success: imported === rows.length, total: rows.length, imported, failed: rows.length - imported, results };
}

module.exports = { importEvents, columns };
