<script lang="ts">
  import {
    Button,
    Row,
    Column,
    Select,
    SelectItem,
    Loading
  } from 'carbon-components-svelte';
  import { getContext, onMount, onDestroy } from 'svelte';
  import { goto } from '@sapper/app';

  /**
   * Carbon theme initialization.
   */

  const { carbon_theme } = getContext('Theme');

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
  let login: VoidFunction;
  let unsubscribe: VoidFunction = () => {};

  onMount(async () => {
    const { redirectToLobby, sessionStore } = await import('../webnative');
    login = redirectToLobby;

    unsubscribe = sessionStore.subscribe(val => {
      session = val;
    });
  });

  onDestroy(unsubscribe);
</script>

{#if session.loading}
  <div class="loading">
    <Loading withOverlay={false} />
  </div>
{:else if session.authed}
  <Row>
    <Column
      padding
      aspectRatio="4x3"
      style="border: 2px solid #aaa; border-radius: 4px; margin: 2rem"
    >
      <div class="card">
        <h2>Welcome</h2>
        <p>
          Filecoin Backup App integrates Fission webnative and Filecoin to store
          your files in the browser and on the Filecoin network.
        </p>
        <h4>Select a Theme</h4>
        <Select
          labelText="Theme"
          bind:selected={$carbon_theme}
          style="margin-bottom: 1rem"
        >
          <SelectItem value="white" text="White" />
          <SelectItem value="g10" text="Gray 10" />
          <SelectItem value="g90" text="Gray 90" />
          <SelectItem value="g100" text="Gray 100" />
        </Select>
      </div>
    </Column>
    <Column
      padding
      aspectRatio="4x3"
      style="border: 2px solid #aaa; border-radius: 4px; margin: 2rem"
    >
      <div class="card">
        <h2>Transactions</h2>
        <p>Explanation of Filecoin wallet and Lotus provider goes here.</p>
        <p>
          A button linking to the transactions page goes here. Funds are
          deposited and transfered on this page.
        </p>
        <Button on:click={() => goto('/transactions')}>
          View Transactions
        </Button>
      </div>
    </Column>
  </Row>
  <Row>
    <Column
      padding
      aspectRatio="4x3"
      style="border: 2px solid #aaa; border-radius: 4px; margin: 2rem"
    >
      <div class="card">
        <h2>Backups</h2>
        <p>
          Explanation of webnative hot storage and Filecoin backups go here.
        </p>
        <p>A button linking to the backups page goes here.</p>
      </div>
    </Column>
    <Column
      padding
      aspectRatio="4x3"
      style="border: 2px solid #aaa; border-radius: 4px; margin: 2rem"
    >
      <div class="card">
        <h2>Community</h2>
        <p>A bunch of social and community links go here.</p>
      </div>
    </Column>
  </Row>
{:else if session.error}
  <h2 class="error">session.errorMessage</h2>
{:else}
  <Row>
    <Column sm={4} md={{ span: 4, offset: 2 }} lg={{ span: 8, offset: 4 }}>
      <Row>
        <div class="welcome">
          <h1>Welcome to Filecoin Backup</h1>
          <p>
            Filecoin Backup App integrates Fission webnative and Filecoin to
            store your files in the browser and to the Filecoin network. Please
            sign in with Fission to get started.
          </p>
        </div>
      </Row>
      <Row style="padding-top: 1rem">
        <Button on:click={login}>Sign in</Button>
      </Row>
    </Column>
  </Row>
{/if}

<style>
  .loading,
  .error {
    display: grid;
    place-items: center center;
    height: calc(100vh - 4rem);
  }

  .welcome {
    display: grid;
    row-gap: 1rem;
    padding-top: 2rem;
  }

  .card {
    display: grid;
    row-gap: 0.5rem;
  }
</style>
