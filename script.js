
const STOCKS = ["GOOG", "TSLA", "AMZN", "META", "NVDA"];
let subscribedStocks = [];
let interval;
let userEmail = "";

document.getElementById("loginBtn").addEventListener("click", () => {
  const emailInput = document.getElementById("email").value.trim();
  if (emailInput === "") {
    alert("Please enter your email to continue.");
    return;
  }
  userEmail = emailInput;
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("welcomeText").innerHTML = `Welcome, <strong>${userEmail}</strong>`;
  loadStockOptions();
});


function loadStockOptions() {
  const container = document.getElementById("stockOptions");
  container.innerHTML = "";

  STOCKS.forEach(stock => {
    const div = document.createElement("div");
    div.className = "stock-option";

    const label = document.createElement("label");
    label.textContent = stock;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = stock;

    div.appendChild(label);
    div.appendChild(checkbox);
    container.appendChild(div);
  });
}

document.getElementById("subscribeBtn").addEventListener("click", () => {
  const checked = Array.from(document.querySelectorAll("#stockOptions input:checked")).map(cb => cb.value);

  if (checked.length === 0) {
    alert("Please select at least one stock to subscribe.");
    return;
  }

  subscribedStocks = checked;
  updateStockTable();
  startLiveUpdates();
});

function randomPrice() {
  return (Math.random() * 1000 + 100).toFixed(2);
}

function updateStockTable() {
  const tbody = document.getElementById("stockTable");
  tbody.innerHTML = "";

  subscribedStocks.forEach(stock => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    const priceCell = document.createElement("td");

    nameCell.textContent = stock;
    priceCell.textContent = randomPrice();

    row.appendChild(nameCell);
    row.appendChild(priceCell);
    tbody.appendChild(row);
  });
}


function startLiveUpdates() {
  if (interval) clearInterval(interval);

  interval = setInterval(() => {
    const tbody = document.getElementById("stockTable").children;
    for (let i = 0; i < tbody.length; i++) {
      tbody[i].children[1].textContent = randomPrice();
    }
  }, 1000);
}
