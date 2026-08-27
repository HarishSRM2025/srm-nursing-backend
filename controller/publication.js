const Publication = require("../models/publication");

const DEFAULT_RECORDS = [
  {
    faculty_name: "Dr. Suja Suresh",
    title: "Effectiveness of Need Based Social Awareness Programme on Knowledge Regarding Obesity among Students in Selected School at Trichy District",
    description: "Best Paper Certificate (co-authored with Sarmila A), International Journal of Research in Humanities, Arts and Literature (IJRHAL), dated 26th June 2021.",
    year: 2021
  },
  {
    faculty_name: "Dr. Suja Suresh",
    title: "Effectiveness of Community Based Health Awareness Programme Regarding Menstrual Hygiene among Adolescent Girls in Selected Rural School at Trichy, Tamilnadu",
    description: "Certificate of Publication (co-authored with Saranya), International Journal of Educational Science and Research (IJESR), Volume 12, Issue-1, June 2022.",
    year: 2022
  },
  {
    faculty_name: "Dr. Suja Suresh",
    title: "A Study to Determine the Knowledge on Human Milk Banking Among Students",
    description: "Certificate of Publication (co-authored with Mrs. Devi K), International Journal of Research and Analytical Reviews (IJRAR), Volume 10 Issue 3, published 29th July 2023.",
    year: 2023
  },
  {
    faculty_name: "Dr. Suja Suresh",
    title: "Effectiveness of Nurse Lead Counselling Programme on Attitude in Relation to Reproductive Tract Infection among Women Living in Rural Area of Tamilnadu, South India",
    description: "Certificate of Publication, Journal of Emerging Technologies and Innovative Research (JETIR), Volume 11 Issue 1, published 20th January 2024.",
    year: 2024
  },
  {
    faculty_name: "Dr. Suja Suresh",
    title: "The Impact of Applying Dry Heat versus Moist Heat on Alleviating Breast Engorgement in Postnatal Mothers",
    description: "Certificate of Publication (co-authored with Devi K), International Journal of Scientific Development and Research (IJSDR), Volume 9 Issue 6, June 2024.",
    year: 2024
  },
  {
    faculty_name: "Dr. Suja Suresh",
    title: "Menstrual Blood Banking – “Best Out of Waste Concept”",
    description: "Certificate of Publication (co-authored with A. Bebina Vincia Anjala Mary and Devi K), International Journal of Research and Analytical Reviews (IJRAR), Volume 11 Issue 4, published 20th December 2024.",
    year: 2024
  },
  {
    faculty_name: "Dr. Suja Suresh",
    title: "Assessing Awareness of Geriatric Government Schemes Among Elderly Residents in Rural Trichy District: A Comprehensive Study",
    description: "Certificate, Asian Journal of Science and Technology, Volume 16, Issue 02, pp. 13524–13527, February 2025.",
    year: 2025
  },
  {
    faculty_name: "Dr. Suja Suresh",
    title: "A Study to Determine the Knowledge on PCOS Among …",
    description: "Certificate of Publication (co-authored with A. Bebina Vincia Anjala Mary and Ms. Tifani), International Journal of Research and Analytical Reviews (IJRAR), Volume 10 Issue 2, published 24th April 2023.",
    year: 2023
  },
  {
    faculty_name: "Dr. Suja Suresh",
    title: "A Study to Determine the Knowledge on Breast Cancer Among Students",
    description: "Certificate of Publication (co-authored with A. Bebina Vincia Anjala Mary and Devi), International Journal of Novel Research and Development (IJNRD), Volume 11 Issue 3, published 19th March 2026.",
    year: 2026
  },
  {
    faculty_name: "Dr. Suja Suresh",
    title: "Panelist – The Future of Nursing: Technology, Leadership & the Future of Care",
    description: "Certificate of Participation (0.5 CNE Credits, 2.5 CNE Hours, accredited by the Indian Nursing Council) for participating in the live discussion, conducted by the Academy of Digital Health Sciences on 7th August 2026.",
    year: 2026
  },
  {
    faculty_name: "Dr. Suja Suresh",
    title: "Resource Person – DPHICON 2024",
    description: "Invited speaker for the Nutrition session, presented “Maternal Nutrition and its Impact on Foetal Development” at DPHICON 2024, organised by the Directorate of Public Health and Preventive Medicine, Chennai, on 4th October 2024 (Day 1).",
    year: 2024
  },
  {
    faculty_name: "Devi K",
    title: "A Study to Determine the Knowledge on Human Milk Banking Among Students",
    description: "Certificate of Publication (co-authored with Dr. Suja Suresh), International Journal of Research and Analytical Reviews (IJRAR), Volume 10 Issue 3, published 29th July 2023.",
    year: 2023
  },
  {
    faculty_name: "Devi K",
    title: "The Impact of Applying Dry Heat versus Moist Heat on Alleviating Breast Engorgement in Postnatal Mothers",
    description: "Certificate of Publication (co-authored with Dr. Suja Suresh), International Journal of Scientific Development and Research (IJSDR), Volume 9 Issue 6, June 2024.",
    year: 2024
  },
  {
    faculty_name: "Devi K",
    title: "Menstrual Blood Banking – “Best Out of Waste Concept”",
    description: "Certificate of Publication (co-authored with Dr. Suja Suresh and A. Bebina Vincia Anjala Mary), International Journal of Research and Analytical Reviews (IJRAR), Volume 11 Issue 4, published 20th December 2024.",
    year: 2024
  },
  {
    faculty_name: "Devi K",
    title: "A Study to Determine the Knowledge on Breast Cancer Among Students",
    description: "Certificate of Publication (co-authored with Dr. Suja Suresh and A. Bebina Vincia Anjala Mary), International Journal of Novel Research and Development (IJNRD), Volume 11 Issue 3, published 19th March 2026.",
    year: 2026
  },
  {
    faculty_name: "Jasmine V",
    title: "Using Generative AI in Manuscript Preparation",
    description: "Researcher Academy (Elsevier) Certificate of Completion, presented by Dr. Inez van Korlaar, completed on 6th August 2026.",
    year: 2026
  },
  {
    faculty_name: "Jasmine V",
    title: "The Evolution of Data Visualization",
    description: "Researcher Academy (Elsevier) Certificate of Completion, presented by Dr Robert Kosara, completed on 6th August 2026.",
    year: 2026
  },
  {
    faculty_name: "Jasmine V",
    title: "Three Contexts for Data Visualisation",
    description: "Researcher Academy (Elsevier) Certificate of Completion, presented by Dr Robert Kosara, completed on 6th August 2026.",
    year: 2026
  },
  {
    faculty_name: "Aron Christy X",
    title: "Resource Person – State Level Workshop on Emergency Care Nursing Procedures",
    description: "Certificate from SRM Trichy College of Nursing for serving as Organizing Committee Member/Secretary and Resource Person/Delegate for the State Level Workshop on “Emergency Care Nursing Procedures” held on 30.01.2026, awarded 8 Credit Hours by the Tamil Nadu Nurses & Midwives Council.",
    year: 2026
  },
  {
    faculty_name: "Maria Ieela A",
    title: "Advancing Excellence in Nursing Practice – Quality Improvement and Patient Safety in Nursing Practice",
    description: "Certificate of Participation in the webinar, organised by ITM College of Nursing, ITM SLS Baroda University, Vadodara, Gujarat, on 04.08.2026.",
    year: 2026
  },
  {
    faculty_name: "Senthilrajan S",
    title: "Enhancing Soft Skills and Personality",
    description: "NPTEL-AICTE Faculty Development Programme (funded by the MoE, Govt. of India) certificate for successfully completing the 8-week course with a consolidated score of 81%, February–April 2026.",
    year: 2026
  },
  {
    faculty_name: "Sarmila A",
    title: "Electrocardiogram – Interpretation and Application in Clinical Practice",
    description: "NPTEL-AICTE Faculty Development Programme (funded by the MoE, Govt. of India) certificate for successfully completing the 4-week course with a consolidated score of 50%, July–August 2024.",
    year: 2024
  },
  {
    faculty_name: "Sarmila A",
    title: "Unlocking Grant Success with Funding Institutional",
    description: "Researcher Academy (Elsevier) Certificate of Completion for the 43-minute module, presented by Zsófia Büttel, completed on 29th December 2024.",
    year: 2024
  },
  {
    faculty_name: "Sarmila A",
    title: "Certificate in Integrative Palliative Care – 3",
    description: "NPTEL Online Certification (Elite), IIT Kanpur, for successfully completing the 12-week course with a consolidated score of 97%, January–April 2025.",
    year: 2025
  },
  {
    faculty_name: "Sarmila A",
    title: "Caring for Patients with Haemorrhagic Shock",
    description: "Certificate of Completion (WCEA / Royal College of Nursing, authored by Elizabeth Gallimore), 1 credit hour, exam score 7/10, completed on 5th April 2025.",
    year: 2025
  },
  {
    faculty_name: "Sarmila A",
    title: "Walking the Path in Prevention: A Study on Foot Care Knowledge and Self-Efficacy Among Diabetics in Trichy",
    description: "Certificate of Publication (co-authored with Abirami K), International Journal of Innovative Research in Technology (IJIRT), Volume 12 Issue 3, published August 2025.",
    year: 2025
  },
  {
    faculty_name: "Sarmila A",
    title: "Management of Medical Emergencies in Dental Practice",
    description: "NPTEL Online Certification (Elite), IIT Madras, for successfully completing the 8-week course with a consolidated score of 88%, January–March 2026.",
    year: 2026
  },
  {
    faculty_name: "Sarmila A",
    title: "Resource Person – State Level Workshop on Emergency Care Nursing Procedures",
    description: "Certificate from SRM Trichy College of Nursing for serving as Organizing Committee Member/Secretary and Resource Person/Delegate for the State Level Workshop held on 30.01.2026, awarded 10 Credit Hours by the Tamil Nadu Nurses & Midwives Council.",
    year: 2026
  },
  {
    faculty_name: "Sarmila A",
    title: "Resource Person – Soft Skills and Personality Development",
    description: "Certificate of Participation from Prem Institute of Medical Sciences / Ved Nursing College, Baroli, Panipat, Haryana, for serving as Resource Person in the short-term course, organised in collaboration with GINRA Foundation, held 9th–12th March 2026.",
    year: 2026
  },
  {
    faculty_name: "Sarmila A",
    title: "Guest Speaker – GUNI-KBION Infection Prevention and Control Practices for Nursing Professionals",
    description: "Certificate of Appreciation for contributing as Guest Speaker on “Infection Prevention in Health Care Workers” on 13.03.2026, organised by Ganpat University – Kumud & Bhupesh Institute of Nursing in collaboration with ECHO India.",
    year: 2026
  },
  {
    faculty_name: "Sarmila A",
    title: "Best Women Faculty Award",
    description: "Awarded by J K Baria Foundation & GINRA Foundation in recognition of exceptional contribution, dedication, and excellence in Nursing Education and Academic Leadership, dated 30.05.2026.",
    year: 2026
  },
  {
    faculty_name: "Abirami K",
    title: "Walking the Path in Prevention: A Study on Foot Care Knowledge and Self-Efficacy Among Diabetics in Trichy",
    description: "Certificate of Publication (co-authored with Sarmila A), International Journal of Innovative Research in Technology (IJIRT), Volume 12 Issue 3, published August 2025.",
    year: 2025
  },
  {
    faculty_name: "A. Bebina Vincia Anjala Mary",
    title: "State Level Webinar – Adolescent Health: Pertaining to Menstrual Problem",
    description: "Certificate of Participation, organised by SRM Trichy College of Nursing, held on 23.07.2022.",
    year: 2022
  },
  {
    faculty_name: "A. Bebina Vincia Anjala Mary",
    title: "Resource Person – State Level Workshop on Revamping Critical Care Nursing Skills",
    description: "Certificate from SRM Trichy College of Nursing for serving as Delegate/Organizer/Resource Person, held on 16th September 2022, awarded 8 Credit Hours by the Tamil Nadu Nurses & Midwives Council.",
    year: 2022
  },
  {
    faculty_name: "A. Bebina Vincia Anjala Mary",
    title: "A Study to Determine the Knowledge on PCOS Among …",
    description: "Certificate of Publication (co-authored with Dr. Suja Suresh and Ms. Tifani), International Journal of Research and Analytical Reviews (IJRAR), Volume 10 Issue 2, published 24th April 2023.",
    year: 2023
  },
  {
    faculty_name: "A. Bebina Vincia Anjala Mary",
    title: "Basic Life Support",
    description: "Continuing Nursing Education (CNE) online module certificate, Impetus Healthcare Skills / Tamil Nadu Nurses & Midwives Council, 8 credit hours, completed 02.05.2024.",
    year: 2024
  },
  {
    faculty_name: "A. Bebina Vincia Anjala Mary",
    title: "Menstrual Blood Banking – “Best Out of Waste Concept”",
    description: "Certificate of Publication (co-authored with Dr. Suja Suresh and Devi K), International Journal of Research and Analytical Reviews (IJRAR), Volume 11 Issue 4, published 20th December 2024.",
    year: 2024
  },
  {
    faculty_name: "A. Bebina Vincia Anjala Mary",
    title: "International Medical Conference – FOM 2.0 “Excel and Educate 2025”",
    description: "Certificate of Participation, Department of Health and Family Welfare (Govt. of Tamil Nadu) & The Tamil Nadu Dr. M.G.R. Medical University, held at Chennai Trade Center, 16th–18th October 2025, awarded 30 credit points.",
    year: 2025
  },
  {
    faculty_name: "A. Bebina Vincia Anjala Mary",
    title: "Trichy SRM Run 2025",
    description: "Certificate of Participation for completing 5km/10km, organised by SRM Group of Institutions, Trichy, on account of World Heart Day & Pink October.",
    year: 2025
  },
  {
    faculty_name: "A. Bebina Vincia Anjala Mary",
    title: "Assess the Knowledge on Menopausal Self-care among Perimenopausal Women",
    description: "Certificate of Presentation (as Ph.D Scholar, Saveetha University) at the Global Multidisciplinary Research & Innovation Summit 2026 (G-MRI 2026), organised by Saveetha College of Nursing, SIMATS, Chennai, on 30th January 2026.",
    year: 2026
  },
  {
    faculty_name: "A. Bebina Vincia Anjala Mary",
    title: "A Study to Determine the Knowledge on Breast Cancer Among Students",
    description: "Certificate of Publication (co-authored with Dr. Suja Suresh and Devi), International Journal of Novel Research and Development (IJNRD), Volume 11 Issue 3, published 19th March 2026.",
    year: 2026
  },
  {
    faculty_name: "A. Bebina Vincia Anjala Mary",
    title: "Delegate – National Conference “Beyond Boundaries: Re-Imagining Mixed Methods Research Methodology”",
    description: "Certificate of Participation, organised by Ganga College of Nursing, Coimbatore, on 12.06.2026, accredited with 8 CNE Credit Hours by the Tamil Nadu Nurses and Midwives Council, Chennai.",
    year: 2026
  },
  {
    faculty_name: "A. Bebina Vincia Anjala Mary",
    title: "EBSCO Training – MGR-EBSCO Nursing Collection (CINAHL)",
    description: "Certificate of Completion, EBSCO Information Services, completed at SRM Trichy College of Nursing on 22.07.2026.",
    year: 2026
  },
  {
    faculty_name: "A. Bebina Vincia Anjala Mary",
    title: "TerraNova’26 – Sustainability Day Celebration",
    description: "Certificate of Achievement from SRM Trichy College of Nursing for pledging to take action to elevate the level of sustainable development in line with the Sustainable Development Goals.",
    year: 2026
  },
  {
    faculty_name: "Ms. Tifani",
    title: "A Study to Determine the Knowledge on PCOS Among …",
    description: "Certificate of Publication (co-authored with Dr. Suja Suresh and A. Bebina Vincia Anjala Mary), International Journal of Research and Analytical Reviews (IJRAR), Volume 10 Issue 2, published 24th April 2023.",
    year: 2023
  },
  {
    faculty_name: "Selvanisha",
    title: "Step-by-step Guide to Publishing Your Research",
    description: "Researcher Academy (Elsevier) Certificate of Completion, presented by Navaneethan Swamy, completed on 8th September 2025.",
    year: 2025
  }
];

