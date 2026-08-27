const express = require("express");
const {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact
} = require("../controller/contact");

const router = express.Router();

router.post("/", createContact);
router.post("/create", createContact);
router.get("/", getAllContacts);
router.get("/get-all", getAllContacts);
router.get("/:id", getContactById);
router.put("/:id", updateContact);
router.put("/update/:id", updateContact);
router.delete("/:id", deleteContact);
router.delete("/delete/:id", deleteContact);

module.exports = router;
