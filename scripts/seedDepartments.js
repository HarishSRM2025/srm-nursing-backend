const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const AcademicDepartment = require('../models/academicDepartment');

const DEPARTMENTS = [
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

async function seed() {
  const uri = process.env.DBURL;
  if (!uri) {
    console.error('Error: DBURL environment variable not found in .env');
    process.exit(1);
  }

  try {
    console.log('Connecting to database...');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');

    for (const dept of DEPARTMENTS) {
      await AcademicDepartment.findOneAndUpdate(
        { deptId: dept.deptId },
        { $set: dept },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
      console.log(`✓ Seeded/Updated department: ${dept.title} (${dept.deptId})`);
    }

    console.log(`All ${DEPARTMENTS.length} academic departments successfully seeded!`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