// Helper to seed publications if collection is empty
const ensureSeeded = async () => {
  const count = await Publication.countDocuments();
  if (count === 0) {
    const docs = DEFAULT_RECORDS.map((r, i) => ({
      ...r,
      sno: i + 1,
      institution: "SRM TRICHY COLLEGE OF NURSING",
      document_title: "FACULTY PUBLICATIONS & CERTIFICATIONS",
      status: "active"
    }));
    await Publication.insertMany(docs);
  }
};

// GET all publications
exports.getAllPublications = async (req, res) => {
  try {
    await ensureSeeded();

    const { status, year, faculty, search } = req.query;
    let filter = {};

    if (status && status !== "All") {
      filter.status = status;
    }
    if (year && year !== "all") {
      filter.year = Number(year);
    }
    if (faculty) {
      filter.faculty_name = new RegExp(faculty, "i");
    }
    if (search) {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { faculty_name: new RegExp(search, "i") },
        { description: new RegExp(search, "i") }
      ];
    }

    const publications = await Publication.find(filter).sort({ year: -1, createdAt: -1 });
    res.status(200).json({
      success: true,
      institution: "SRM TRICHY COLLEGE OF NURSING",
      document_title: "FACULTY PUBLICATIONS & CERTIFICATIONS",
      total: publications.length,
      publications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch publications", error: error.message });
  }
};

// GET publication by ID
exports.getPublicationById = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);
    if (!publication) {
      return res.status(404).json({ success: false, message: "Publication not found" });
    }
    res.status(200).json({ success: true, publication });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch publication", error: error.message });
  }
};

