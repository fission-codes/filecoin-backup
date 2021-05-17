<script lang="ts">
  import {
    SkipToContent,
    Header,
    HeaderUtilities,
    HeaderNav,
    HeaderNavItem
  } from 'carbon-components-svelte';
  import { getContext, onMount, onDestroy } from 'svelte';
  import { Wallet } from 'webnative-filecoin';

  /**
   * Carbon theme initialization.
   */

  const ctx: { dark: any; light: any; updateVar: any } = getContext('Theme');

  $: if (ctx) {
    ctx.dark.subscribe((value: boolean) => {
      console.log('dark mode?', value);
    });
    ctx.light.subscribe((value: boolean) => {
      console.log('light mode?', value);
    });
    ctx.updateVar('--cds-productive-heading-06-font-size', '4rem');
  }

  /**
   * Webnative initialization. In order to avoid running webnative on the
   * server, we initialize webnative inside onMount. Default values are
   * provided to avoid server-side errors. We update them as soon as we can
   * on the client.
   */

  let session = {
    username: '',
    errorMessage: '',
    authed: false,
    loading: true,
    error: false
  };
  let wallet: Wallet | null;

  let unsubscribeSession: VoidFunction = () => {};
  let unsubscribeWallet: VoidFunction = () => {};

  onMount(async () => {
    const { sessionStore, walletStore } = await import('../webnative');

    unsubscribeSession = sessionStore.subscribe(val => {
      session = val;
    });

    unsubscribeWallet = walletStore.subscribe(val => {
      wallet = val;
    });
  });

  onDestroy(() => {
    unsubscribeSession();
    unsubscribeWallet();
  });
</script>

<Header company="Fission" platformName="Filecoin Backup" href="/">
  <div slot="skip-to-content">
    <SkipToContent />
  </div>
  <HeaderNav>
    <HeaderNavItem href="/transactions" text="Transactions" />
    <HeaderNavItem href="/backups" text="Backups" />
  </HeaderNav>
  {#if session.authed}
    <HeaderUtilities>
      <div class="indicators">
        <div class="fission-indicator">
          <img class="logo" src="/icon.png" alt="Fission username" />
          <span>{session.username}</span>
        </div>
        {#if wallet}
          <div class="filecoin-indicator">
            {#await wallet?.getBalance() then balance}
              <img
                class="logo"
                src="/filecoin-logo.svg"
                alt="Filecoin wallet balance"
              />
              <span>{balance}</span>
            {:catch}
              <span>🤖💥</span>
            {/await}
          </div>
          <div class="filecoin-indicator">
            {#await wallet?.getProviderBalance() then providerBalance}
              <img
                class="logo"
                src="/filecoin-symbol-color.svg"
                alt="Lotus provider balance"
              />
              <span>{providerBalance}</span>
            {:catch}
              <span>🤖💥</span>
            {/await}
          </div>
        {/if}
      </div>
    </HeaderUtilities>
  {/if}
</Header>

<style>
  .indicators {
    display: grid;
    grid-template-columns: auto auto auto;
    place-items: center right;
    column-gap: 1.5rem;
    padding: 0 1rem;
  }

  .fission-indicator,
  .filecoin-indicator {
    display: grid;
    place-items: center left;
    grid-template-columns: auto 1fr;
    column-gap: 0.5rem;
  }

  .fission-indicator > span,
  .filecoin-indicator > span {
    color: #ffffff;
  }

  .logo {
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
  }

  @media (max-width: 671px) {
    .indicators {
      grid-template-columns: 1fr;
    }

    .filecoin-indicator {
      display: none;
    }
  }
</style>
