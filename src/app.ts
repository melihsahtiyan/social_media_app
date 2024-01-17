import express, { Express } from "express";

const app: Express = express();

app.get("/api", (req, res) => {
  res.json({ message: "Hello World" });
});

app.listen(8080, () => console.log("Server running"));
