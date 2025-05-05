const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const model = require('../models/file');

const express = require('express');
const router = express.Router();
const controller = require('../controllers/noteController');
const { isProf, isGuest, isLoggedIn } = require('../middlewares/auth');
// const { validateId, validateItem } = require('../middlewares/validator');

const documentDir = path.join(__dirname, '../public/uploads/documents');

try {
    if (!fs.existsSync(documentDir)) {
        fs.mkdirSync(documentDir, { recursive: true });
    }
} catch (err) {
    console.error('Error creating upload directory:', err.message);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, documentDir);
    },
    filename: (req, file, cb) => {
        const prefix = 'document-';
        cb(null, prefix + Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF, DOC, and DOCX files are allowed.'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 100 }, // 100 MB limit
    fileFilter: fileFilter,
});

//GET /notes/preview/:id - send details of item identified by id
router.get('/preview/:id', isLoggedIn, controller.preview);

//POST /notes/upload - create a new item 
router.post('/upload', upload.single('noteFile'), controller.uploadWithMongoDB);

router.get("/search", isLoggedIn, async (req, res) => {
    const searchQuery = req.query.q || "";
    try {
        const results = await model.find({
            $or: [
                { filename: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search in filename
                { course: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search in course
                { professor: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search in professor
                { description: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search in description
            ],
        });

        // render the search page with the results
        res.render("notes/search", { results, searchQuery });
    } catch (err) {
        console.error("Error searching files:", err.message);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/reports", isLoggedIn, isProf, (req, res) => {
    res.render("notes/reports");
});

router.get("/upload", isLoggedIn, (req, res) => {
    res.render("notes/upload");
});

module.exports = router;