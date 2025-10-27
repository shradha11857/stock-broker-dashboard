const socket = io("http://localhost:4000");

const loginDiv = document.getElementById("login");
const dashboardDiv = document.getElementById("dashboard");
const emailInput = document.getElementById("email");
const loginBtn = document.getElementById("loginBtn");
const userEmail = document.getElementById("userEmail");
const tickerList = document.getElementById("tickerList");
const subscribeBtn = document.getElementById("subscribeBtn");
const stockPricesDiv = document.getElementById("stockPrices");

let selectedTickers = [];

// --- Login ---
loginBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  if (!email) return alert("Enter your email");

  const res = await fetch("http://localhost:4000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (data.email) {
    loginDiv.style.display = "none";
    dashboardDiv.style.display = "block";
    userEmail.textContent = data.email;
    loadTickers();
  }
});

// --- Load stock tickers ---
async function loadTickers() {
  const res = await fetch("http://localhost:4000/tickers");
  const tickers = await res.json();
  tickerList.innerHTML = "";
  tickers.forEach((t) => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" value="${t}"> ${t}`;
    tickerList.appendChild(label);
  });
}

// --- Subscribe ---
subscribeBtn.addEventListener("click", () => {
  selectedTickers = Array.from(
    document.querySelectorAll('input[type="checkbox"]:checked')
  ).map((el) => el.value);

  if (selectedTickers.length === 0) {
    alert("Select at least one stock!");
    return;
  }

  socket.emit("subscribe", selectedTickers);
  stockPricesDiv.innerHTML = "";
});

// --- Receive live prices ---
socket.on("priceUpdate", (updates) => {
  stockPricesDiv.innerHTML = "";
  updates.forEach((u) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<h4>${u.ticker}</h4><p>$${u.price}</p>`;
    stockPricesDiv.appendChild(div);
  });
});
