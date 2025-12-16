class Sensor {
  constructor(name) {
    this.name = name;
  }

  readValue() {
    throw new Error("Value not found!");
  }

  getUnit() {
    throw new Error("Value not found!");
  }

  getSafeRange() {
    throw new Error("Value not found!");
  }
}

module.exports = Sensor;
