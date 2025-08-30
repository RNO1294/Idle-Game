let mana = 0;
function gainMana() {
  mana += 1;
  document.getElementById("manaDisplay").textContent = "Mana: " + mana;
}
