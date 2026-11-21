const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";
const MOD = ALPHABET.length;

function mod(n, m) {
  return ((n % m) + m) % m;
}

function modInverse(a, m) {
  const baseA = mod(a, m);
  for (let x = 1; x < m; x++) {
    if (mod(baseA * x, m) === 1) return x;
  }
  return null;
}

function renderAll() {
  const msgEl = document.getElementById("msgInput");
  const aEl = document.getElementById("keyA");
  const bEl = document.getElementById("keyB");
  const cipherBox = document.getElementById("cipherOutput");
  const baseBox = document.getElementById("baseOutput");
  const logicBox = document.getElementById("logicOutput");

  if (!msgEl || !aEl || !bEl || !cipherBox || !baseBox || !logicBox) return;

  const raw = msgEl.value.toUpperCase();
  const a = parseInt(aEl.value, 10);
  const b = parseInt(bEl.value, 10);

  if (Number.isNaN(a) || Number.isNaN(b)) {
    cipherBox.innerHTML = "<p><strong>Error:</strong> Enter valid numbers for a and b.</p>";
    return;
  }

  const invA = modInverse(a, MOD);
  if (!invA) {
    cipherBox.innerHTML =
      "<p><strong>Error:</strong> Multiplier a = " + a +
      " has no inverse mod " + MOD + ". Try 2, 4, 5, 7, or 8.</p>";
    return;
  }

  const encodedList = [];
  const decodedList = [];
  let baseRows = "";

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    const x = ALPHABET.indexOf(ch);
    if (x === -1) continue;

    const y = mod(a * x + b, MOD);
    const backX = mod(invA * (y - b), MOD);
    const encChar = ALPHABET[y];
    const decChar = ALPHABET[backX];

    encodedList.push(encChar + " (" + y + ")");
    decodedList.push(decChar);

    const plainBin = x.toString(2).padStart(5, "0");
    const encBin = y.toString(2).padStart(5, "0");
    const plainName = ch === " " ? "SPACE" : ch;
    const encName = encChar === " " ? "SPACE" : encChar;

    baseRows +=
      "<tr>" +
      "<td>" + plainName + "</td>" +
      "<td>" + x + "</td>" +
      "<td>" + plainBin + "</td>" +
      "<td>" + y + " (" + encName + ")</td>" +
      "<td>" + encBin + "</td>" +
      "</tr>";
  }

  const decodedText = decodedList.join("");

  cipherBox.innerHTML =
    "<p><strong>Formula:</strong> E(x) = (" + a + "x + " + b + ") mod " + MOD +
    " | D(y) = " + invA + "(y - " + b + ") mod " + MOD + "</p>" +
    "<p><strong>Original Message:</strong> " + raw + "</p>" +
    "<p><strong>Encoded Message:</strong> " + encodedList.join("  ") + "</p>" +
    "<p><strong>Decoded Message:</strong> " + decodedText + "</p>";

  baseBox.innerHTML =
    "<table>" +
    "<thead><tr>" +
    "<th>Char</th><th>Plain (Base 10)</th><th>Plain (Base 2)</th>" +
    "<th>Encoded (Base 10)</th><th>Encoded (Base 2)</th>" +
    "</tr></thead>" +
    "<tbody>" + baseRows + "</tbody>" +
    "</table>";

  logicBox.innerHTML =
    "<p><strong>Propositions:</strong> p = \"Message '" + decodedText + "' is verified\"" +
    " | q = \"Response protocol is activated\"</p>" +
    "<p><strong>Modus Ponens:</strong> p is True and p -&gt; q is True, therefore q is <strong>True</strong>.</p>" +
    "<table>" +
    "<thead><tr><th>p</th><th>q</th><th>p -&gt; q</th></tr></thead>" +
    "<tbody>" +
    "<tr><td>T</td><td>T</td><td>T</td></tr>" +
    "<tr><td>T</td><td>F</td><td>F</td></tr>" +
    "<tr><td>F</td><td>T</td><td>T</td></tr>" +
    "<tr><td>F</td><td>F</td><td>T</td></tr>" +
    "</tbody>" +
    "</table>";
}

document.getElementById("runBtn").addEventListener("click", renderAll);
renderAll();