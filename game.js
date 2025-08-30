let energy = 0;
function gainEnergy() {
  energy += 1;
  document.getElementById("energyDisplay").textContent = "Energy: " + energy;
}
