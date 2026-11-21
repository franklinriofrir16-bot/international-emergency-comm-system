const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";
const MOD = ALPHABET.length; // 27

function mod(n, m) {
  return ((n % m) + m) % m;
}

function modInverse(a, m) {
  a = mod(a, m);
  for (let x = 1; x < m; x++) {
    if (mod(a * x, m) === 1) return x;
  }
  return null;
}

function renderAll() {
  const raw = document.getElementById("msgInput").value.toUpperCase();
  const a = parseInt(document.getElementById("keyA").value, 10);
  const b = parseInt(document.getElementById("keyB").value, 10);
  const invA = modInverse(a, MOD);

  const cipherBox = document.getElementById("cipherOutput");
  const baseBox = document.getElementById("baseOutput");
  const logicBox = document.getElementById("logicOutput");

  if (!invA) {
    cipherBox.innerHTML = <p><strong>Error:</strong> Multiplier <code>a = ${a}</code> has no modular inverse mod ${MOD}. Pick a number coprime to ${MOD} (such as 2, 4, 5, 7, or 8).</p>;
    return;
  }

  let encodedChars = [];
  let decodedChars = [];
  let baseRows = "";

  for (const ch of raw) {
    const x = ALPHABET.indexOf(ch);
    if (x === -1) continue;

    const y = mod(a * x + b, MOD);
    const backX = mod(invA * (y - b), MOD);
    const encChar = ALPHABET[y];
    const decChar = ALPHABET[backX];

    encodedChars.push(${encChar} (${y}));
    decodedChars.push(decChar);

    const decBin = x.toString(2).padStart(5, "0");
    const encBin = y.toString(2).padStart(5, "0");

    baseRows += `
      <tr>
        <td>'${ch === " " ? "SPACE" : ch}'</td>
        <td>${x}</td>
        <td>${decBin}</td>
        <td>${y} ('${encChar === " " ? "SPACE" : encChar}')</td>
        <td>${encBin}</td>
      </tr>
    `;
  }

  cipherBox.innerHTML = `
    <p><strong>Formula:</strong> E(x) = (${a}x + ${b}) mod ${MOD} &nbsp;|&nbsp; D(y) = ${invA}(y - ${b}) mod ${MOD}</p>
    <p><strong>Original Message:</strong> ${raw}</p>
    <p><strong>Encoded Message:</strong> ${encodedChars.join("  ")}</p>
    <p><strong>Decoded Message:</strong> ${decodedChars.join("")}</p>
  `;

  baseBox.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Char</th>
          <th>Plain (Base 10)</th>
          <th>Plain (Base 2)</th>
          <th>Encoded (Base 10)</th>
          <th>Encoded (Base 2)</th>
        </tr>
      </thead>
      <tbody>${baseRows}</tbody>
    </table>
  `;

  logicBox.innerHTML = `
    <p><strong>Propositions:</strong> p = "Emergency message '${decodedChars.join("")}' is verified" &nbsp;|&nbsp; q = "Response protocol is activated"</p>
    <p><strong>Modus Ponens:</strong> Since <code>p</code> is True and <code>p → q</code> is True, therefore <code>q</code> (Response protocol is activated) is <strong>True</strong>[cite: 1, 2, 25].</p>
    <table>
      <thead>
        <tr><th>p</th><th>q</th><th>p → q</th></tr>
      </thead>
      <tbody>
        <tr><td>T</td><td>T</td><td>T</td></tr>
        <tr><td>T</td><td>F</td><td>F</td></tr>
        <tr><td>F</td><td>T</td><td>T</td></tr>
        <tr><td>F</td><td>F</td><td>T</td></tr>
      </tbody>
    </table>
  `;
}

document.getElementById("runBtn").addEventListener("click", renderAll);
renderAll();
