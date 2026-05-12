export function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { label: "Too short", color: "#EF4444" },
    { label: "Weak", color: "#F59E0B" },
    { label: "Fair", color: "#F59E0B" },
    { label: "Good", color: "#10B981" },
    { label: "Strong", color: "#0A6E5C" },
  ];
  return { score: s, ...map[s] };
}

export function isInsecureNetworkOrigin() {
  return window.location.protocol === "http:" && !["localhost", "127.0.0.1"].includes(window.location.hostname);
}
