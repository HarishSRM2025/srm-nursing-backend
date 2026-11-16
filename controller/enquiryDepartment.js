const Department = require("../models/department");

const DEFAULT_ENQUIRY_DEPARTMENTS = [
  {
    name: "Admissions Office",
    desc: "Course details, eligibility & seat enquiries.",
    img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop",
    email: "admissions@nc.srmtrichy.edu.in",
    order: 1,
    status: "active"
  },
  {
    name: "Academic Affairs",
    desc: "Curriculum, faculty & examination support.",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
    email: "academics@nc.srmtrichy.edu.in",
    order: 2,
    status: "active"
  },
  {
    name: "Student Welfare",
    desc: "Hostel, scholarships & counselling services.",
    img: "https://images.unsplash.com/photo-1576765608866-5b51046452be?q=80&w=800&auto=format&fit=crop",
    email: "welfare@nc.srmtrichy.edu.in",
    order: 3,
    status: "active"
  }
];

const ensureEnquiryDepartmentsSeeded = async () => {
  const count = await Department.countDocuments();
  if (count === 0) {
    await Department.insertMany(DEFAULT_ENQUIRY_DEPARTMENTS);
  }
};

exports.getAllDepartments = async (req, res) => {
  try {
    await ensureEnquiryDepartmentsSeeded();
    const { status } = req.query;
    let filter = {};
    if (status && status !== "All") filter.status = status;

    const departments = await Department.find(filter).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, departments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch enquiry departments", error: error.message });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const { name, desc, email, phone, img, order, status } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required" });
    }

    const dept = new Department({
      name: name.trim(),
      desc: desc ? desc.trim() : "",
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : "",
      img: img || "",
      order: order ? Number(order) : 0,
      status: status || "active"
    });

    await dept.save();
    res.status(201).json({ success: true, message: "Enquiry department created successfully", department: dept });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create enquiry department", error: error.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, desc, email, phone, img, order, status } = req.body;

    let dept = null;
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      dept = await Department.findByIdAndUpdate(
        id,
        {
          name: name ? name.trim() : undefined,
          desc: desc !== undefined ? desc.trim() : undefined,
          email: email ? email.trim().toLowerCase() : undefined,
          phone: phone !== undefined ? phone.trim() : undefined,
          img: img !== undefined ? img : undefined,
          order: order !== undefined && order !== "" ? Number(order) : 0,
          status: status || "active"
        },
        { returnDocument: 'after' }
      );
    }

    if (!dept && name) {
      dept = await Department.findOneAndUpdate(
        { name: name.trim() },
        {
          desc: desc !== undefined ? desc.trim() : undefined,
          email: email ? email.trim().toLowerCase() : undefined,
          phone: phone !== undefined ? phone.trim() : undefined,
          img: img !== undefined ? img : undefined,
          order: order !== undefined && order !== "" ? Number(order) : 0,
          status: status || "active"
        },
        { returnDocument: 'after' }
      );
    }

    if (!dept) {
      return res.status(404).json({ success: false, message: "Enquiry department not found" });
    }

    res.status(200).json({ success: true, message: "Enquiry department updated successfully", department: dept });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update enquiry department", error: error.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    let dept = null;
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      dept = await Department.findByIdAndDelete(id);
    }
    if (!dept) {
      return res.status(404).json({ success: false, message: "Enquiry department not found" });
    }
    res.status(200).json({ success: true, message: "Enquiry department deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete enquiry department", error: error.message });
  }
};
