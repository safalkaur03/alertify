const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");

require("dotenv").config();
const mongoose = require("mongoose");

const app=express();
app.use(cors()); 
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch((err) => console.log("DB Error:", err));

const Admin = require("./models/Admin");

app.get("/",function(req,res){
    res.send("backend running");
});

app.post("/adminregister", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({ name, email,password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({
      message: "Admin registered successfully",
      admin: newAdmin
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/adminlogin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    // 🔐 Compare password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token:token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/admindashboard", auth, (req, res) => {
  res.json({
    message: "Welcome to Admin Dashboard",
    adminId: req.admin.id
  });
});

app.get("/api/admins",(req,res)=> {
    res.json(admins);
})

app.listen(5000,function(){
    console.log("server started on port 5000")
});