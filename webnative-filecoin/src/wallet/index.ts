import Keychain, { Address, Balances, BalanceStatement, Receipt } from '../keychain'

type ConstructorParams = {
  personalAddress: string
  providerAddress: string
  keychain: Keychain
}

export default class Wallet {

  personalAddress: string
  providerAddress: string
  keychain: Keychain

  constructor({ personalAddress, providerAddress, keychain }: ConstructorParams) {
    this.personalAddress = personalAddress
    this.providerAddress = providerAddress
    this.keychain = keychain
  }

  getPersonalAddress(): string {
    return this.personalAddress
  }

  getProviderAddress(): string {
    return this.providerAddress
  }

  async getWalletBalances(): Promise<Balances> {
    return this.keychain.getBalances()
  }

  async getTotalWalletBalance(): Promise<number> {
    const statement = await this.getWalletBalances()
    return Object.values(statement.balances)
      .reduce((acc, cur) => acc + cur)
  }

  async getProviderBalance(): Promise<number> {
    return 1500
  }

  async fundProvider(amount: number):  Promise<Receipt> {
    return this.keychain.transfer(this.personalAddress, this.providerAddress, amount)
  }

  async getPrevReceipts(): Promise<Receipt[]> {
    return []
  }
}
