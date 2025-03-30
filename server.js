const express = require("express");
const admin = require("firebase-admin");
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Firebase Admin SDK
const serviceAccount = require("/Users/stljohns/Documents/firebase-server/service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://testdemo-285bc-default-rtdb.firebaseio.com//"
});

const db = admin.database();

// Middleware to parse JSON requests
app.use(express.json());

// Create a user
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  // Check if 'name' and 'email' are provided
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const newUserRef = db.ref("users").push();
  newUserRef.set({ name, email })
    .then(() => {
      res.status(201).json({ id: newUserRef.key, name, email });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Get a user by ID
app.get("/users/:id", (req, res) => {
  const userId = req.params.id;

  db.ref("users/" + userId).once("value")
    .then(snapshot => {
      if (snapshot.exists()) {
        res.json(snapshot.val());
      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Update user info
app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;

  db.ref("users/" + userId).update({ name, email })
    .then(() => {
      res.json({ id: userId, name, email });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Delete a user
app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;

  db.ref("users/" + userId).once("value")
    .then(snapshot => {
      if (!snapshot.exists()) {
        return res.status(404).json({ error: "User not found" });
      }

      // Delete user
      db.ref("users/" + userId).remove()
        .then(() => {
          res.json({ message: "User deleted" });
        })
        .catch((error) => {
          res.status(500).json({ error: error.message });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
