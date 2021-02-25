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
  const privKey = 't3q5cgdg2b6uzazz7sbkdjqoafxzvuagbawh76wamwazupvvwzol7glitxs4e2j2wd5ncsg2mltrdt2t6gdisa'
  const providerAddress = 't3q5cgdg2b6uzazz7sbkdjqoafxzvuagbawh76wamwazupvvwzol7glitxs4e2j2wd5ncsg2mltrdt2t6gdisa'
  return new Wallet({ privKey, providerAddress })
}
