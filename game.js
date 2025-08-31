let energy = 0;
let energyMax = 10;
let gold = 0;
let goldMax = 10;

function updateDisplay() {
  document.getElementById("energyDisplay").textContent = `Energy: ${energy} / ${energyMax}`;
  document.getElementById("goldDisplay").textContent = `Gold: ${gold} / ${goldMax}`;
}

function saveResources() {
  localStorage.setItem("energy", energy);
  localStorage.setItem("gold", gold);
}

function loadResources() {
  const savedEnergy = localStorage.getItem("energy");
  const savedGold = localStorage.getItem("gold");

  energy = savedEnergy !== null ? parseInt(savedEnergy) : 0;
  gold = savedGold !== null ? parseInt(savedGold) : 0;
}

function rest() {
  if (energy < energyMax) {
    energy += 1;
    saveResources();
    updateDisplay();
  } else {
    console.log("Energy is full!");
  }
}

function sweepRoad() {
  if (energy > 0 && gold < goldMax) {
    energy -= 1;
    gold += 1;
    saveResources();
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
    saveResources();
    updateDisplay();
    updateWalletUpgradeButton();
  }
}

// Tab switching
document.querySelectorAll('.tabButton').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tabButton').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    document.querySelectorAll('.tabContent').forEach(content => content.classList.remove('active'));
    const tabId = button.dataset.tab + 'Tab';
    document.getElementById(tabId).classList.add('active');

    // Save the active tab to localStorage
    localStorage.setItem("activeTab", button.dataset.tab);

    // Recalculate button widths for the newly visible tab
    setUniformButtonWidthPerTab();
  });
});


// Auto-refresh logic
const autoRefreshCheckbox = document.getElementById("autoRefreshCheckbox");
const countdownDisplay = document.getElementById("refreshCountdown");
const refreshKey = "autoRefreshEnabled";
let countdown = 30;

autoRefreshCheckbox.addEventListener("change", () => {
  localStorage.setItem(refreshKey, autoRefreshCheckbox.checked);
  countdown = 30;
  updateCountdown();
});

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

autoRefreshCheckbox.addEventListener("change", () => {
  localStorage.setItem(refreshKey, autoRefreshCheckbox.checked);
  countdown = 30;
  updateCountdown();
});

function resetResources() {
  energy = 0;
  gold = 0;
  saveResources();
  updateDisplay();
  updateWalletUpgradeButton();
}

function maxResources() {
  energy = energyMax;
  gold = goldMax;
  saveResources();
  updateDisplay();
  updateWalletUpgradeButton();
}

function logState() {
  console.log("Energy:", energy);
  console.log("Gold:", gold);
  console.log("GoldMax:", goldMax);
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

// Toggle styles
panel.style.opacity = e.target.checked ? "1" : "0";
panel.style.transform = e.target.checked ? "translateY(0)" : "translateY(-10px)";
panel.style.display = e.target.checked ? "block" : "none";

// DOM setup
document.addEventListener("DOMContentLoaded", () => {
  // Restore last active tab
  const savedTab = localStorage.getItem("activeTab") || "actions";
  document.querySelectorAll('.tabButton').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === savedTab);
  });
  document.querySelectorAll('.tabContent').forEach(content => {
    content.classList.toggle('active', content.id === savedTab + "Tab");
  });

  // Load saved resources
  loadResources();

  // Set up buttons
  document.getElementById("restButton").addEventListener("click", rest);
  document.getElementById("sweepButton").addEventListener("click", sweepRoad);
  document.getElementById("walletUpgradeButton").addEventListener("click", buyBiggerWallet);

  // Debug tab toggle
  document.getElementById("debugToggle").addEventListener("change", (e) => {
    const debugTabButton = document.getElementById("debugTabButton");
    debugTabButton.style.display = e.target.checked ? "inline-block" : "none";
    if (e.target.checked) {
      debugTabButton.click();
    }
  });

  // Auto-refresh setup
  autoRefreshCheckbox.checked = localStorage.getItem(refreshKey) === "true";
  startAutoRefresh();

  updateDisplay();
  updateWalletUpgradeButton();
  setTimeout(setUniformButtonWidthPerTab, 0);
  setUniformButtonWidthPerTab();
});




