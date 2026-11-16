const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDataBase = require("./config/DBConfig");
const newsLetterRoutes = require('./route/newsLetter')
const leadershipRoutes = require('./route/leaderShip')
const sliderRoutes = require('./route/Slider')
const eventRoutes = require('./route/events')
const publicationRoutes = require('./route/publication')
const contactRoutes = require('./route/contact')
const departmentRoutes = require('./route/department')
const enquiryDepartmentRoutes = require('./route/enquiryDepartment')
const achievementRoutes = require('./route/achievement')
const clubRoutes = require('./route/club')
const greenCampusRoutes = require('./route/greenCampus')
const authRoutes = require('./route/auth')
const path = require('path')
const app = express();
const port = process.env.PORT || 5000;

connectDataBase()
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api/auth', authRoutes)
app.use('/api/newsletter', newsLetterRoutes)
app.use('/api/statutes', require('./route/statutes'))
app.use('/api/affiliation', require('./route/affiliation'))
app.use('/api/leadership', leadershipRoutes)
app.use('/api/slider', sliderRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/publication', publicationRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/enquiry', contactRoutes)
app.use('/api/departments', departmentRoutes)
app.use('/api/academic-departments', departmentRoutes)
app.use('/api/enquiry-departments', enquiryDepartmentRoutes)
app.use('/api/enquiry-department', enquiryDepartmentRoutes)
app.use('/api/department', enquiryDepartmentRoutes)
app.use('/api/achievement', achievementRoutes)
app.use('/api/clubs', clubRoutes)
app.use('/api/green-campus', greenCampusRoutes);
app.use('/api/facilities', require('./route/facility'));
app.use('/api/code-of-conduct', require('./route/codeOfConduct'));
app.use('/api/placements', require('./route/placement'));
app.use('/api/courses', require('./route/course'));
app.use('/api/course', require('./route/course'));
app.use('/api/student-achievements', (req, res, next) => { req.achievementType = 'student'; next(); }, achievementRoutes)
app.use('/api/faculty-achievements', (req, res, next) => { req.achievementType = 'faculty'; next(); }, achievementRoutes)
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
