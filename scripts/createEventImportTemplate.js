const ExcelJS = require('exceljs');
const path = require('node:path');
const fs = require('node:fs/promises');
const { columns } = require('../services/eventImport');

async function main() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Events');
    sheet.columns = columns.map(key => ({ header: key, key, width: key === 'image' ? 75 : 24 }));
    sheet.getRow(1).font = { bold: true };
    sheet.views = [{ state: 'frozen', ySplit: 1 }];
    sheet.addRow({
        title: 'Sample Nursing Workshop',
        description: 'Replace this sample row with your event details.',
        startDate: new Date('2026-10-01T09:00:00Z'),
        endDate: new Date('2026-10-01T16:00:00Z'),
        venue: 'College Auditorium', category: 'Workshop', tags: 'nursing, students',
        image: 'uploads/2023/11/event1.png, uploads/2023/11/event2.png',
        status: 'Upcoming', registrationFee: '0', isActive: 'ACTIVE',
        registrationLink: 'https://example.com/register'
    });
    sheet.getColumn('startDate').numFmt = 'yyyy-mm-dd hh:mm';
    sheet.getColumn('endDate').numFmt = 'yyyy-mm-dd hh:mm';
    const directory = path.resolve(__dirname, '../docs');
    await fs.mkdir(directory, { recursive: true });
    await workbook.xlsx.writeFile(path.join(directory, 'events-import-template.xlsx'));
    console.log('Created docs/events-import-template.xlsx');
}

main().catch(error => { console.error(error); process.exitCode = 1; });
