const AcademicDepartment = require("../models/academicDepartment");

const DEFAULT_ACADEMIC_DEPARTMENTS = [
  {
    deptId: "fundamentals",
    eyebrow: "Department 01",
    title: "Fundamentals of Nursing",
    shortName: "Fundamentals",
    color: "#4b2e83",
    icon: "FaHeartbeat",
    image: "dept-fundamentals.jpg",
    imageAlt: "Fundamentals of Nursing Laboratory and Training",
    description: [
      "The time is spent exclusively on theoretical and clinical instruction, monthly performance feedback, and student nurture and counselling. Students are closely supervised and mentored in groups of 10.",
      "Basic nursing procedures are demonstrated by teachers, and students re-demonstrate on Manikins in the skill lab. After gaining confidence, students carry out procedures on patients — molded across physical, mental, social, and spiritual dimensions."
    ],
    highlights: [
      { icon: "FaStethoscope", text: "Mentor groups of 10 students" },
      { icon: "FaFlask", text: "Skill lab with high-fidelity Manikins" },
      { icon: "FaHospital", text: "Structured clinical progression" },
      { icon: "FaHandHoldingHeart", text: "Holistic development approach" }
    ],
    order: 1,
    status: "active"
  },
  {
    deptId: "adult-health",
    eyebrow: "Department 02",
    title: "Adult Health Nursing",
    shortName: "Adult Health",
    color: "#0f8ca6",
    icon: "FaUserMd",
    image: "dept-adult-health.jpg",
    imageAlt: "Adult Health Nursing Clinical Training",
    description: [
      "Specializing in care of patients with Medical and Surgical conditions. Students are posted in Trichy SRM Medical College Hospital & Research Centre — a 1575-bedded multi-specialty teaching hospital equipped with the latest diagnostic and treatment technologies.",
      "The hospital offers Surgery, Medicine, Obstetrics & Gynecology, Paediatrics, Orthopedics, Neurology, Ophthalmology, ENT, Cardiology, Urology, Nephrology, Respiratory Medicine, and Psychiatry with 24×7 services."
    ],
    highlights: [
      { icon: "FaHospital", text: "1575-bed multi-specialty hospital" },
      { icon: "FaSyringe", text: "Latest diagnostic technologies" },
      { icon: "FaAmbulance", text: "24×7 emergency services" },
      { icon: "FaStethoscope", text: "14+ clinical specialities" }
    ],
    order: 2,
    status: "active"
  },
  {
    deptId: "community",
    eyebrow: "Department 03",
    title: "Community Health Nursing",
    shortName: "Community",
    color: "#0f7a5a",
    icon: "FaUsers",
    image: "dept-community.jpg",
    imageAlt: "Community Health Nursing Outreach and Village Health Camps",
    description: [
      "The College strongly emphasizes preventive and promotive health. Programmes promote health of communities through direct and indirect services for all age groups, preparing students to acquire clinical competencies at different levels.",
      "Services include Home Care, Clinic Services, School Health Programmes, Special Camps, and Community Organization Activities. Antenatal and well-baby clinics are conducted in villages alongside Adolescent Health and Mass Education Programmes."
    ],
    highlights: [
      { icon: "FaSchool", text: "School and adolescent health programmes" },
      { icon: "FaHandHoldingHeart", text: "Home visits and community education" },
      { icon: "FaUsers", text: "Village health meetings and camps" },
      { icon: "FaHospital", text: "Problem-Based Learning approaches" }
    ],
    order: 3,
    status: "active"
  },
  {
    deptId: "child-health",
    eyebrow: "Department 04",
    title: "Child Health Nursing",
    shortName: "Child Health",
    color: "#c2760c",
    icon: "FaBaby",
    image: "dept-child-health.jpg",
    imageAlt: "Child Health Nursing Paediatric Ward",
    description: [
      "Paediatric nurses provide care for children from birth through their late teens. Special training delivers expert care while working with families to address their concerns and help them understand treatment options.",
      "Students develop unique capabilities in communication and treatment techniques with children and families, backed by the finest academic infrastructure and dynamic, hands-on education."
    ],
    highlights: [
      { icon: "FaChild", text: "Care from birth through adolescence" },
      { icon: "FaCommentMedical", text: "Specialized family communication" },
      { icon: "FaSmile", text: "Child-centred clinical techniques" },
      { icon: "FaHospital", text: "Collaboration with paediatricians" }
    ],
    order: 4,
    status: "active"
  },
  {
    deptId: "mental-health",
    eyebrow: "Department 05",
    title: "Mental Health Nursing",
    shortName: "Mental Health",
    color: "#7c3aed",
    icon: "FaBrain",
    image: "dept-mental-health.jpg",
    imageAlt: "Mental Health Nursing Guidance and Rehabilitation",
    description: [
      "The Department of Psychiatric Nursing is integral to the multidisciplinary team in treatment and rehabilitation of persons with mental disorders. It fosters quality education to upgrade knowledge and skill in psychiatric nursing.",
      "Faculty incorporates principles of neurobiology, psychology, and psychiatric nursing to mould students as dedicated and competent mental health nurses. The department also provides guidance and counselling for students' educational, clinical, and social needs."
    ],
    highlights: [
      { icon: "FaBrain", text: "Neurobiology & psychology integrated" },
      { icon: "FaCommentMedical", text: "Guidance & counselling services" },
      { icon: "FaHeadSideVirus", text: "World Mental Health Day observances" },
      { icon: "FaHandHoldingHeart", text: "Rehabilitation & multidisciplinary approach" }
    ],
    order: 5,
    status: "active"
  },
  {
    deptId: "midwifery",
    eyebrow: "Department 06",
    title: "Midwifery & OBG Nursing",
    shortName: "Midwifery & OBG",
    color: "#b5456a",
    icon: "FaFemale",
    image: "dept-midwifery.jpg",
    imageAlt: "Midwifery and Obstetrics & Gynaecology Simulators",
    description: [
      "Midwives provide independent care to women prior to pregnancy, during pregnancy, childbirth, postnatal, and newborn care within the healthcare framework. Gynaecological nurses handle clinical assessment, patient advocacy, and care management.",
      "The department enhances skills in early disease identification, management, and complication prevention. New manikins and simulators support world-class skill development with effective hands-on practice for every student."
    ],
    highlights: [
      { icon: "FaBabyCarriage", text: "Full continuum: pre-conception to postnatal" },
      { icon: "FaShieldAlt", text: "High-fidelity manikins & simulators" },
      { icon: "FaCalendarAlt", text: "Women's health advocacy & rights" },
      { icon: "FaAppleAlt", text: "Reproductive health education" }
    ],
    order: 6,
    status: "active"
  }
];

