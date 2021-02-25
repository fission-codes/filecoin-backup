// API (for phase 2 stuff)
// -----------------------
// - Get Wallet
// - Send
//   + From wallet to lotus node
//   + Probably just amount and address of wallet managed by Lotus node?
// - Balances
//   + Wallet in app
//   + Wallet managed by Lotus node
// 
// Parts:
// keychain
// UCANs
// lotus node


export enum Network {
  Main = 'f',
  Nerpa = 't',
};

export type BalanceStatement = {
  balance: number
  blockheight: number
  network: Network
}

export type Balances = { [address: string]: number }

export class NetworkProviderError extends Error {};
export class InvalidRequestError extends Error {};

export class Receipt {};

export type Address = string

type ConstructorParams = {
  privKey: string
  providerAddress: string
}

export default class Wallet {

  private privKey: string
  providerAddress: string

  constructor({ privKey, providerAddress }: ConstructorParams) {
    this.privKey = privKey
    this.providerAddress = providerAddress
  }

  getAddress(): string {
    return "t3q5cgdg2b6uzazz7sbkdjqoafxzvuagbawh76wamwazupvvwzol7glitxs4e2j2wd5ncsg2mltrdt2t6gdisa"
  }

  getProviderAddress(): string {
    return this.providerAddress
  }

  async getBalance(): Promise<number> {
    return 200
  }

  async getProviderBalance(): Promise<number> {
    return 1500
  }

  async fundProvider(amount: number):  Promise<Receipt> {
    return {}
  }

  async getPrevReceipts(): Promise<Receipt[]> {
    return []
  }
}
