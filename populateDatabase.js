const mongoose = require("mongoose");
const File = require("./models/file");
const User = require("./models/user");

const mongoUri = "mongodb://localhost:27017/NoteNest";

async function populateDatabase() {
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // test user
    let testUser = await User.findOne({ email: "test@gmail.com" });
    if (!testUser) {
        testUser = await User.create({
            firstname: "John",
            lastname: "Doe",
            email: "test@gmail.com",
            password: "changeme",
        });
    }

    // remove this line to preserve upload/user data
    await File.deleteMany({});
    await User.deleteMany({});

    // new files
    const sampleFiles = [
        {
            filename: "cybersecurity-advocates.pdf",
            filepath: "/uploads/documents/cybersecurity-advocates.pdf",
            mimetype: "application/pdf",           
            size: 298496,
            course: "Usable Security and Privacy",
            professor: "Erikson",
            description: "Required report template for project 3",
            thumbnail: "/images/notes_paper.jpg",
            uploader: testUser._id,
        },
        {
            filename: "History-Revision-Renaissance.pdf",
            filepath: "/uploads/documents/History-Revision-Renaissance.jpg",
            mimetype: "application/pdf",
            size: 323584,
            course: "History of Art",
            professor: "Williams",
            description: "Overview of Renaissance art",
            thumbnail: "/images/notes_paper.jpg",
            uploader: testUser._id,
        },
    ];
    await File.insertMany(sampleFiles);
    console.log("Sample data inserted with uploader:", testUser._id);

    await mongoose.connection.close();
}

populateDatabase().catch(err => {
    console.error("Failed to seed database:", err);
    process.exit(1);
});


//OLD VER


// const mongoose = require("mongoose");
// const File = require("./models/file");
// // const User = require("./models/user");

// // MongoDB connection URI
// const mongoUri = "mongodb://localhost:27017/NoteNest";

// // Sample user to populate the database
// let testUser = await User.findOne({ email: "test@example.com" });
// if (!testUser) {
//   testUser = await User.create({
//     firstname: "John",
//     lastname: "Doe",
//     email: "test@example.com",
//     password: "changeme",
//     prof: false
//   });
// }


// // Sample data to populate the database
// const sampleFiles = [
//   {
//     filename: "sample1.pdf",
//     filepath: "/uploads/documents/sample1.pdf",
//     mimetype: "application/pdf",
//     size: 102400,
//     course: "Intro to Computer Science",
//     professor: "Smith",
//     description: "Lecture notes for week 1",
//     thumbnail: "/images/notes_paper.png", // Placeholder for non-image files
//     uploader: req.session.user._id,
//   },
//   {
//     filename: "sample3.docx",
//     filepath: "/uploads/documents/sample3.docx",
//     mimetype: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     size: 512000,
//     course: "History of Art",
//     professor: "Williams",
//     description: "Essay on Renaissance art",
//     thumbnail: "/images/notes_paper.png", // Placeholder for non-image files
//     uploader: req.session.user._id,
//   },
// ];

// async function populateDatabase() {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(mongoUri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("Connected to MongoDB");

//     // Clear existing data
//     await File.deleteMany({});
//     console.log("Cleared existing data");

//     // Insert sample data
//     await File.insertMany(sampleFiles);
//     console.log("Sample data inserted successfully");

//     // Close the connection
//     await mongoose.connection.close();
//     console.log("Database connection closed");
//   } catch (err) {
//     console.error("Error populating the database:", err.message);
//   }
// }

// populateDatabase();