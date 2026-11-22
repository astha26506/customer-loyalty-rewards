const STORAGE_KEY = "factory_loyalty_rewards_v1";
const CODE_PATTERN = /^BOX-[A-Z0-9]{4,10}$/;
const MAX_FAILED_ATTEMPTS = 3;

const DEFAULT_STATE = {
  codes: {
    "BOX-1001": { points: 50, claimed: false, claimedBy: null, claimedAt: null },
    "BOX-1002": { points: 100, claimed: false, claimedBy: null, claimedAt: null },
    "BOX-1003": { points: 75, claimed: false, claimedBy: null, claimedAt: null }
  },
  auditLogs: [],
  blockedAttempts: 0,
  failedByActor: {}
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    return {
      codes: parsed.codes || structuredClone(DEFAULT_STATE.codes),
      auditLogs: Array.isArray(parsed.auditLogs) ? parsed.auditLogs : [],
      blockedAttempts: Number(parsed.blockedAttempts) || 0,
      failedByActor: parsed.failedByActor || {}
    };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();
saveState(state);

const customerTabBtn = document.getElementById("customerTabBtn");
const ownerTabBtn = document.getElementById("ownerTabBtn");
const customerView = document.getElementById("customerView");
const ownerView = document.getElementById("ownerView");
const claimForm = document.getElementById("claimForm");
const claimStatus = document.getElementById("claimStatus");
const lookupBtn = document.getElementById("lookupBtn");
const lookupInput = document.getElementById("lookupInput");
const lookupResult = document.getElementById("lookupResult");
const generateCodeForm = document.getElementById("generateCodeForm");
const newCodeInput = document.getElementById("newCodeInput");
const newCodePoints = document.getElementById("newCodePoints");
const availableCodesList = document.getElementById("availableCodesList");
const auditTableBody = document.getElementById("auditTableBody");
const statPointsIssued = document.getElementById("statPointsIssued");
const statCodesClaimed = document.getElementById("statCodesClaimed");
const statCodesAvailable = document.getElementById("statCodesAvailable");
const statBlockedAttempts = document.getElementById("statBlockedAttempts");
const resetDemoBtn = document.getElementById("resetDemoBtn");

function showStatus(message, isSuccess) {
  claimStatus.textContent = message;
  claimStatus.className = "status-box " + (isSuccess ? "success" : "error");
}

function recordAudit(customerName, customerContact, code, status, points) {
  state.auditLogs.unshift({
    time: new Date().toLocaleString(),
    customerName,
    customerContact,
    code,
    status,
    points
  });
}

function registerFraudStrike(actorKey, customerName, customerContact, code, reason) {
  const currentStrikes = (state.failedByActor[actorKey] || 0) + 1;
  state.failedByActor[actorKey] = currentStrikes;
  state.blockedAttempts += 1;
  recordAudit(customerName, customerContact, code, `Blocked (${reason})`, 0);
  saveState(state);
  renderOwnerDashboard();

  if (currentStrikes >= MAX_FAILED_ATTEMPTS) {
    showStatus(
      `Suspicious activity detected (${currentStrikes} invalid/reused attempts). Claim temporarily flagged for owner review.`,
      false
    );
  } else {
    showStatus(
      `Rejected: ${reason}. Attempt ${currentStrikes} of ${MAX_FAILED_ATTEMPTS} before flag.`,
      false
    );
  }
}

customerTabBtn.addEventListener("click", () => {
  customerTabBtn.classList.add("active");
  ownerTabBtn.classList.remove("active");
  customerView.classList.add("active");
  ownerView.classList.remove("active");
});

ownerTabBtn.addEventListener("click", () => {
  ownerTabBtn.classList.add("active");
  customerTabBtn.classList.remove("active");
  ownerView.classList.add("active");
  customerView.classList.remove("active");
  renderOwnerDashboard();
});

claimForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("customerName").value.trim();
  const contact = document.getElementById("customerContact").value.trim().toLowerCase();
  const code = document.getElementById("boxCode").value.trim().toUpperCase();
  const agreed = document.getElementById("consentCheck").checked;

  if (!name || !contact || !code) {
    showStatus("Please fill in your name, contact details, and box code.", false);
    return;
  }

  if (!agreed) {
    showStatus("Please confirm purchase proof and consent before claiming.", false);
    return;
  }

  const actorKey = `${name.toLowerCase()}|${contact}`;

  if ((state.failedByActor[actorKey] || 0) >= MAX_FAILED_ATTEMPTS) {
    state.blockedAttempts += 1;
    recordAudit(name, contact, code, "Blocked (Rate/Fraud Flag)", 0);
    saveState(state);
    renderOwnerDashboard();
    showStatus("This customer profile is temporarily flagged due to repeated failed/reused code attempts.", false);
    return;
  }

  if (!CODE_PATTERN.test(code)) {
    registerFraudStrike(actorKey, name, contact, code, "Invalid Code Format");
    return;
  }

  const codeEntry = state.codes[code];
  if (!codeEntry) {
    registerFraudStrike(actorKey, name, contact, code, "Unknown Box Code");
    return;
  }

  if (codeEntry.claimed) {
    registerFraudStrike(actorKey, name, contact, code, "Code Already Used");
    return;
  }

  codeEntry.claimed = true;
  codeEntry.claimedBy = { name, contact };
  codeEntry.claimedAt = new Date().toISOString();
  state.failedByActor[actorKey] = 0;

  recordAudit(name, contact, code, "Claimed", codeEntry.points);
  saveState(state);
  renderOwnerDashboard();

  showStatus(
    `Success! ${codeEntry.points} loyalty points added for ${name} using box code ${code}.`,
    true
  );
  claimForm.reset();
});

