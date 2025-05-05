const File = require('../models/file');
const User = require('../models/user');

const path = require('path');
const fs = require('fs');

exports.uploadWithMongoDB = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).send('No file was uploaded.');
    }

    try {
        const { course, professor, description } = req.body;

        if (!course || !professor || !description) {
            return res.status(400).send('Missing required fields: course, professor, or description.');
        }

        const fileData = new File({
            filename: req.file.filename,
            filepath: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size,
            course,
            professor,
            description,
            uploader: req.session.user._id
        });

        await fileData.save();
        console.log('File metadata saved to MongoDB:', fileData);

        return res.redirect("/notes/upload?success=true");
    } catch (dbError) {
        console.error('Database error:', dbError);
        return res.status(500).send('Internal Server Error');
    }
};

exports.search = async (req, res) => {
    const searchQuery = req.query.q || "";
    try {
        const results = await File.find({
            $or: [
                { filename: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search in filename
                { course: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search in course
                { professor: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search in professor
                { description: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search in description
            ],
        });

        // Render the search page with the results
        res.render("notes/search", { results, searchQuery });
    } catch (err) {
        console.error("Error searching files:", err.message);
        res.status(500).send("Internal Server Error");
    }
};

//GET /notes/preview/:id - send details of note identified by id
exports.preview = async (req, res, next) => {
    const id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        const err = new Error('Invalid file id');
        err.status = 400;
        return next(err);
    }

    try {
        const file = await File.findById(id).populate('uploader', 'firstname lastname');
        if (!file) {
            const err = new Error('Cannot find file with id: ' + id);
            err.status = 404;
            return next(err);
        }

        const filePath = path.join(__dirname, '../public/uploads/documents/', file.filename);
        const fileExists = fs.existsSync(filePath); // Sync is fine for this one-off check

        res.render('notes/preview', {
            file,
            currentUserId: req.session?.user || null,
            fileExists
        });
    } catch (err) {
        next(err);
    }
};

