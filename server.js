
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Student = require("./models/Student");

dotenv.config();

const app = express();

app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Add student
app.post("/students", async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json({ message: "Student Added Successfully" });
    } catch (err) {
        res.status(400).json({
            message: err.code === 11000
                ? "Roll Number Already Exists"
                : err.message
        });
    }
});

// View students
app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search students
app.get("/students/search", async (req, res) => {
    try {
        const { rollNo, name } = req.query;

        if (!rollNo && !name) {
            return res.status(400).json({
                message: "Enter roll number or name"
            });
        }

        const filter = rollNo
            ? { rollNo }
            : { name: { $regex: name, $options: "i" } };

        const students = await Student.find(filter);
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update student
app.put("/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ message: "Student Not Found" });
        }

        res.json({ message: "Student Updated Successfully", student });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete student
app.delete("/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student Not Found" });
        }

        res.json({ message: "Student Deleted Successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start server
async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected Successfully");

        app.listen(process.env.PORT || 5000, () => {
            console.log("Server running at http://localhost:5000");
        });
    } catch (error) {
        console.log("Database Connection Error:", error.message);
    }
}

startServer();
