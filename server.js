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
const achievementRoutes = require('./route/achievement')
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
app.use('/api/leadership', leadershipRoutes)
app.use('/api/slider', sliderRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/publication', publicationRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/enquiry', contactRoutes)
app.use('/api/department', departmentRoutes)
app.use('/api/achievement', achievementRoutes)
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
