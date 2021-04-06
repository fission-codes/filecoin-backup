<script lang="ts">
  import {
    Button,
    CodeSnippet,
    Column,
    DataTable,
    Form,
    FormGroup,
    Link,
    Loading,
    NumberInput,
    Row,
    TextInput
  } from 'carbon-components-svelte';
  import Launch16 from 'carbon-icons-svelte/lib/Launch16';
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '@sapper/app';
  import copy from 'clipboard-copy';
  import { Wallet, Receipt, MessageStatus } from 'webnative-filecoin';

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
  let sendFunds: VoidFunction = () => {};
  let sendProviderFunds: VoidFunction = () => {};
  let refreshBalance: VoidFunction = () => {};

  /**
   * Transactions. We keep track of transactions and transaction status.
   * Transactions are displayed in a table with headers that can reasonably
   * be displayed on a device with some fields center ellipsed. Display dates
   * are localized with navigator.location.
   * Transaction status tracks in-progress, completed, and erring transactions,
   * and a message displayed below forms where transactions are submitted.
   * Transactions are added to the transaction history on successful completion.
   */
  type Transaction = {
    id: string;
    date: string;
    destination: string;
    amount: string;
    messageId: string;
  };

  type TransactionStatus = {
    status: 'in-progress' | 'complete' | 'error' | null;
    message: string;
  };

  let transactions: Transaction[] = [];
  let transactionHeaders = [
    { key: 'date', value: 'Date' },
    { key: 'destination', value: 'Destination Address' },
    { key: 'amount', value: 'Amount' },
    { key: 'messageId', value: 'Message ID' }
  ];

  if (process.browser) {
    if (window.innerWidth < 672) {
      transactionHeaders = [
        { key: 'date', value: 'Date' },
        { key: 'amount', value: 'Amount' },
        { key: 'messageId', value: 'Message ID' }
      ];
    }
  }

  let transactionStatus: TransactionStatus = {
    status: null,
    message: ''
  };

  let providerTransactionStatus: TransactionStatus = {
    status: null,
    message: ''
  };

  $: {
    const receipts = wallet?.getPrevReceipts();
    if (transactions.length === 0) {
      receipts?.forEach(receipt => {
        transactions = [
          ...transactions,
          {
            id: receipt.time.toString(),
            date: formatDate(receipt.time),
            destination: receipt.to,
            amount: String(receipt.amount),
            messageId: receipt.messageId
          }
        ];
      });
    }
  }

  function ellipse(str: string): string {
    let ellipsedString = '';

    if (process.browser) {
      if (window.innerWidth < 672) {
        const leading = str.slice(0, 6);
        const trailing = str.slice(-4);
        ellipsedString = leading + '...' + trailing;
      } else if (window.innerWidth < 1056) {
        const leading = str.slice(0, 10);
        const trailing = str.slice(-6);
        ellipsedString = leading + '...' + trailing;
      } else if (str.length > 62) {
        const leading = str.slice(0, 42);
        const trailing = str.slice(-18);
        ellipsedString = leading + '...' + trailing;
      } else {
        return str;
      }
    }
    return ellipsedString;
  }

  function formatDate(timestamp: number): string {
    const date: Date = new Date(+timestamp);
    const lang: string = navigator.language;
    const formatOptions: Intl.DateTimeFormatOptions = {
      dateStyle: 'long',
      timeStyle: 'short'
    };

    const formattedDate: string = new Intl.DateTimeFormat(
      lang,
      formatOptions
    ).format(date);
    return formattedDate;
  }

  onMount(async () => {
    const { sessionStore, walletStore, refreshWallet } = await import(
      '../webnative'
    );

    unsubscribeSession = sessionStore.subscribe(val => {
      if (!val.loading && !val.authed) {
        goto('/');
      }
      session = val;
    });

    unsubscribeWallet = walletStore.subscribe(val => {
      wallet = val;
    });

    sendFunds = async () => {
      if (wallet !== undefined) {
        transactionStatus = {
          status: 'in-progress',
          message: ' Sending funds'
        };
        const receipt = await wallet.send(sendAmount, destinationAddress);
        wallet
          .waitForReceipt(receipt.messageId, MessageStatus.Partial)
          .then(async (receipt: Receipt) => {
            walletStore.update(wallet => wallet);
            transactionStatus = {
              status: 'complete',
              message: `✅ Sent ${receipt.amount} FIL`
            };
            updateTransactions(receipt);
          })
          .catch((err: Error) => {
            transactionStatus = {
              status: 'error',
              message: `❌ ${err.message}`
            };
          });
      }
    };

    sendProviderFunds = async () => {
      if (wallet !== undefined) {
        providerTransactionStatus = {
          status: 'in-progress',
          message: ' Sending funds to Lotus Provider'
        };
        const receipt = await wallet.fundProvider(sendProviderAmount);
        wallet
          .waitForReceipt(receipt.messageId, MessageStatus.Partial)
          .then(async (receipt: Receipt) => {
            walletStore.update(wallet => wallet);
            providerTransactionStatus = {
              status: 'complete',
              message: `✅ Sent ${receipt.amount} FIL to Lotus Provider`
            };
            updateTransactions(receipt);
          })
          .catch((err: Error) => {
            providerTransactionStatus = {
              status: 'error',
              message: `❌ ${err.message}`
            };
          });
      }
    };

    function updateTransactions(receipt: Receipt) {
      transactions = [
        ...transactions,
        {
          id: receipt.time.toString(),
          date: formatDate(receipt.time),
          destination: receipt.to,
          amount: String(receipt.amount),
          messageId: receipt.messageId
        }
      ];
    }

    refreshBalance = async () => {
      refreshWallet();
    };
  });

  onDestroy(() => {
    unsubscribeSession();
    unsubscribeWallet();
  });

  let destinationAddress = '';
  let sendAmount: number = 1;
  let sendProviderAmount: number = 1;
