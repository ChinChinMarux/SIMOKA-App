const express = require("express");
const cors = require("cors");
const router = express.Router();
const DataController = require("./controllers/DataController");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", router);

// Test Route
app.get("/", (req, res) => {
  res.send("SIMOKA Backend Running...");
});

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});

router.get("/dataDummy", (req, res) => {
  try {
    const result = processWaterData(req.body);
    res.json(result);
  } catch (error) {
    console.error("Endpoint error:", error);
    res.status(500).json({ error: "Failed to process water data" });
  }
});

module.exports = router;
