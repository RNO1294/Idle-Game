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
  localStorage.setItem("energyMax", energyMax);
  localStorage.setItem("goldMax", goldMax);
}

function loadResources() {
  energy = parseInt(localStorage.getItem("energy")) || 0;
  gold = parseInt(localStorage.getItem("gold")) || 0;
  energyMax = parseInt(localStorage.getItem("energyMax")) || 10;
  goldMax = parseInt(localStorage.getItem("goldMax")) || 10;
}

function saveGameState() {
  saveResources();
  // future: save upgrades, unlocks, etc.
}

function loadGameState() {
  loadResources();

  const devModeEnabled = localStorage.getItem("devModeEnabled") === "true";
  const debugToggle = document.getElementById("debugToggle");
  const debugTabButton = document.getElementById("debugTabButton");

  debugToggle.checked = devModeEnabled;

  if (devModeEnabled) {
    debugTabButton.classList.remove("hidden");
  } else {
    debugTabButton.classList.add("hidden");
  }

  const savedTab = localStorage.getItem("activeTab") || "actions";
  switchToTab(savedTab);
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

function updateGameState() {
  updateDisplay();
  updateWalletUpgradeButton();
  saveResources();
}

function updateWalletUpgradeButton() {
  const button = document.getElementById("walletUpgradeButton");
  if (!button) return; // Prevent crash if button isn't in the DOM
  button.disabled = gold < goldMax;
  button.textContent = `Bigger Wallet (Cost: ${goldMax})`;
}


function logState() {
  console.log("Energy:", energy);
  console.log("Gold:", gold);
  console.log("GoldMax:", goldMax);
}

function switchToTab(tabName) {
  document.querySelectorAll('.tabButton').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  document.querySelectorAll('.tabContent').forEach(content => {
    content.classList.toggle('active', content.id === tabName + "Tab");
  });
  localStorage.setItem("activeTab", tabName);
  setUniformButtonWidthPerTab();
}

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

document.addEventListener("DOMContentLoaded", () => {
  const autoRefreshCheckbox = document.getElementById("autoRefreshCheckbox");
  const countdownDisplay = document.getElementById("refreshCountdown");
  const refreshKey = "autoRefreshEnabled";
  const countdownMax = 10;
  let countdown = countdownMax;

  document.querySelectorAll('.tabButton').forEach(button => {
    button.addEventListener('click', () => {
      switchToTab(button.dataset.tab);
    });
  });

  document.getElementById("restButton").addEventListener("click", rest);
  document.getElementById("sweepButton").addEventListener("click", sweepRoad);
  document.getElementById("walletUpgradeButton").addEventListener("click", buyBiggerWallet);

  document.getElementById("debugToggle").addEventListener("change", (e) => {
    const debugTabButton = document.getElementById("debugTabButton");
    const isChecked = e.target.checked;
    localStorage.setItem("devModeEnabled", isChecked);

    if (isChecked) {
      debugTabButton.classList.remove("hidden");
    } else {
      debugTabButton.classList.add("hidden");
    }
  });

  const devModeEnabled = localStorage.getItem("devModeEnabled") === "true";
  document.getElementById("debugToggle").checked = devModeEnabled;

  const debugTabButton = document.getElementById("debugTabButton");
  if (devModeEnabled) {
    debugTabButton.classList.remove("hidden");
  } else {
    debugTabButton.classList.add("hidden");
  }

  autoRefreshCheckbox.checked = localStorage.getItem(refreshKey) === "true";

  autoRefreshCheckbox.addEventListener("change", () => {
    localStorage.setItem(refreshKey, autoRefreshCheckbox.checked);
    countdown = countdownMax;
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
        countdown = countdownMax;
        updateCountdown();
      }
    }, 1000);
  }

  loadGameState();
  startAutoRefresh();
  updateGameState()
  setTimeout(setUniformButtonWidthPerTab, 0);
});
