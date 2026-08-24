const PRIVATE_SUFFIXES = [".localhost", ".internal", ".local", ".home.arpa"];

export function isInternalHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  if (!host) return true;
  if (host === "localhost") return true;
  if (PRIVATE_SUFFIXES.some((suffix) => host.endsWith(suffix))) return true;

  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const octets = ipv4.slice(1).map(Number);
    if (octets.some((octet) => octet > 255)) return true;
    const [a, b] = octets;
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    return false;
  }

  const ipv6 = host.replace(/^\[|\]$/g, "");
  if (ipv6.includes(":")) {
    const compressed = ipv6.toLowerCase();
    if (compressed === "::" || compressed === "::1") return true;
    if (/^f[cd][0-9a-f]{2}:/.test(compressed)) return true;
    if (/^fe[89ab][0-9a-f]:/.test(compressed)) return true;
    return false;
  }

  return false;
}
