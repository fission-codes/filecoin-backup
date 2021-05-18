import * as webnative from 'webnative';
import * as filecoin from 'webnative-filecoin';
import { Wallet } from 'webnative-filecoin';
import { writable, Writable } from 'svelte/store';


export type Session = {
  username: string;
  errorMessage: string;
  loading: boolean;
  authed: boolean;
  error: boolean;
}

export const sessionStore: Writable<Session> =
  writable({
    username: '',
    errorMessage: '',
    authed: false,
    loading: true,
    error: false
  });

export const walletStore: Writable<Wallet | null> =
  writable(null);

let state: webnative.State;

const fissionInit = {
  permissions: {
    app: {
      name: "filecoin-backup",
      creator: "bgins"
    },
    fs: {
      private: [filecoin.DEFAULT_KEY_PERMISSION]
    }
  }
}

export async function initialize() {
  webnative.initialise(fissionInit).then(async st => {
    state = st;

    switch (state.scenario) {
      case webnative.Scenario.AuthCancelled:
      case webnative.Scenario.NotAuthorised:
        sessionStore.set({
          username: '',
          errorMessage: '',
          authed: false,
          loading: false,
          error: false
        });
        break;

      case webnative.Scenario.AuthSucceeded:
      case webnative.Scenario.Continuation:
        sessionStore.set({
          username: state.username,
          errorMessage: '',
          loading: false,
          authed: true,
          error: false
        });

        if (state.fs) {
          const wallet = await filecoin.getWallet(state.fs, webnative);
          walletStore.set(wallet);
        }
        break;
    }
  }).catch(err => {
    switch (err) {
      case webnative.InitialisationError.InsecureContext:
        sessionStore.set({
          username: '',
          errorMessage: 'Cannot authorize in an insecure context.',
          authed: false,
          loading: false,
          error: true
        });
        break;

      case webnative.InitialisationError.UnsupportedBrowser:
        sessionStore.set({
          username: '',
          errorMessage: 'This browser is not supported by webnative.',
          authed: false,
          loading: false,
          error: true
        });
        break;
    }
  })
}

export function redirectToLobby() {
  webnative.redirectToLobby(state.permissions);
}