export function abbreviateAddress(address: string, chars: number = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2) return address;
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

export function abbreviateTxId(txId: string, chars: number = 6): string {
  if (!txId) return "";
  if (txId.startsWith("0x")) {
    return `0x${txId.substring(2, chars + 2)}...`;
  }
  if (txId.length <= chars * 2) return txId;
  return `${txId.substring(0, chars)}...`;
}

export function formatStxAmount(microStx: string | number | bigint): string {
  const microStxBigInt = BigInt(microStx);
  const stx = microStxBigInt / BigInt(1_000_000);
  const remainingMicroStx = microStxBigInt % BigInt(1_000_000);
  
  if (remainingMicroStx === BigInt(0)) {
    return `${stx.toLocaleString()} STX`;
  }
  
  const decimalPart = Number(remainingMicroStx) / 1_000_000;
  const formatted = `${stx.toLocaleString()}.${decimalPart.toFixed(6).substring(2)} STX`;
  return formatted;
}

export function formatTokenAmount(
  amount: string | number | bigint,
  decimals: number = 6
): string {
  const amountBigInt = BigInt(amount);
  const divisor = BigInt(10 ** decimals);
  const wholePart = amountBigInt / divisor;
  const fractionalPart = amountBigInt % divisor;
  
  if (fractionalPart === BigInt(0)) {
    return wholePart.toLocaleString();
  }
  
  const fractionalNumber = Number(fractionalPart) / (10 ** decimals);
  const formatted = `${wholePart.toLocaleString()}.${fractionalNumber.toFixed(decimals).substring(2)}`;
  return formatted;
}

export function formatUsdAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDateTime(
  timestamp: number | string | Date,
  options?: {
    showDate?: boolean;
    showTime?: boolean;
    showSeconds?: boolean;
  }
): string {
  const date = new Date(timestamp);
  const { showDate = true, showTime = true, showSeconds = false } = options || {};
  
  const dateOptions: Intl.DateTimeFormatOptions = {};
  
  if (showDate) {
    dateOptions.year = "numeric";
    dateOptions.month = "short";
    dateOptions.day = "numeric";
  }
  
  if (showTime) {
    dateOptions.hour = "2-digit";
    dateOptions.minute = "2-digit";
    if (showSeconds) {
      dateOptions.second = "2-digit";
    }
  }
  
  return date.toLocaleDateString("en-US", dateOptions);
}

export function formatRelativeTime(timestamp: number | string | Date): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) {
    return "Just now";
  }
  if (diffMin < 60) {
    return `${diffMin} min${diffMin > 1 ? "s" : ""} ago`;
  }
  if (diffHour < 24) {
    return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
  }
  if (diffDay < 7) {
    return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  }
  
  return formatDateTime(date, { showTime: false });
}

export function copyToClipboard(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => resolve(true)).catch(() => resolve(false));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        resolve(true);
      } catch {
        resolve(false);
      }
      document.body.removeChild(textArea);
    }
  });
}

export function isValidStacksAddress(address: string): boolean {
  const mainnetRegex = /^SP[0-9A-Z]{38}$/;
  const testnetRegex = /^ST[0-9A-Z]{38}$/;
  return mainnetRegex.test(address) || testnetRegex.test(address);
}

export function getAddressNetwork(address: string): "mainnet" | "testnet" | null {
  if (address.startsWith("SP")) return "mainnet";
  if (address.startsWith("ST")) return "testnet";
  return null;
}