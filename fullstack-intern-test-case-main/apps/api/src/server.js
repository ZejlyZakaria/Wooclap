const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

const courseRouter = require("./routers/course-router");
const questionRouter = require("./routers/question-router");
const defaultRouter = require("./routers/default-router");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Step 9 - log all requests
app.use((req, res, next) => {
  console.log("📌 New Request Received:");
  console.log(`➡️ Method: ${req.method}`);
  console.log(`🛣️ URL: ${req.originalUrl}`);

  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    if (req.body && Object.keys(req.body).length > 0) {
      console.log(`📦 Body: ${JSON.stringify(req.body, null, 2)}`);
    } else {
      console.log("📭 Body: Empty or not applicable");
    }
  }

  console.log("==================================");
  next();
});



app.use(bodyParser.json());

// Middleware global pour configurer les en-têtes
app.use((req, res, next) => {
  // Autoriser les requêtes CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json");

  // Désactiver le cache
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  next();
});

// Ajouter les routeurs
app.use(courseRouter);
app.use(questionRouter);
app.use(defaultRouter);

// Connexion à MongoDB
mongoose
  .connect("mongodb://admin:password@127.0.0.1:27042/course-catalog", {
    authSource: "admin",
  })
  .then(async (result) => {
    console.log("MongoDB started!");

    // Démarrer le serveur
    app.listen(port, () => {
      console.log(`API running on port ${port} ...`);
    });
  })
  .catch((error) => console.log(error));

