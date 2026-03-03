import { FEE_PRICING, isChildVisitorTicket } from "@/data/dummyData";

export const VISITOR_HIDE_KEY = "visitor_hidden_keys_v1";

const PAID_STATUSES = new Set([
  "sudah_bayar",
  "refund_diajukan",
  "refund_diproses",
  "refund_selesai",
]);

const canUseStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const normalizeString = (value) => String(value || "").trim().toLowerCase();

const normalizeIdentityNumber = (value) => String(value || "").replace(/\s+/g, "").trim();
const normalizeIdentityType = (value) => String(value || "").trim().toLowerCase();

const IDENTITY_TYPE_LABELS = {
  ktp: "NIK",
  sim: "No SIM",
  paspor: "No Paspor",
  kitas: "No KITAS",
  kitap: "No KITAP",
  dokumen_peneliti: "Dokumen Peneliti",
};

export const getIdentityTypeLabel = (identityType) =>
  IDENTITY_TYPE_LABELS[normalizeIdentityType(identityType)] || "No Identitas";

const hashToDigits = (value, length = 16) => {
  const input = String(value || "ticket");
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) % 1000000007;
  }
  let digits = String(Math.abs(hash));
  while (digits.length < length) {
    const lastDigit = Number(digits[digits.length - 1] || 7);
    digits += String((lastDigit * 7 + 3) % 10);
  }
  return digits.slice(0, length);
};

const buildDummyIdentityNumber = (ticket, identityType) => {
  const seed = `${ticket?.id || "TICKET"}|${ticket?.namaLengkap || ""}|${ticket?.createdAt || ""}`;
  const digits = hashToDigits(seed, 16);

  if (identityType === "paspor") return `P${digits.slice(0, 8)}`;
  if (identityType === "sim") return `SIM${digits.slice(0, 12)}`;
  if (identityType === "kitas") return `KITAS${digits.slice(0, 10)}`;
  if (identityType === "kitap") return `KITAP${digits.slice(0, 10)}`;
  if (identityType === "dokumen_peneliti") return `DOC${digits.slice(0, 10)}`;
  return digits;
};

export const getTicketIdentityType = (ticket) => {
  const directType = normalizeIdentityType(ticket?.identityType);
  if (directType) return directType;
  if (ticket?.noKTP) return "ktp";
  if (ticket?.domisiliOCR === "mancanegara") return "paspor";
  return "ktp";
};

export const getTicketIdentityNumber = (ticket) => {
  if (ticket?.identityNumber) return String(ticket.identityNumber).trim();
  if (ticket?.noKTP) return String(ticket.noKTP).trim();
  return buildDummyIdentityNumber(ticket, getTicketIdentityType(ticket));
};

export const getTicketIdentityDisplay = (ticket) => {
  const identityNumber = getTicketIdentityNumber(ticket);
  if (!identityNumber) return "-";
  return `${getIdentityTypeLabel(getTicketIdentityType(ticket))}: ${identityNumber}`;
};

export const getTicketKtp = (ticket) => {
  if (getTicketIdentityType(ticket) !== "ktp") return "";
  return getTicketIdentityNumber(ticket);
};

export const getVisitorKeyFromTicket = (ticket) => {
  const identityNumber = normalizeIdentityNumber(getTicketIdentityNumber(ticket));
  const identityType = getTicketIdentityType(ticket);
  const email = normalizeString(ticket?.email);
  const phone = normalizeString(ticket?.noHP);
  const name = normalizeString(ticket?.namaLengkap);

  if (identityNumber) {
    if (identityType === "ktp") return `ktp:${identityNumber}`;
    return `identity:${identityType || "unknown"}:${identityNumber}`;
  }
  if (email && phone) return `contact:${email}|${phone}`;
  if (email) return `email:${email}`;
  if (phone) return `phone:${phone}`;
  return `name:${name || ticket?.id || "visitor"}`;
};

export const loadHiddenVisitorKeys = () => {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(VISITOR_HIDE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveHiddenVisitorKeys = (keys) => {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(VISITOR_HIDE_KEY, JSON.stringify(keys));
  } catch {
    // noop for dummy mode
  }
};

export const groupTicketsByVisitor = (tickets, hiddenVisitorKeys = []) => {
  const hiddenSet = new Set(hiddenVisitorKeys);
  const groupMap = new Map();

  for (const ticket of tickets) {
    if (isChildVisitorTicket(ticket)) continue;
    const key = getVisitorKeyFromTicket(ticket);
    if (hiddenSet.has(key)) continue;

    if (!groupMap.has(key)) {
      const noIdentitas = getTicketIdentityNumber(ticket);
      const identityType = getTicketIdentityType(ticket);
      groupMap.set(key, {
        visitorKey: key,
        namaLengkap: ticket.namaLengkap || "-",
        email: ticket.email || "-",
        noHP: ticket.noHP || "-",
        noIdentitas: noIdentitas || "-",
        noIdentitasDisplay: noIdentitas
          ? `${getIdentityTypeLabel(identityType)}: ${noIdentitas}`
          : "-",
        noKTP: getTicketKtp(ticket) || "-",
        tickets: [],
      });
    }
    groupMap.get(key).tickets.push(ticket);
  }

  return Array.from(groupMap.values()).sort((a, b) =>
    String(a.namaLengkap || "").localeCompare(String(b.namaLengkap || "")),
  );
};

const getCardActiveStart = (ticket) => ticket?.paidAt || ticket?.createdAt;

const getValidityDuration = (ticket) => {
  const validityLabel = String(FEE_PRICING[ticket?.feeCategory]?.validity || "365 hari").toLowerCase();
  const amountMatch = validityLabel.match(/(\d+)/);
  const amount = amountMatch ? Number(amountMatch[1]) : 365;
  const unit =
    validityLabel.includes("bulan") || validityLabel.includes("month")
      ? "months"
      : "days";

  return {
    amount: amount > 0 ? amount : 365,
    unit,
  };
};

export const getTicketRemainingDays = (ticket) => {
  if (!PAID_STATUSES.has(ticket?.paymentStatus)) return 0;
  const activeStart = new Date(getCardActiveStart(ticket));
  if (Number.isNaN(activeStart.getTime())) return 0;

  const expiresAt = new Date(activeStart);
  const { amount, unit } = getValidityDuration(ticket);
  if (unit === "months") {
    expiresAt.setMonth(expiresAt.getMonth() + amount);
  } else {
    expiresAt.setDate(expiresAt.getDate() + amount);
  }
  const remainingMs = expiresAt.getTime() - Date.now();
  return Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
};

export const getTicketActivityInfo = (ticket) => {
  const remainingDays = getTicketRemainingDays(ticket);
  if (remainingDays > 0) {
    return {
      status: "active",
      label: `${remainingDays} hari`,
      className: "bg-status-approved-bg text-status-approved",
      remainingDays,
    };
  }
  return {
    status: "inactive",
    label: "0 hari",
    className: "bg-slate-200 text-slate-700",
    remainingDays: 0,
  };
};