// CREATE publication
exports.createPublication = async (req, res) => {
  try {
    const { faculty_name, title, description, year, status, institution, document_title } = req.body;
    
    if (!faculty_name || !title || !year) {
      return res.status(400).json({ success: false, message: "Faculty name, title, and year are required" });
    }

    const count = await Publication.countDocuments();

    const publication = new Publication({
      faculty_name: faculty_name.trim(),
      title: title.trim(),
      description: description ? description.trim() : "",
      year: Number(year),
      status: status || "active",
      institution: institution || "SRM TRICHY COLLEGE OF NURSING",
      document_title: document_title || "FACULTY PUBLICATIONS & CERTIFICATIONS",
      sno: count + 1
    });

    await publication.save();
    res.status(201).json({ success: true, message: "Publication created successfully", publication });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create publication", error: error.message });
  }
};

// UPDATE publication
exports.updatePublication = async (req, res) => {
  try {
    const { faculty_name, title, description, year, status, institution, document_title } = req.body;

    const publication = await Publication.findByIdAndUpdate(
      req.params.id,
      {
        faculty_name,
        title,
        description,
        year: year ? Number(year) : undefined,
        status,
        institution,
        document_title
      },
      { new: true, runValidators: true }
    );

    if (!publication) {
      return res.status(404).json({ success: false, message: "Publication not found" });
    }

    res.status(200).json({ success: true, message: "Publication updated successfully", publication });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update publication", error: error.message });
  }
};

// DELETE publication
exports.deletePublication = async (req, res) => {
  try {
    const publication = await Publication.findByIdAndDelete(req.params.id);
    if (!publication) {
      return res.status(404).json({ success: false, message: "Publication not found" });
    }
    res.status(200).json({ success: true, message: "Publication deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete publication", error: error.message });
  }
};

// SEED publications (re-populate or reset)
exports.seedPublications = async (req, res) => {
  try {
    await Publication.deleteMany({});
    const docs = DEFAULT_RECORDS.map((r, i) => ({
      ...r,
      sno: i + 1,
      institution: "SRM TRICHY COLLEGE OF NURSING",
      document_title: "FACULTY PUBLICATIONS & CERTIFICATIONS",
      status: "active"
    }));
    await Publication.insertMany(docs);
    res.status(200).json({ success: true, message: "Successfully seeded default publications", count: docs.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to seed publications", error: error.message });
  }
};
