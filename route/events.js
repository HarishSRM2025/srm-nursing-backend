const express = require("express");
const { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } = require("../controller/events");
const upload = require("../middleware/multer");
const eventSpreadsheet = require('../middleware/eventSpreadsheet');
const { bulkUploadEvents } = require('../controller/eventImport');

const router = express.Router();

router.post('/bulk-upload', eventSpreadsheet, bulkUploadEvents);
router.post("/create-event", upload.array("image", 10), createEvent);
router.get("/get-all-events", getAllEvents);
router.get("/get-event-by-id/:id", getEventById);
router.put("/update-event/:id", upload.array("image", 10), updateEvent);
router.delete("/delete-event/:id", deleteEvent);

module.exports = router;
