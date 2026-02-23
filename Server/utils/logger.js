const isDev = process.env.NODE_ENV !== "production";

export function log(...args) {
  console.log("[LOG]", new Date().toISOString(), ...args);
}

export function error(...args) {
  console.error("[ERROR]", new Date().toISOString(), ...args);
}

export function warn(...args) {
  console.warn("[WARN]", new Date().toISOString(), ...args);
}
