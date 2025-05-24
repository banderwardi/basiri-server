import * as documents from "../controllers/document.controller.js"
import express, { json, urlencoded } from "express";
import cors from "cors";

export function setRouter(){
    
    const app = express();

    var corsOptions = {
    origin: "http://localhost:8081"
    };

    app.use(cors(corsOptions));


    // parse requests of content-type - application/json
    app.use(json());

    // parse requests of content-type - application/x-www-form-urlencoded
    app.use(urlencoded({ extended: true }));

    // Create a new Documents
    app.post("/api/collection/", (req, res) => documents.create(req, res))
    
    // Retrieve all Documents
    app.get("/api/collection/", (req, res) => documents.findAll(req, res))
    
    // Retrieve all published Documents
    app.get("/api/collection/published", (req, res) => documents.findAllPublished(req, res))
    
    // Retrieve a single Documents with id
    app.get("/api/collection/:id", (req, res) => documents.findOne(req, res))
    
    // Update a Documents with id
    app.put("/api/collection/:id", (req, res) => documents.update(req, res))
    
    // Delete a Documents with id
    app.delete("/api/collection/:id", (req, res) => documents.delete(req, res))
    
    // Delete all 
    app.delete("/api/collection/:id", (req, res) => documents.deleteAll(req, res))
    
    console.log('router')
}