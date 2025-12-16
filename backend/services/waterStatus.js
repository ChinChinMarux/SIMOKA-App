class WaterStatus {
  getLabel() {
    throw new Error("Value invalid!");
  }

  getColor() {
    throw new Error("Value invalid!");
  }
}

class NormalStatus extends WaterStatus {
  getLabel() {
    return "Normal";
  }
  getColor() {
    return "green";
  }
}

class WarningStatus extends WaterStatus {
  getLabel() {
    return "Warning";
  }
  getColor() {
    return "orange";
  }
}

class DangerStatus extends WaterStatus {
  getLabel() {
    return "Danger";
  }
  getColor() {
    return "red";
  }
}

module.exports = { NormalStatus, WarningStatus, DangerStatus };
