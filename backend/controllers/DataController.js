const { processWaterData } = require("./waterController");

class DataController {
  static getWaterQuality(req, res) {
    const data = {
      pH: (6 + Math.random() * 2).toFixed(2),
      temperature: (25 + Math.random() * 5).toFixed(1),
      TDS: (300 + Math.random() * 200).toFixed(0),
      TSS: (10 + Math.random() * 30).toFixed(0),
      time: new Date().toLocaleTimeString(),
    };

    processWaterData(data);

    res.json(data);
  }
}

module.exports = DataController;
