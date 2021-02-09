<script lang="ts">
  import {
    SkipToContent,
    Header,
    HeaderUtilities,
    HeaderNav,
    HeaderNavItem
  } from 'carbon-components-svelte';
  import { getContext } from 'svelte';

  const ctx: { dark: any; light: any; updateVar: any } = getContext('Theme');

  $: if (ctx) {
    ctx.dark.subscribe(value => {
      console.log('dark mode?', value);
    });
    ctx.light.subscribe(value => {
      console.log('light mode?', value);
    });
    ctx.updateVar('--cds-productive-heading-06-font-size', '4rem');
  }
</script>

<Header company="Fission" platformName="Filecoin Backup" href="/">
  <div slot="skip-to-content">
    <SkipToContent />
  </div>
  <HeaderNav>
    <HeaderNavItem href="/balances" text="Balances" />
    <HeaderNavItem href="/files" text="Files" />
  </HeaderNav>
  <HeaderUtilities>
    <div class="balances">
      <div class="balance-indicator">
        <img
          class="logo"
          src="/filecoin-logo.svg"
          alt="Filecoin wallet balance"
        />
        <span>10.0 FIL</span>
      </div>
      <div class="balance-indicator">
        <img
          class="logo"
          src="/filecoin-symbol-color.svg"
          alt="Lotus provider balance"
        />
        <span>250.3 FIL</span>
      </div>
    </div>
  </HeaderUtilities>
</Header>

<style>
  .balances {
    display: grid;
    grid-template-columns: auto auto;
    column-gap: 1.5rem;
    padding: 0 1rem;
  }

  .balance-indicator {
    display: grid;
    place-items: center center;
    grid-template-columns: auto 1fr;
    column-gap: 0.5rem;
  }

  .balance-indicator > span {
    color: #ffffff;
  }

  .logo {
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
  }
</style>
