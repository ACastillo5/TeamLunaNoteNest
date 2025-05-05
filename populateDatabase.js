//Running file this is no longer necessary, users and files should already exist within the database. 
//The file is kept inside the project for the sake of archival but should NOT need to be run.





// const mongoose = require("mongoose");
// const File = require("./models/file"); // Adjust the path to your File model

// // MongoDB connection URI
// const mongoUri = "mongodb://localhost:27017/NoteNest";

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
//     uploader: new mongoose.Types.ObjectId(),
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
//     uploader: new mongoose.Types.ObjectId(),
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