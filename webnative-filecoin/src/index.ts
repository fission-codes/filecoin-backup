import { FileSystem } from 'webnative/fs/filesystem'
import Wallet from './wallet';

// Ben's train of thought: (3 feb 2021)
// discussion: initialisation / setup
// how does webnative-filecoin best extend webnative?
//
// local storage is shared storage for all code in the page
// so webnative-filecoin could exist next to webnative
// and be initialised separately;
// but we do want to get access to specific paths and resources from auth-lobby
//   eg. "wnfs: alice.fission.name/Keychain/fission/backup"
//   and "keychain: alice.fission.name/Keychain/fission/backup"
//
// see proposal open for discussion and edits:
//   https://talk.fission.codes/t/ucan-delegation-for-cosigning/1424
// one option may be to initialise webnative from within webnative-filecoin
// and the user only has to think about webnative-filecoin
// I welcome better ideas, but will just for now assume such an "embedded model".

// TODO: Authorized State should also have optional keychain, next to fs

export const initialise = async (fs: FileSystem): Promise<Wallet> => {
  const privKey = 'privKey'
  const address = 't3q5cgdg2b6uzazz7sbkdjqoafxzvuagbawh76wamwazupvvwzol7glitxs4e2j2wd5ncsg2mltrdt2t6gdisa'
  const providerAddress = 't1golw5yofvrksvnlxtiayovr7ptthae6n54ah6na'
  const balance = 10
  const providerBalance = 250.3
  const receiptTemplate = {
    from: address,
    to: providerAddress,
    amount: 0,
    time: Date.now(),
    blockheight: 31330
  }
  const receipts = [
    {
      ...receiptTemplate,
      amount: 1,
      time: 1612376941000
    },
    {
      ...receiptTemplate,
      amount: 2.2,
      time: 1613413741000
    }
  ] 
  return new Wallet({ privKey, address, providerAddress, balance, providerBalance, receipts })
}
