/**
 * Custom domain management utilities
 */

/**
 * Validates a domain name
 */
export function isValidDomain(domain: string): boolean {
  if (!domain || typeof domain !== "string") return false;

  // Remove protocol if present
  const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");

  // Basic domain validation regex
  const domainRegex = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
  
  if (!domainRegex.test(cleanDomain)) {
    return false;
  }

  // Check length
  if (cleanDomain.length > 253) {
    return false;
  }

  // Check for reserved domains
  const reservedDomains = [
    "localhost",
    "example.com",
    "test.com",
    "linkhub.com",
    "linkis.com",
  ];
  
  if (reservedDomains.some((reserved) => cleanDomain.includes(reserved))) {
    return false;
  }

  return true;
}

/**
 * Normalizes a domain (removes protocol, trailing slash, etc.)
 */
export function normalizeDomain(domain: string): string {
  return domain
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")
    .toLowerCase()
    .trim();
}

/**
 * Generates DNS verification record
 */
export function generateDNSVerificationRecord(): string {
  const crypto = require("crypto");
  return crypto.randomBytes(16).toString("hex");
}

/**
 * Validates DNS configuration
 * Checks if domain points to our servers
 */
export async function validateDNSConfiguration(domain: string): Promise<{
  valid: boolean;
  records?: {
    cname?: string;
    a?: string[];
  };
  error?: string;
}> {
  try {
    const dns = await import("dns").then((m) => m.promises);
    
    // Check CNAME record
    try {
      const cnameRecords = await dns.resolveCname(domain);
      if (cnameRecords.length > 0) {
        return {
          valid: true,
          records: { cname: cnameRecords[0] },
        };
      }
    } catch {
      // CNAME not found, check A records
    }

    // Check A records
    try {
      const aRecords = await dns.resolve4(domain);
      // Check if A records point to our IPs
      const ourIPs = process.env.OUR_IP_ADDRESSES?.split(",") || [];
      const isValid = aRecords.some((ip) => ourIPs.includes(ip));
      
      return {
        valid: isValid,
        records: { a: aRecords },
        error: isValid ? undefined : "Domain does not point to our servers",
      };
    } catch {
      return {
        valid: false,
        error: "No DNS records found for domain",
      };
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "DNS validation failed",
    };
  }
}

/**
 * Gets domain verification instructions
 */
export function getDomainVerificationInstructions(domain: string, verificationCode: string): {
  cname: {
    name: string;
    value: string;
    type: string;
  };
  txt: {
    name: string;
    value: string;
    type: string;
  };
} {
  const baseDomain = process.env.NEXT_PUBLIC_BASE_URL?.replace(/^https?:\/\//, "") || "linkhub.com";
  
  return {
    cname: {
      name: domain,
      value: baseDomain,
      type: "CNAME",
    },
    txt: {
      name: `_linkhub-verification.${domain}`,
      value: verificationCode,
      type: "TXT",
    },
  };
}

