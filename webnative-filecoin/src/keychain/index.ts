import { Either, left, right } from "fp-ts/lib/Either";
import Address from '../filecoin/address';

export enum Network {
  Main = 'f',
  Test = 't',
};

export type BalanceStatement = {
  [address: Address]:bigint;
  blockheight: number;
  network: Network;
}

export class NetworkProviderError extends Error {};
export class InvalidRequestError extends Error {};

export class Receipt {};

export class Keychain {

  async generateAddress(
    network: Network
  ): Promise<Either<NetworkProviderError, Address>> {

  }

  // does not need to query the filecoin network to get updated balances
  async getAddresses(
    network: Network,
  ): Promise<Either<Error, Address[]>> {};

  // does perform an active network request to get the latest balances
  async getBalances(
    network: Network,
    filter?: string // type can be improved probably
  ): Promise<Either<NetworkProviderError | InvalidRequestError, BalanceStatement>> {

  }

  async transfer(
    from: Address, // must be an address active in this keychain
    to: Address,   // can be any address on the same network
    amount: bigint // as integer in attoFIL = 10^(-18) FIL
  ): Promise<Either<NetworkProviderError | InvalidRequestError, Receipt>> {

  }
}

export default Keychain
