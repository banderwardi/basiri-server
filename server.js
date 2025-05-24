import express, { json, urlencoded } from "express";
import * as documents from "./app/controllers/document.controller.js"
import * as entries from "./app/controllers/entry.controller.js"
import "./app/controllers/auto.controller.js";
import cors from "cors";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
const app = express();

var corsOptions = {
  origin: '*'
};

app.use(cors(corsOptions));


// parse requests of content-type - application/json
app.use(json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Rest Nodejs application." });
});

// Get the directory name for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const filename = file.fieldname + '-' + Date.now() + '.jpg';
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint to handle file upload
app.post('/upload', upload.single('image'), (req, res) => {
  const filePath = path.join('uploads', req.file.filename);
  res.json({ message: 'File uploaded successfully!', path: filePath });
});


// Get count of documents
app.put("/api/collection/count", (req, res) => documents.getCount(req, res))

// create Document
app.post("/api/collection/", (req, res) => documents.create(req, res))
    
// Retrieve all Documents
app.get("/api/collection/all", (req, res) => documents.findAll(req, res))

// Retrieve specific Documents
app.post("/api/collection/multi", (req, res) => documents.multi(req, res))

// Retrieve specific Documents with aggregate
app.post("/api/collection/aggregate", (req, res) => documents.aggregate(req, res))

// Retrieve and sort specific Documents
app.post("/api/collection/sort", (req, res) => documents.sort(req, res))

// Retrieve a single Document
app.post("/api/collection/one", (req, res) => documents.findOne(req, res))

// Watch a single Document
app.post("/api/collection/watchOne", (req, res) => documents.watchOne(req, res))

// Update a Documents with id
app.put("/api/collection/", (req, res) => documents.update(req, res))

// Delete a Documents with id
app.post("/api/collection/delete", (req, res) => documents.delete(req, res))

// Delete all 
app.delete("/api/collection/:id", (req, res) => documents.deleteAll(req, res))



app.post("/api/entry/addEntry", (req, res) => entries.addEntry(req, res))

app.post("/api/entry/getEntries", (req, res) => entries.getEntries(req, res))

app.post("/api/entry/getLedger", (req, res) => entries.getLedger(req, res))

app.post("/api/entry/getBalanceSheet", (req, res) => entries.getBalanceSheet(req, res))




// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
