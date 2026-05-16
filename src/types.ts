export type FundType = "tip" | "royalty" | "sale";

export interface Work {
  id: string;
  title: string;
  cover: string;
  edition: string;
  holders: number;
  earned: number;
  royaltyRate: number;
  mintSignature?: string;
}

export interface FundFlow {
  id: string;
  type: FundType;
  amount: number;
  currency: string;
  from: string;
  workTitle?: string;
  at: string;
}

export type Tab = "works" | "funds";

export type Action = "mint" | "royalty" | "tip";
