<script lang="ts">
  import {
    Button,
    ButtonSet,
    CodeSnippet,
    Column,
    DataTable,
    DataTableSkeleton,
    Form,
    FormGroup,
    InlineNotification,
    Link,
    Loading,
    NotificationActionButton,
    Row,
    Tab,
    Tabs,
    TabContent,
    TextInput
  } from 'carbon-components-svelte';
  import Launch16 from 'carbon-icons-svelte/lib/Launch16';
  import Help16 from 'carbon-icons-svelte/lib/Help16';
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '@sapper/app';
  import copy from 'clipboard-copy';

  import { MessageStatus, Receipt, Wallet } from 'webnative-filecoin';
  import { ellipse, formatDate } from '../utils';

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
  let cosignPermission = {
    valid: false,
    error: false,
    errorMessage: ''
  };

  let unsubscribeSession: VoidFunction = () => {};
  let unsubscribeWallet: VoidFunction = () => {};
  let requestPermissions: VoidFunction = () => {};
  let requestBid: VoidFunction = () => {};
  let makeStorageDeal: VoidFunction = () => {};
  let declineStorageDeal: VoidFunction = () => {};
  let makeRetrievalDeal: VoidFunction = () => {};
  let declineRetrievalDeal: VoidFunction = () => {};

  let storageCid: string;
  let retrievalCid: string =
    'bafybeif7nycaqgibjwdca44xneeo7654ivi6mprxbnl3x7dcpjzydoktjm';
  let bid: boolean = false;

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

      // Check for cosigning permission and listen for expiration.
      if (wallet?.ucan) {
        cosignPermission.valid = true;
        wallet.onExpire(() => (cosignPermission.valid = false));
      } else {
        cosignPermission.valid = false;
      }
    });

    requestPermissions = async () => {
      if (wallet) {
        wallet
          .requestPermissions()
          .then(() => {
            cosignPermission.valid = true;
          })
          .catch(err => {
            cosignPermission.error = true;
            cosignPermission.errorMessage = err.data;
          });
      }
    };

    requestBid = async () => {
      if (storageCid === '') {
        storageCid = 'placeholder';
      }
      bid = true;
    };

    makeStorageDeal = async () => {
      console.log('making storage deal');
    };

    declineStorageDeal = async () => {
      storageCid = '';
      bid = false;
      console.log('storage deal declined');
    };

    makeRetrievalDeal = async () => {
      console.log('making retrieval deal');
    };

    declineRetrievalDeal = async () => {
      retrievalCid = '';
      console.log('retrieval deal declined');
    };
  });

  onDestroy(() => {
    unsubscribeSession();
    unsubscribeWallet();
  });
</script>

{#if session.loading}
  <div class="loading">
    <Loading withOverlay={false} />
  </div>
{:else if session.authed}
  <Row>
    <Column padding>
      {#if !cosignPermission.valid && !cosignPermission.error}
        <Row>
          <Column style="margin: 0 1rem;">
            <InlineNotification
              hideCloseButton
              lowContrast
              kind="info"
              title="Permissions required:"
              subtitle="Please grant cosigning permission to make storage deals."
            >
              <Link
                target="_blank"
                style="color: #666; padding: 0 2px"
                href="https://talk.fission.codes/t/filecoin-backup-faq/1901"
              >
                <Help16>
                  <title>More information on cosigning permissions</title>
                </Help16>
              </Link>
              <div slot="actions" on:click={() => requestPermissions()}>
                <NotificationActionButton>
                  Request Permissions
                </NotificationActionButton>
              </div>
            </InlineNotification>
          </Column>
        </Row>
      {:else if cosignPermission.error}
        <Row>
          <Column style="margin: 0 1rem;">
            <InlineNotification
              lowContrast
              kind="error"
              title="Permission request failed:"
              subtitle={cosignPermission.errorMessage}
            />
          </Column>
        </Row>
      {/if}
      <Row>
        <Column>
          <Row>
            <Column
              padding
              style="border: 2px solid #aaa; border-radius: 4px; margin: 2rem"
            >
              <Tabs>
                <Tab label="Storage Deals" />
                <Tab label="Retrievals" />
                <div slot="content">
                  <TabContent>
                    <div class="tab">
                      {#if !bid}
                        <h4>Make a Storage Deal</h4>
                        <p>Enter a CID for file larger than 32GB in size.</p>
                        <Form on:submit={requestBid}>
                          <FormGroup>
                            <Row>
                              <Column>
                                <TextInput
                                  labelText="CID"
                                  disabled={!cosignPermission.valid}
                                  bind:value={storageCid}
                                />
                              </Column>
                            </Row>
                          </FormGroup>
                          <Button
                            type="submit"
                            disabled={!cosignPermission.valid ||
                              storageCid.length === 0}
                          >
                            Request Bid
                          </Button>
                        </Form>
                        <h4>Backup WNFS</h4>
                        <p>Backup your entire Webnative Filesystem.</p>
                        <Button
                          disabled={!cosignPermission.valid}
                          on:click={requestBid}
                        >
                          Backup WNFS
                        </Button>
                      {:else}
                        <h4>Review Storage Deal details</h4>
                        <p>protolabs will store</p>
                        <CodeSnippet
                          code={storageCid}
                          on:click={() => copy(storageCid)}
                        />
                        <p>for 2 FIL until Jan 26, 2022.</p>
                        <ButtonSet>
                          <Button
                            disabled={!cosignPermission.valid}
                            on:click={makeStorageDeal}
                          >
                            Accept
                          </Button>
                          <Button
                            kind="secondary"
                            disabled={!cosignPermission.valid}
                            on:click={declineStorageDeal}
                          >
                            Decline
                          </Button>
                        </ButtonSet>
                      {/if}
                      <h4>Storage Deals</h4>
                      <DataTableSkeleton
                        headers={[
                          'CID',
                          'Provider',
                          'Size',
                          'Status',
                          'Expires On',
                          'Retrieve'
                        ]}
                        rows={6}
                        showHeader={false}
                        showToolbar={false}
                      />
                    </div>
                  </TabContent>
                  <TabContent>
                    <div class="tab">
                      {#if retrievalCid}
                        <h4>Review retrieval details</h4>
                        <p>unthaw-bear will retrieve</p>
                        <CodeSnippet
                          code={retrievalCid}
                          on:click={() => copy(retrievalCid)}
                        />
                        <p>for 0.25 FIL.</p>
                        <ButtonSet>
                          <Button
                            disabled={!cosignPermission.valid}
                            on:click={makeRetrievalDeal}
                          >
                            Accept
                          </Button>
                          <Button
                            kind="secondary"
                            disabled={!cosignPermission.valid}
                            on:click={declineRetrievalDeal}
                          >
                            Decline
                          </Button>
                        </ButtonSet>
                      {/if}
                      <h4>Retrievals</h4>
                      <DataTableSkeleton
                        headers={[
                          'CID',
                          'Provider',
                          'Size',
                          'Status',
                          'Download Link'
                        ]}
                        rows={6}
                        showHeader={false}
                        showToolbar={false}
                      />
                    </div>
                  </TabContent>
                </div>
              </Tabs>
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

  .tab {
    display: grid;
    row-gap: 1rem;
  }
</style>
