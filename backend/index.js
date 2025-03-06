const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const questionRoutes = require('./routes/questionRoutes');
const examTemplateRoutes = require('./routes/examTemplateStructureRoutes');
const examRoutes = require('./routes/examRoutes');
const subjectRoutes = require('./routes/subject');
const listOfKnowledgeRoutes = require('./routes/listOfKnowledge');
const searchRoutes = require('./routes/searchRoutes');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Express.js backend!');
});

app.use('/api/subjects', subjectRoutes);
app.use('/api/listOfKnowledge', listOfKnowledgeRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/exam-templates', examTemplateRoutes);
app.use('/api/exams', examRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