</script>

{#if session.loading}
  <div class="loading">
    <Loading withOverlay={false} />
  </div>
{:else if session.authed}
  <Row>
    <Column padding>
      <Row>
        <Column sm={4} md={8} lg={8}>
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
              aspectRatio="4x3"
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
                <Button
                  size="small"
                  kind="tertiary"
                  on:click={() => refreshBalance()}
                >
                  Refresh Balance
                </Button>
                <h4>Send Funds</h4>
                <p>Enter a destination address and an amount of FIL to send.</p>
                <Form on:submit={sendFunds}>
                  <FormGroup>
                    <Row>
                      <Column>
                        <TextInput
                          labelText="Destination"
                          bind:value={destinationAddress}
                        />
                      </Column>
                      <Column>
                        <NumberInput
                          label="Amount"
                          min={0.01}
                          step={0.01}
                          invalidText="Minimum amount is 0.01"
                          bind:value={sendAmount}
                        />
                      </Column>
                    </Row>
                  </FormGroup>
                  <Button type="submit">Send Funds</Button>
                </Form>
                {#if transactionStatus.status === 'in-progress'}
                  <span class="sending-funds">
                    {transactionStatus.message}
                  </span>
                {:else}
                  <span>{transactionStatus.message}</span>
                {/if}
              </div>
            </Column>
          </Row>
        </Column>
        <Column sm={4} md={8} lg={8}>
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
              aspectRatio="4x3"
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
                <p>Enter the amount of FIL to send to your Lotus provider.</p>
                <Form on:submit={sendProviderFunds}>
                  <FormGroup>
                    <NumberInput
                      label="Amount"
                      min={0.01}
                      step={0.01}
                      invalidText="Minimum amount is 0.01"
                      bind:value={sendProviderAmount}
                    />
                  </FormGroup>
                  <Button type="submit">Send Funds</Button>
                </Form>
                {#if providerTransactionStatus.status === 'in-progress'}
                  <span class="sending-funds">
                    {providerTransactionStatus.message}
                  </span>
                {:else}
                  <span>{providerTransactionStatus.message}</span>
                {/if}
              </div>
            </Column>
          </Row>
        </Column>
      </Row>
    </Column>
  </Row>
  <Row>
    <Column padding style="margin: 1rem;">
      {#if transactions.length > 0}
        <div class="transactions">
          <h2>Transactions</h2>
          <DataTable headers={transactionHeaders} rows={transactions}>
            <span slot="cell" let:row let:cell>
              {#if cell.key === 'messageId'}
                <Link
                  inline
                  href="https://calibration.filscan.io/#/tipset/message-detail?cid={cell.value}"
                  target="_blank"
                >
                  {ellipse(cell.value)}
                  <Launch16 />
                </Link>
              {:else if cell.key === 'destination'}
                <Link
                  inline
                  href="https://calibration.filscan.io/#/tipset/address-detail?address={cell.value}"
                  target="_blank"
                >
                  {ellipse(cell.value)}
                  <Launch16 />
                </Link>
              {:else}
                {cell.value}
              {/if}
            </span>
          </DataTable>
        </div>
      {/if}
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

  .card,
  .transactions {
    display: grid;
    row-gap: 1rem;
  }

  .bold {
    font-weight: bold;
  }

  .sending-funds {
    display: inline-block;
    overflow: hidden;
    height: 1.3em;
    margin-top: -0.3em;
    line-height: 1.5em;
    vertical-align: text-bottom;
  }

  .sending-funds::before {
    display: inline-table;
    white-space: pre;
    text-align: left;
    content: '⠋\A⠙\A⠹\A⠸\A⠼\A⠴\A⠦\A⠧\A⠇\A⠏';
    animation: spin 1s steps(10) infinite;
  }

  @keyframes spin {
    to {
      transform: translateY(-15em);
    }
  }
</style>
