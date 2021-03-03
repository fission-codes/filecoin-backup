<script lang="ts">
  import {
    Button,
    DataTable,
    Form,
    FormGroup,
    NumberInput,
    CodeSnippet,
    Row,
    Column,
    Loading
  } from 'carbon-components-svelte';
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '@sapper/app';
  import copy from 'clipboard-copy';
  import type Wallet from '../../webnative-filecoin/src/wallet';

  const headers = [
    { key: 'date', value: 'Date' },
    { key: 'amount', value: 'Amount' }
  ];

  const placeholderRows = [
    {
      id: 'a',
      date: '02/03/2021',
      amount: '1.0'
    },
    {
      id: 'b',
      date: '02/11/2021',
      amount: '2.2'
    },
    {
      id: 'c',
      date: '02/12/2021',
      amount: '90.5'
    }
  ];
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
  let wallet: Wallet | undefined;

  let unsubscribeSession: VoidFunction = () => {};
  let unsubscribeWallet: VoidFunction = () => {};

  onMount(async () => {
    const { sessionStore, walletStore } = await import('../webnative');

    unsubscribeSession = sessionStore.subscribe(val => {
      if (!val.loading && !val.authed) {
        goto('/');
      }
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

  let sendProviderAmount = 0;

  async function sendProviderFunds() {
    if (wallet !== undefined) {
      const receipt = await wallet.fundProvider(sendProviderAmount);
    }
  }
</script>

{#if session.loading}
  <div class="loading">
    <Loading withOverlay={false} />
  </div>
{:else if session.authed}
  <Row>
    <Column padding aspectRatio="16x9" style="margin: 2rem">
      <Row>
        <Column>
          <Row>
            <Column>
              <div class="balance">
                {#if wallet !== undefined}
                  {#await wallet?.getBalance() then balance}
                    <h1 class="balance-value">{balance}</h1>
                  {:catch}
                    <h1 class="balance-value">Error</h1>
                  {/await}
                {/if}
                <div class="balance-label">
                  <img
                    class="logo"
                    src="/filecoin-logo.svg"
                    alt="Filecoin wallet balance"
                  />
                  <h2>Filecoin Wallet</h2>
                </div>
              </div>
            </Column>
          </Row>
          <Row>
            <Column
              padding
              aspectRatio="3x4"
              style="border: 2px solid #aaa; border-radius: 4px; margin: 2rem"
            >
              <div class="card">
                <h2>Filecoin Wallet</h2>
                <p>
                  Filecoin Backup is currently running on the
                  <span class="bold">Calibration</span> testnet.
                </p>
                <h4>Add Funds</h4>
                <p>
                  Please visit the
                  <a
                    href="https://faucet.calibration.fildev.network/"
                    target="_blank"
                  >
                    Lotus Devnet Faucet
                  </a>
                  to deposit FIL to your wallet.
                </p>
                {#if wallet !== undefined}
                  <CodeSnippet
                    wrapText
                    type="multi"
                    code={wallet?.getAddress() || ''}
                    on:click={() => copy(wallet?.getAddress() || '')}
                  />
                {/if}
              </div>
            </Column>
          </Row>
        </Column>
        <Column>
          <Row>
            <Column>
              <div class="balance">
                {#if wallet !== undefined}
                  {#await wallet?.getProviderBalance() then providerBalance}
                    <h1 class="balance-value">{providerBalance}</h1>
                  {:catch}
                    <h1 class="balance-value">Error</h1>
                  {/await}
                {/if}
                <div class="balance-label">
                  <img
                    class="logo"
                    src="/filecoin-symbol-color.svg"
                    alt="Lotus provider balance"
                  />
                  <h2>Lotus Provider</h2>
                </div>
              </div>
            </Column>
          </Row>
          <Row>
            <Column
              padding
              aspectRatio="3x4"
              style="border: 2px solid #aaa; border-radius: 4px; margin: 2rem"
            >
              <div class="card">
                <h2>Lotus Provider</h2>
                <p>
                  Before you can make a storage deal, you will want to send some
                  Filecoin to a Lotus provider. We have configured a Lotus
                  Provider for you to use. Once the Lotus provider is holding
                  your funds, you will be ready to start backing up files!
                </p>
                <h4>Send Funds to Lotus Provider</h4>
                <Form on:submit={sendProviderFunds}>
                  <FormGroup>
                    <NumberInput
                      helperText="Enter the amount of FIL to send"
                      step={0.01}
                      bind:value={sendProviderAmount}
                    />
                  </FormGroup>
                  <Button type="submit">Send Funds</Button>
                </Form>
                <h4>Transactions</h4>
                <p>
                  Funds sent from your Filecoin wallet to the Lotus Provider are
                  listed here. Check the backups page for a listing of storage
                  deals.
                </p>
                <DataTable {headers} rows={placeholderRows} />
              </div>
            </Column>
          </Row>
        </Column>
      </Row>
    </Column>
  </Row>
{/if}

<style>
  .loading {
    display: grid;
    place-items: center center;
    height: 100%;
  }

  .balance {
    display: grid;
    place-items: center center;
    grid-gap: 0.3rem;
  }

  .balance-value {
    font-size: 82px;
  }

  .balance-label {
    display: grid;
    place-items: center center;
    grid-template-columns: auto 1fr;
    grid-gap: 1rem;
  }

  .logo {
    display: inline-block;
    width: 3rem;
    height: 3rem;
  }

  .card {
    display: grid;
    row-gap: 1rem;
  }

  .bold {
    font-weight: bold;
  }
</style>