const ensureDepartmentsSeeded = async () => {
  const count = await AcademicDepartment.countDocuments();
  if (count === 0) {
    await AcademicDepartment.insertMany(DEFAULT_ACADEMIC_DEPARTMENTS);
  }
};

const parseJsonIfNeeded = (value, fallback = []) => {
  if (value === undefined || value === null) return fallback;
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      // If it's a string separated by newlines
      const split = value.split("\n").map(s => s.trim()).filter(Boolean);
      return split.length ? split : [value];
    }
  }
  return fallback;
};

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
};

// GET /api/departments
exports.getAllDepartments = async (req, res) => {
  try {
    const { status, search } = req.query;
    let filter = {};

    if (status && status !== "All") {
      filter.status = status;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { title: regex },
        { shortName: regex },
        { deptId: regex },
        { eyebrow: regex },
        { description: regex }
      ];
    }

    const departments = await AcademicDepartment.find(filter).sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, count: departments.length, departments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch departments", error: error.message });
  }
};

// GET /api/departments/:id
exports.getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    let dept = null;

    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      dept = await AcademicDepartment.findById(id);
    }
    if (!dept && id) {
      dept = await AcademicDepartment.findOne({ deptId: id.toLowerCase() });
    }

    if (!dept) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    res.status(200).json({ success: true, department: dept });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch department", error: error.message });
  }
};

