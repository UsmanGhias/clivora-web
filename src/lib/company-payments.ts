export type CompanyPaymentMethod = "jazzcash" | "easypaisa" | "bank";

export type CompanyPaymentAccountGroup = {
  label: string;
  fields: Array<{
    label: string;
    value: string;
  }>;
};

export type CompanyPaymentAccount = {
  label: string;
  groups: CompanyPaymentAccountGroup[];
};

export const COMPANY_PAYMENT_ACCOUNTS = {
  jazzcash: {
    label: "JazzCash",
    groups: [
      {
        label: "JazzCash receiving account",
        fields: [{ label: "Account / mobile number", value: "03067917467" }],
      },
    ],
  },
  easypaisa: {
    label: "Easypaisa",
    groups: [
      {
        label: "Easypaisa receiving account",
        fields: [{ label: "Account / mobile number", value: "03126912440" }],
      },
    ],
  },
  bank: {
    label: "Bank transfer",
    groups: [
      {
        label: "MCB",
        fields: [
          { label: "Account title", value: "MUHAMMAD USMAN KHAN" },
          { label: "Account number", value: "1632398531004366" },
          { label: "IBAN", value: "PK24MUCB1632398531004366" },
        ],
      },
      {
        label: "Bank Islami",
        fields: [
          { label: "Account title", value: "GHOOSIYA KARYANA STORE" },
          { label: "Account number", value: "217500068400001" },
          { label: "IBAN", value: "PK17BKIP0217500068400001" },
        ],
      },
    ],
  },
} satisfies Record<CompanyPaymentMethod, CompanyPaymentAccount>;

export function getCompanyPaymentAccount(method: string): CompanyPaymentAccount | null {
  return method in COMPANY_PAYMENT_ACCOUNTS
    ? COMPANY_PAYMENT_ACCOUNTS[method as CompanyPaymentMethod]
    : null;
}
