export enum TokenType {
  USDC = 0,
  EURC = 1,
}

export enum OfferStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  Withdrawn = 3,
  Countered = 4,
}

export enum LoanStatus {
  Active = 0,
  Repaid = 1,
  Defaulted = 2,
}

export interface Offer {
  id: bigint;
  parentOfferId: bigint;
  proposer: string;
  counterparty: string;
  borrower: string;
  token: TokenType;
  principal: bigint;
  interestBps: bigint; // e.g., 1000 = 10.00%
  durationSeconds: bigint;
  timestamp: bigint;
  status: OfferStatus;
}

export interface Loan {
  id: bigint;
  offerId: bigint;
  lender: string;
  borrower: string;
  token: TokenType;
  principal: bigint;
  interestBps: bigint;
  totalOwed: bigint;
  totalRepaid: bigint;
  startTime: bigint;
  dueDate: bigint;
  status: LoanStatus;
}

export interface UserReputation {
  loansRepaid: bigint;
  activeLoans: bigint;
  defaulted: bigint;
}

export interface PlatformStats {
  totalFunded: bigint;
  totalRepaid: bigint;
  activeNegotiations: bigint;
}

export interface FormattedOffer {
  id: number;
  parentOfferId: number;
  proposer: string;
  counterparty: string;
  borrower: string;
  token: 'USDC' | 'EURC';
  tokenAddress: string;
  principalFormatted: string;
  principalRaw: bigint;
  interestRatePct: string;
  interestBps: number;
  durationDays: number;
  durationSeconds: number;
  timestampFormatted: string;
  timestampRaw: number;
  status: OfferStatus;
  statusText: 'Pending' | 'Accepted' | 'Rejected' | 'Withdrawn' | 'Countered';
  isBorrower: boolean;
  isProposer: boolean;
  isMyTurn: boolean;
}

export interface FormattedLoan {
  id: number;
  offerId: number;
  lender: string;
  borrower: string;
  token: 'USDC' | 'EURC';
  tokenAddress: string;
  principalFormatted: string;
  principalRaw: bigint;
  interestRatePct: string;
  totalOwedFormatted: string;
  totalOwedRaw: bigint;
  totalRepaidFormatted: string;
  totalRepaidRaw: bigint;
  remainingOwedFormatted: string;
  remainingOwedRaw: bigint;
  repaymentProgressPct: number;
  startTimeFormatted: string;
  dueDateFormatted: string;
  dueDateRaw: number;
  isOverdue: boolean;
  status: LoanStatus;
  statusText: 'Active' | 'Repaid' | 'Defaulted';
  isBorrower: boolean;
  isLender: boolean;
}
