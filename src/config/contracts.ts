import { defineChain } from 'viem';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// Arc Testnet Chain Definition
export const arcTestnet = defineChain({
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: { name: 'Arc', symbol: 'ARC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.arc.network'] },
  },
  blockExplorers: {
    default: { name: 'ArcScan', url: 'https://testnet.arcscan.app' },
  },
  testnet: true,
});

export const wagmiConfig = getDefaultConfig({
  appName: 'Veloure',
  projectId: '9246f4227172e7e854c7d089fa466419',
  chains: [arcTestnet],
  ssr: false,
});

export const VELOURE_CONTRACT_ADDRESS = '0xC2E23240052637dB85e7c5d5c18041fa7818676e' as const;
export const USDC_ADDRESS = '0x3600000000000000000000000000000000000000' as const;
export const EURC_ADDRESS = '0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a' as const;
export const OWNER_ADDRESS = '0xb5EFA2B7004F79cAC0F8f7B1557f20238a2346Ee' as const;

export const ERC20_ABI = [
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'decimals',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint8' }],
  },
  {
    type: 'function',
    name: 'symbol',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'string' }],
  },
] as const;

export const VELOURE_ABI = [
  // Functions
  {
    type: 'function',
    name: 'createOffer',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'borrower', type: 'address' },
      { name: 'token', type: 'uint8' },
      { name: 'principal', type: 'uint256' },
      { name: 'interestBps', type: 'uint256' },
      { name: 'durationSeconds', type: 'uint256' },
    ],
    outputs: [{ name: 'offerId', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'counterOffer',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'parentOfferId', type: 'uint256' },
      { name: 'principal', type: 'uint256' },
      { name: 'interestBps', type: 'uint256' },
      { name: 'durationSeconds', type: 'uint256' },
    ],
    outputs: [{ name: 'offerId', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'acceptOffer',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'offerId', type: 'uint256' }],
    outputs: [{ name: 'loanId', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'rejectOffer',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'offerId', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'withdrawOffer',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'offerId', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'repayLoan',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'loanId', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'markDefaulted',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'loanId', type: 'uint256' }],
    outputs: [],
  },

  // View functions
  {
    type: 'function',
    name: 'getOffer',
    stateMutability: 'view',
    inputs: [{ name: 'offerId', type: 'uint256' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'parentOfferId', type: 'uint256' },
          { name: 'proposer', type: 'address' },
          { name: 'counterparty', type: 'address' },
          { name: 'borrower', type: 'address' },
          { name: 'token', type: 'uint8' },
          { name: 'principal', type: 'uint256' },
          { name: 'interestBps', type: 'uint256' },
          { name: 'durationSeconds', type: 'uint256' },
          { name: 'timestamp', type: 'uint256' },
          { name: 'status', type: 'uint8' }, // 0: Pending, 1: Accepted, 2: Rejected, 3: Withdrawn, 4: Countered
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'getLoan',
    stateMutability: 'view',
    inputs: [{ name: 'loanId', type: 'uint256' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'offerId', type: 'uint256' },
          { name: 'lender', type: 'address' },
          { name: 'borrower', type: 'address' },
          { name: 'token', type: 'uint8' },
          { name: 'principal', type: 'uint256' },
          { name: 'interestBps', type: 'uint256' },
          { name: 'totalOwed', type: 'uint256' },
          { name: 'totalRepaid', type: 'uint256' },
          { name: 'startTime', type: 'uint256' },
          { name: 'dueDate', type: 'uint256' },
          { name: 'status', type: 'uint8' }, // 0: Active, 1: Repaid, 2: Defaulted
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'getReputation',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: 'loansRepaid', type: 'uint256' },
      { name: 'activeLoans', type: 'uint256' },
      { name: 'defaulted', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'getOffersReceivedBy',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'uint256[]' }],
  },
  {
    type: 'function',
    name: 'getOffersMadeBy',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'uint256[]' }],
  },
  {
    type: 'function',
    name: 'getLoansAsBorrower',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'uint256[]' }],
  },
  {
    type: 'function',
    name: 'getLoansAsLender',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'uint256[]' }],
  },
  {
    type: 'function',
    name: 'getRemainingOwed',
    stateMutability: 'view',
    inputs: [{ name: 'loanId', type: 'uint256' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'isOverdue',
    stateMutability: 'view',
    inputs: [{ name: 'loanId', type: 'uint256' }],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function',
    name: 'getPlatformStats',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'totalFunded', type: 'uint256' },
      { name: 'totalRepaid', type: 'uint256' },
      { name: 'activeNegotiations', type: 'uint256' },
    ],
  },
] as const;