// POST /api/departments
exports.createDepartment = async (req, res) => {
  try {
    const {
      title,
      deptId,
      shortName,
      eyebrow,
      color,
      icon,
      imageAlt,
      description,
      highlights,
      order,
      status
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Department title is required" });
    }

    const generatedDeptId = (deptId && deptId.trim()) ? slugify(deptId) : slugify(title);

    // Check if deptId already exists
    const existing = await AcademicDepartment.findOne({ deptId: generatedDeptId });
    if (existing) {
      return res.status(400).json({ success: false, message: `Department ID '${generatedDeptId}' already exists. Please choose a unique ID.` });
    }

    const imageFilename = req.file ? req.file.filename : (req.body.image || "");

    const parsedDesc = parseJsonIfNeeded(description, []);
    const parsedHighlights = parseJsonIfNeeded(highlights, []);

    const dept = new AcademicDepartment({
      deptId: generatedDeptId,
      title: title.trim(),
      shortName: shortName ? shortName.trim() : title.trim(),
      eyebrow: eyebrow ? eyebrow.trim() : "",
      color: color ? color.trim() : "#4b2e83",
      icon: icon ? icon.trim() : "FaHeartbeat",
      image: imageFilename,
      imageAlt: imageAlt ? imageAlt.trim() : title.trim(),
      description: parsedDesc,
      highlights: parsedHighlights,
      order: order !== undefined && order !== "" ? Number(order) : 0,
      status: status || "active"
    });

    await dept.save();
    res.status(201).json({ success: true, message: "Department created successfully", department: dept });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create department", error: error.message });
  }
};

// PUT /api/departments/:id
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    let dept = null;

    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      dept = await AcademicDepartment.findById(id);
    }
    if (!dept && id) {
      dept = await AcademicDepartment.findOne({ deptId: id.toLowerCase() });
    }
    if (!dept && req.body && req.body.deptId) {
      dept = await AcademicDepartment.findOne({ deptId: req.body.deptId.toLowerCase() });
    }

    if (!dept) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    const {
      title,
      deptId,
      shortName,
      eyebrow,
      color,
      icon,
      imageAlt,
      description,
      highlights,
      order,
      status,
      image
    } = req.body;

    const updateDoc = {};

    if (title && title.trim()) updateDoc.title = title.trim();

    if (deptId && deptId.trim()) {
      const newSlug = slugify(deptId);
      if (newSlug !== dept.deptId) {
        const conflict = await AcademicDepartment.findOne({ deptId: newSlug, _id: { $ne: dept._id } });
        if (conflict) {
          return res.status(400).json({ success: false, message: `Department ID '${newSlug}' is already taken.` });
        }
        updateDoc.deptId = newSlug;
      }
    }

    if (shortName !== undefined) updateDoc.shortName = shortName.trim();
    if (eyebrow !== undefined) updateDoc.eyebrow = eyebrow.trim();
    if (color !== undefined) updateDoc.color = color.trim();
    if (icon !== undefined) updateDoc.icon = icon.trim();
    if (imageAlt !== undefined) updateDoc.imageAlt = imageAlt.trim();

    if (req.file) {
      updateDoc.image = req.file.filename;
    } else if (image !== undefined && image !== "") {
      updateDoc.image = image;
    }

    if (description !== undefined) {
      updateDoc.description = parseJsonIfNeeded(description, dept.description);
    }

    if (highlights !== undefined) {
      updateDoc.highlights = parseJsonIfNeeded(highlights, dept.highlights);
    }

    if (order !== undefined && order !== "") {
      updateDoc.order = Number(order);
    }

    if (status !== undefined) {
      updateDoc.status = status;
    }

    const updated = await AcademicDepartment.findByIdAndUpdate(
      dept._id,
      { $set: updateDoc },
      { returnDocument: 'after' }
    );

    res.status(200).json({ success: true, message: "Department updated successfully", department: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update department", error: error.message });
  }
};

// DELETE /api/departments/:id
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    let dept = null;

    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      dept = await AcademicDepartment.findByIdAndDelete(id);
    }
    if (!dept && id) {
      dept = await AcademicDepartment.findOneAndDelete({ deptId: id.toLowerCase() });
    }

    if (!dept) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    res.status(200).json({ success: true, message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete department", error: error.message });
  }
};

// POST /api/departments/seed
exports.seedDefaultDepartments = async (req, res) => {
  try {
    const { force } = req.query;
    if (force === "true") {
      await AcademicDepartment.deleteMany({});
    }
    const count = await AcademicDepartment.countDocuments();
    if (count === 0) {
      await AcademicDepartment.insertMany(DEFAULT_ACADEMIC_DEPARTMENTS);
    }
    const departments = await AcademicDepartment.find().sort({ order: 1 });
    res.status(200).json({
      success: true,
      message: force === "true" ? "Departments reset and seeded successfully" : "Default departments ensured",
      count: departments.length,
      departments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to seed departments", error: error.message });
  }
};