lookupBtn.addEventListener("click", () => {
  const query = lookupInput.value.trim().toLowerCase();
  if (!query) {
    lookupResult.textContent = "Please enter a name, email, or phone number to check.";
    return;
  }

  const matches = state.auditLogs.filter(
    (entry) =>
      entry.status === "Claimed" &&
      (entry.customerName.toLowerCase().includes(query) ||
        entry.customerContact.toLowerCase().includes(query))
  );

  if (matches.length === 0) {
    lookupResult.textContent = "No claimed rewards found for this customer.";
    return;
  }

  const totalPoints = matches.reduce((sum, item) => sum + item.points, 0);
  const codesList = matches.map((item) => `${item.code} (+${item.points} pts)`).join(", ");
  lookupResult.innerHTML = `<strong>Total Points:</strong> ${totalPoints} pts<br /><strong>Claimed Boxes:</strong> ${codesList}`;
});

generateCodeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const code = newCodeInput.value.trim().toUpperCase();
  const points = Number(newCodePoints.value);

  if (!CODE_PATTERN.test(code)) {
    alert("Code must match format BOX-XXXX (letters/numbers, 4 to 10 chars after BOX-).");
    return;
  }

  if (state.codes[code]) {
    alert("This box code already exists.");
    return;
  }

  state.codes[code] = {
    points,
    claimed: false,
    claimedBy: null,
    claimedAt: null
  };

  saveState(state);
  renderOwnerDashboard();
  generateCodeForm.reset();
  newCodePoints.value = "50";
});

resetDemoBtn.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  state = loadState();
  saveState(state);
  renderOwnerDashboard();
  claimStatus.className = "status-box";
  claimStatus.textContent = "";
  lookupResult.textContent = "Enter details above to view earned points and claimed boxes.";
});

function renderOwnerDashboard() {
  const allEntries = Object.values(state.codes);
  const available = Object.entries(state.codes).filter(([, v]) => !v.claimed);
  const claimedEntries = allEntries.filter((v) => v.claimed);
  const totalPoints = claimedEntries.reduce((sum, v) => sum + v.points, 0);

  statPointsIssued.textContent = String(totalPoints);
  statCodesClaimed.textContent = String(claimedEntries.length);
  statCodesAvailable.textContent = String(available.length);
  statBlockedAttempts.textContent = String(state.blockedAttempts);

  availableCodesList.innerHTML = "";
  if (available.length === 0) {
    availableCodesList.innerHTML = "<li>No unclaimed codes available.</li>";
  } else {
    available.forEach(([code, info]) => {
      const li = document.createElement("li");
      li.className = "tag-item";
      li.textContent = `${code} (${info.points} pts)`;
      availableCodesList.appendChild(li);
    });
  }

  auditTableBody.innerHTML = "";
  if (state.auditLogs.length === 0) {
    auditTableBody.innerHTML = '<tr><td colspan="5">No claim attempts recorded yet.</td></tr>';
    return;
  }

  state.auditLogs.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.time}</td>
      <td>${row.customerName} (${row.customerContact})</td>
      <td>${row.code}</td>
      <td>${row.status}</td>
      <td>${row.points}</td>
    `;
    auditTableBody.appendChild(tr);
  });
}

renderOwnerDashboard();