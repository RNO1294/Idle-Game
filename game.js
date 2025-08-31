let energy = 0;
let energyMax = 10;
let gold = 0;
let goldMax = 10;

function updateDisplay() {
  document.getElementById("energyDisplay").textContent = `Energy: ${energy} / ${energyMax}`;
  document.getElementById("goldDisplay").textContent = `Gold: ${gold} / ${goldMax}`;
}

function gainEnergy() {
  if (energy < energyMax) {
    energy += 1;
    updateDisplay();
  } else {
    console.log("Energy is full!");
  }
}

function sweepRoad() {
  if (energy > 0 && gold < goldMax) {
    energy -= 1;
    gold += 1;
    updateDisplay();
    updateWalletUpgradeButton();
  } else if (energy <= 0) {
    console.log("Not enough energy!");
  } else {
    console.log("Gold is full!");
  }
}

function buyBiggerWallet() {
  if (gold >= goldMax) {
    gold -= goldMax;
    goldMax = Math.floor(goldMax * 1.5);
    updateDisplay();
    updateWalletUpgradeButton();
  }
}

function updateWalletUpgradeButton() {
  const btn = document.getElementById("walletUpgradeButton");
  btn.textContent = `Bigger Wallet (Cost: ${goldMax})`;
  btn.disabled = gold < goldMax;

  // Delay width calculation until after label is rendered
  setTimeout(setUniformButtonWidthPerTab, 0);
}


// Tab switching
document.querySelectorAll('.tabButton').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tabButton').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    document.querySelectorAll('.tabContent').forEach(content => content.classList.remove('active'));
    const tabId = button.dataset.tab + 'Tab';
    document.getElementById(tabId).classList.add('active');
  });
});

// Auto-refresh logic
const checkbox = document.getElementById("autoRefreshCheckbox");
const countdownDisplay = document.getElementById("refreshCountdown");
const refreshKey = "autoRefreshEnabled";
let countdown = 30;

function updateCountdown() {
  countdownDisplay.textContent = countdown;
}

function startAutoRefresh() {
  updateCountdown();
  setInterval(() => {
    if (localStorage.getItem(refreshKey) === "true") {
      countdown--;
      updateCountdown();
      if (countdown <= 0) {
        location.reload(true);
      }
    } else {
      countdown = 30;
      updateCountdown();
    }
  }, 1000);
}

checkbox.addEventListener("change", () => {
  localStorage.setItem(refreshKey, checkbox.checked);
  countdown = 30;
  updateCountdown();
});

// Per-tab button width logic
function setUniformButtonWidthPerTab() {
  document.querySelectorAll(".tabContent").forEach(tab => {
    const buttons = tab.querySelectorAll(".actionButton");
    let maxWidth = 0;

    buttons.forEach(btn => {
      btn.style.width = "auto";
      const width = btn.offsetWidth;
      if (width > maxWidth) maxWidth = width;
    });

    buttons.forEach(btn => {
      btn.style.width = `${maxWidth}px`;
    });
  });
}

// DOM setup
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("restButton").addEventListener("click", gainEnergy);
  document.getElementById("sweepButton").addEventListener("click", sweepRoad);
  document.getElementById("walletUpgradeButton").addEventListener("click", buyBiggerWallet);

  updateDisplay();
  updateWalletUpgradeButton(); // ← this must run BEFORE width calculation
  setUniformButtonWidthPerTab(); // ← now recalculates widths after label update
  checkbox.checked = localStorage.getItem(refreshKey) === "true";
  startAutoRefresh();
});


