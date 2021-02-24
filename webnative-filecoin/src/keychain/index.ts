import { FileSystem } from 'webnative/fs/filesystem'

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
// keychain
// UCANs
// lotus node


export enum Network {
  Main = 'f',
  Test = 't',
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

export type ConstructorParams = {
  fs: FileSystem
  network?: Network
}

export type Address = string

export class Keychain {

  fs: FileSystem
  network: Network

  constructor({ fs, network }: ConstructorParams) {
    this.fs = fs
    this.network = network || Network.Main
  }

  async generateAddress(): Promise<Address> { 
    return 't3q5cgdg2b6uzazz7sbkdjqoafxzvuagbawh76wamwazupvvwzol7glitxs4e2j2wd5ncsg2mltrdt2t6gdisa'
  }

  // does not need to query the filecoin network to get updated balances
  async getAddresses(): Promise<Address[]> { 
    return [
      't3q5cgdg2b6uzazz7sbkdjqoafxzvuagbawh76wamwazupvvwzol7glitxs4e2j2wd5ncsg2mltrdt2t6gdisa',
      't3wgxspnbaktqwk4fnruxzsne4cdu6olopflsowk7fvux6c5vxcxnwhoaimxpgtwc4q6gf27fzsik6axvjaugq'
    ]
  };

  async getBalance(address: string): Promise<number> {
    return 2000
  }

  async getBalances(): Promise<{ [address: string]: number }> {
    return {
        t3q5cgdg2b6uzazz7sbkdjqoafxzvuagbawh76wamwazupvvwzol7glitxs4e2j2wd5ncsg2mltrdt2t6gdisa: 2000,
        t3wgxspnbaktqwk4fnruxzsne4cdu6olopflsowk7fvux6c5vxcxnwhoaimxpgtwc4q6gf27fzsik6axvjaugq: 1000
      }
  }

  async transfer(
    from: Address, // must be an address active in this keychain
    to: Address,   // can be any address on the same network
    amount: number // as integer in attoFIL = 10^(-18) FIL
  ): Promise<Receipt> {
    return {} 
  }
}

export default Keychain
