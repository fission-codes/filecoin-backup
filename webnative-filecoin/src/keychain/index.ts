// import Address from '../filecoin/address';
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

export enum Network {
  Main = 'f',
  Test = 't',
};

export type BalanceStatement = {
  balances: { [address: string]: number }
  blockheight: number;
  network: Network;
}

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

  // does perform an active network request to get the latest balances
  async getBalances(filter?: string): Promise<BalanceStatement> {
    return {
      balances: {
        t3q5cgdg2b6uzazz7sbkdjqoafxzvuagbawh76wamwazupvvwzol7glitxs4e2j2wd5ncsg2mltrdt2t6gdisa: 2000,
        t3wgxspnbaktqwk4fnruxzsne4cdu6olopflsowk7fvux6c5vxcxnwhoaimxpgtwc4q6gf27fzsik6axvjaugq: 1000
      },
      blockheight: 311003,
      network: Network.Test,
    }
  }

  async transfer(
    from: Address, // must be an address active in this keychain
    to: Address,   // can be any address on the same network
    amount: bigint // as integer in attoFIL = 10^(-18) FIL
  ): Promise<Receipt> {
    return {} 
  }
}

export default Keychain
