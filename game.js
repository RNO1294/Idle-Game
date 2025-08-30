let energy = 0;

function updateDisplay() {
  document.getElementById("energyDisplay").textContent = "Energy: " + energy;
}

function gainEnergy() {
  energy += 1;
  updateDisplay();
}

// Wait until the page is fully loaded before attaching the event
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("restButton").addEventListener("click", gainEnergy);
  updateDisplay(); // Initialize display
});
