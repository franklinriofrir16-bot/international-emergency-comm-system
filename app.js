const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";
const MOD = ALPHABET.length; // 27

function mod(n, m) {
  return ((n % m) + m) % m;
}

function modInverse(a, m) {
  const baseA = mod(a, m);
  for (let x = 1; x < m; x++) {
    if (mod(baseA * x, m) === 1) {
      return x;
    }
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

  if (!msgEl || !aEl || !bEl || !cipherBox || !baseBox || !logicBox) {
    return;
  }

  const raw = msgEl.value.toUpperCase();
  const a = parseInt(aEl.value, 10);
  const b = parseInt(bEl.value, 10);

  if (Number.isNaN(a) || Number.isNaN(b)) {
    cipherBox.innerHTML = "<p><strong>Error:</strong> Please enter valid numbers for Multiplier (a) and Shift (b).</p>";
    return;
  }

  const invA = modInverse(a, MOD);
  if (!invA) {
    cipherBox.innerHTML =
      "<p><strong>Error:</strong> Multiplier <code>a = " +
      a +
      "</code> has no modular inverse mod " +
      MOD +
      ". Try <code>a = 2, 4, 5, 7, or 8</code>.</p>";
    return;
  }

  const encodedChars = [];
  const decodedChars = [];
  let baseRows = "";

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    const x = ALPHABET.indexOf(ch);
    if (x === -1) continue;

    const y = mod(a * x + b, MOD);
    const backX = mod(invA * (y - b), MOD);
    const encChar = ALPHABET[y];
    const decChar = ALPHABET[backX];

    encodedChars.push(encChar + " (" + y + ")");
    decodedChars.push(decChar);

    const decBin = x.toString(2).padStart(5, "0");
    const encBin = y.toString(2).padStart(5, "0");
    const plainLabel = ch === " " ? "SPACE" : ch;
    const encLabel = encChar === " " ? "SPACE" : encChar;

    baseRows +=
      "<tr>" +
      "<td>'" + plainLabel + "'</td>" +
      "<td>" + x + "</td>" +
      "<td>" + decBin + "</td>" +
      "<td>" + y + " ('" + encLabel + "')</td>" +
      "<td>" + encBin + "</td>" +
      "</tr>";
  }

  const decodedText = decodedChars.join("");

  cipherBox.innerHTML =
    "<p><strong>Formula:</strong> E(x) = (" + a + "x + " + b + ") mod " + MOD +
    " &nbsp;|&nbsp; D(y) = " + invA + "(y - " + b + ") mod " + MOD + "</p>" +
    "<p><strong>Original Message:</strong> " + raw + "</p>" +
    "<p><strong>Encoded Message:</strong> " + encodedChars.join("  ") + "</p>" +
    "<p><strong>Decoded Message:</strong> " + decodedText + "</p>";

  baseBox.innerHTML =
    "<table>" +
    "<thead><tr>" +
    "<th>Char</th>" +
    "<th>Plain (Base 10)</th>" +
    "<th>Plain (Base 2)</th>" +
    "<th>Encoded (Base 10)</th>" +
    "<th>Encoded (Base 2)</th>" +
    "</tr></thead>" +
    "<tbody>" + baseRows + "</tbody>" +
    "</table>";

  logicBox.innerHTML =
    "<p><strong>Propositions:</strong> p = \"Emergency message '" + decodedText + "' is verified\"" +
    " &nbsp;|&nbsp; q = \"Response protocol is activated\"</p>" +
    "<p><strong>Modus Ponens:</strong> Since <code>p</code> is True and <code>p -&gt; q</code> is True," +
    " therefore <code>q</code> (Response protocol is activated) is <strong>True</strong>.</p>" +
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

const runBtn = document.getElementById("runBtn");
if (runBtn) {
  runBtn.addEventListener("click", renderAll);
}
renderAll();