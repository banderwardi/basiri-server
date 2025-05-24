import { db } from "../models/index.js";

//  Get count of documents
export function getCount(req, res) {
    if (!req || !req.body.filter) {
        return res.sendStatus(400).send({
          message: "Data can not be empty!"
        });
    }
    db.collection(req.body.collection).countDocuments(req.body.filter)
        .then(data => {
            res.json({count: data})
        })
        .catch(err => {
        res.sendStatus(500).send({
            message:
            err.message || "Some error occurred while updating Document."
        });
    });
}

// Create and Save a new Document
export function create(req, res) {
    if (!req.body.data) {
        return res.sendStatus(400).send({
          message: "Data can not be empty!"
        });
    }
    db.collection(req.body.collection).insertOne(req.body.data)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.sendStatus(500).send({
                message:
                err.message || "Some error occurred while inserting Document."
            });
    });
}

// Retrieve all Documents from the database.
export function findAll(req, res) {
    res.send([{name: db.secondaryOk}]);
    if (!req || !req.body.collection) {
        return res.sendStatus(400).send({
          message: "Data can not be empty!"
        });
    }
    db.collection('users').find({}).toArray()
        .then(data => {
        res.send(data);
        })
        .catch(err => {
        res.sendStatus(500).send({
            message:
            err.message || "Some error occurred while retrieving Documents."
        });
    });
}

// Retrieve multi Documents from the database.
export function multi(req, res) {
    if (!req.body.collection) {
        return res.sendStatus(400).send({
          message: "Data can not be empty!"
        });
    }
    db.collection(req.body.collection).find(req.body.filter).toArray()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
        res.sendStatus(500).send({
            message:
            err.message || "Some error occurred while retrieving Documents."
        });
    });
}

// Retrieve multi Documents from the database.
export function aggregate(req, res) {
    if (!req.body.collection) {
        return res.sendStatus(400).send({
          message: "Data can not be empty!"
        });
    }
    let q = db.collection(req.body.collection).aggregate(req.body.aggregate)
    q.toArray().then(data => {
            res.send(data);
        })
        .catch(err => {
            res.sendStatus(500).send({
                message:
                err.message || "Some error occurred while retrieving Documents."
            });
    }   );
}

// Retrieve and sort specific Documents
export function sort(req, res) {
    if (!req.body.collection) {
        return res.sendStatus(400).send({
            message: "Data can not be empty!"
        });
    }
    db.collection(req.body.collection).find(req.body.filter).sort(req.body.sort).toArray()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
        res.sendStatus(500).send({
            message:
            err.message || "Some error occurred while retrieving Documents."
        });
    });
}

// Find a single Document with an id
export function findOne(req, res) {
    if (!req || !req.body.filter) {
        return res.sendStatus(400).send({
          message: "Data can not be empty!"
        });
    }
    db.collection(req.body.collection).findOne(req.body.filter)
        .then(data => {
        res.send(data);
        })
        .catch(err => {
        res.sendStatus(500).send({
            message:
            err.message || "Some error occurred while retrieving Documents."
        });
    }); 
}


// watch a single Document
export function watchOne(req, res) {
    if (!req || !req.body.filter) {
        return res.sendStatus(400).send({
          message: "Data can not be empty!"
        });
    }
    db.collection('users').findOne(req.body.filter)
        .then(data => {
        res.send(data);
        })
        .catch(err => {
        res.sendStatus(500).send({
            message:
            err.message || "Some error occurred while retrieving Documents."
        });
    });
}

// Update a Document by the id in the request
export function update(req, res) {
    if (!req.body.data) {
        return res.sendStatus(400).send({
          message: "Data can not be empty!"
        });
    }
    db.collection(req.body.collection).updateOne(req.body.filter, req.body.data, req.body.arrayFilter)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.sendStatus(500).send({
                message:
                err.message || "Some error occurred while updating Document."
            });
        });
}

// Delete a Document with the specified id in the request
const _delete = (req, res) => {
    if (!req.body.filter) {
        return res.sendStatus(400).send({
          message: "Data can not be empty!"
        });
    }
    db.collection(req.body.collection).deleteOne(req.body.filter)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.sendStatus(500).send({
                message:
                err.message || "Some error occurred while updating Document."
            });
        });
};
export { _delete as delete };

// Delete all Documents from the database.
export function deleteAll(req, res) {
  
}

// Find all published Documents
export function findAllPublished(req, res) {
  
}



// Find a single Document with an id
export function login(req, res) {
    if (!req || !req.body.username) {
        return res.sendStatus(400).send({
          message: "Data can not be empty!"
        });
    }
    db.collection('users').findOne({username: req.body.username})
        .then(data => {
        res.send(data);
        })
        .catch(err => {
        res.sendStatus(500).send({
            message:
            err.message || "Some error occurred while retrieving Documents."
        });
    }); 
}
