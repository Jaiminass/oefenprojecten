const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const http = require("http");

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });

app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(express.static("public"));

const db = mysql.createConnection({
  host: "localhost",
  user: "xxxxx",
  password: "xxxxxx!", // jouw wachtwoord
  database: "dojawerk"
});

db.connect(err => { if(err) throw err; console.log("Database verbonden"); });

const JWT_SECRET = "mijn_super_geheime_key";

// Multer voor foto upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now()+path.extname(file.originalname))
});
const upload = multer({ storage });

// --- Routes ---

// Registratie
app.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  if(!name||!email||!password||!role) return res.status(400).json({message:"Vul alle velden in"});

  try{
    const hashed = await bcrypt.hash(password,10);
    db.query(
      "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
      [name,email,hashed,role],
      (err)=>{ 
        if(err){ if(err.code==="ER_DUP_ENTRY") return res.status(400).json({message:"Email bestaat al"}); 
        return res.status(500).json({message:"Database fout"});}
        res.json({message:"Registratie succesvol"});
      }
    );
  } catch(err){ res.status(500).json({message:"Server fout"});}
});

// Login
app.post("/login",(req,res)=>{
  const {email,password} = req.body;
  db.query("SELECT * FROM users WHERE email=?",[email],async (err,results)=>{
    if(err) return res.status(500).json({message:"Database fout"});
    if(results.length===0) return res.status(400).json({message:"Gebruiker niet gevonden"});
    const user = results[0];
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) return res.status(400).json({message:"Onjuist wachtwoord"});

    const token = jwt.sign({id:user.id,role:user.role,name:user.name,email:user.email},JWT_SECRET,{expiresIn:"1h"});
    res.json({message:"Login succesvol", token, userId:user.id, role:user.role});
  });
});

// Upload foto
app.post("/upload", upload.single("photo"), (req,res)=>{
  const token = req.headers["authorization"];
  if(!token) return res.status(401).json({message:"Geen token"});
  try{
    const decoded = jwt.verify(token,JWT_SECRET);
    const photoUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    db.query("UPDATE users SET photoUrl=? WHERE id=?",[photoUrl,decoded.id],(err)=>{
      if(err) return res.status(500).json({message:"Database fout"});
      res.json({message:"Foto geüpload", photoUrl});
    });
  }catch(err){ res.status(401).json({message:"Ongeldige token"});}
});

// Profiel update
app.put("/profile/update",(req,res)=>{
  const token = req.headers["authorization"];
  if(!token) return res.status(401).json({message:"Geen token"});
  try{
    const decoded = jwt.verify(token,JWT_SECRET);
    const {bio,service} = req.body;
    db.query("UPDATE users SET bio=?,service=? WHERE id=?",[bio,service,decoded.id],(err)=>{
      if(err) return res.status(500).json({message:"Database fout"});
      res.json({message:"Profiel bijgewerkt"});
    });
  }catch(err){ res.status(401).json({message:"Ongeldige token"});}
});

// Alle profielen
app.get("/profiles",(req,res)=>{
  db.query("SELECT id,name,email,photoUrl,bio,service,role FROM users",(err,results)=>{
    if(err) return res.status(500).json({message:"Database fout"});
    res.json(results);
  });
});

// Profiel detail
app.get("/profile/:id",(req,res)=>{
  const userId = req.params.id;
  db.query("SELECT id,name,email,photoUrl,bio,service,role FROM users WHERE id=?",[userId],(err,results)=>{
    if(err) return res.status(500).json({message:"Database fout"});
    if(results.length===0) return res.status(404).json({message:"Gebruiker niet gevonden"});
    res.json(results[0]);
  });
});

// Projecten
app.get("/projects",(req,res)=>{
  db.query("SELECT * FROM projects",(err,results)=>{
    if(err) return res.status(500).json({message:"Database fout"});
    res.json(results);
  });
});

app.post("/projects",(req,res)=>{
  const token = req.headers["authorization"];
  if(!token) return res.status(401).json({message:"Geen token"});
  try{
    const decoded = jwt.verify(token,JWT_SECRET);
    const {title,description,category,budget,deadline} = req.body;
    db.query(
      "INSERT INTO projects (title,description,category,budget,deadline,userId) VALUES (?,?,?,?,?,?)",
      [title,description,category,budget,deadline,decoded.id],
      err=>{
        if(err) return res.status(500).json({message:"Database fout"});
        res.json({message:"Project geplaatst"});
      }
    );
  }catch(err){ res.status(401).json({message:"Ongeldige token"});}
});

// --- Socket.IO voor privéchat ---
io.on("connection", socket=>{
  console.log("Nieuwe gebruiker verbonden:", socket.id);

  socket.on("joinRoom", userId => { socket.join(userId); });

  socket.on("sendMessage", data=>{
    io.to(data.toId).to(data.fromId).emit("receiveMessage",data);
  });

  socket.on("disconnect", ()=>{ console.log("Gebruiker losgekoppeld:", socket.id); });
});

// Start server
server.listen(3000,()=>console.log("Server gestart op http://localhost:3000"));

