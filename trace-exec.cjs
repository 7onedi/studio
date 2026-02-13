// trace-exec.cjs
const cp = require("child_process");
const net = require("net");
const http = require("http");
const https = require("https");

const RE =
  /(^|[^\w])(wget|curl|nc|mkfifo)([^\w]|$)|\/tmp\/|x86(_64|_32)?|130\.12\.180\.126|91\.92\.241\.10|193\.142\.147\.209|82\.23\.183\.171|176\.65\.132\.224/i;

function toStr(v) {
  try {
    if (typeof v === "string") return v;
    if (Array.isArray(v)) return v.map(toStr).join(" ");
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function suspiciousFromArgs(args) {
  const s = args.map(toStr).join(" ");
  return RE.test(s) ? s : null;
}

function log(kind, details) {
  const ts = new Date().toISOString();
  console.error(`\n[SECURITY][${ts}] BLOCKED: ${kind}`);
  console.error("[SECURITY] details:", details);
  console.error(new Error("[SECURITY] stack").stack);
}

function wrapCp(name) {
  const orig = cp[name];
  if (typeof orig !== "function") return;

  cp[name] = function (...args) {
    const hit = suspiciousFromArgs(args);
    if (hit) {
      log(`child_process.${name}`, hit);
      throw new Error("Blocked suspicious child_process call");
    }
    return orig.apply(this, args);
  };
}

["exec", "execSync", "spawn", "spawnSync", "execFile", "execFileSync"].forEach(wrapCp);

// Catch raw TCP connects (like your ETIMEDOUT cases)
const origNetConnect = net.connect;
net.connect = function (...args) {
  const hit = suspiciousFromArgs(args);
  if (hit) {
    log("net.connect", hit);
    throw new Error("Blocked suspicious net.connect");
  }
  return origNetConnect.apply(this, args);
};

// Catch http(s) requests
function wrapRequest(mod, kind) {
  const orig = mod.request;
  mod.request = function (...args) {
    const hit = suspiciousFromArgs(args);
    if (hit) {
      log(`${kind}.request`, hit);
      throw new Error(`Blocked suspicious ${kind}.request`);
    }
    return orig.apply(this, args);
  };
}
wrapRequest(http, "http");
wrapRequest(https, "https");
