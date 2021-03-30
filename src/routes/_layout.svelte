<script lang="ts">
  import { onMount } from 'svelte';
  import { Content, Grid } from 'carbon-components-svelte';
  import Header from '../components/Header.svelte';
  import Theme from '../components/Theme.svelte';
  import Footer from '../components/Footer.svelte';
  import SvelteSeo from 'svelte-seo';

  let theme: 'g10' = 'g10';

  onMount(async () => {
    const { initialize } = await import('../webnative');
    initialize();
  });
</script>

<SvelteSeo
  title="Filecoin Backup App"
  description="An app for storing files with webnative and filecoin."
  openGraph={{
    title: 'Filecoin Backup App',
    description:
      'An app for storing files with webnative and filecoin. Read about it at https://talk.fission.codes/',
    url: 'https://ancient-round-crab.fission.app/',
    type: 'website',
    images: [
      {
        url: 'https://ancient-round-crab.fission.app/crab.png',
        width: 640,
        height: 377,
        alt: 'Ancient round crab icon'
      }
    ]
  }}
  twitter={{
    site: '@FISSIONcodes',
    title: 'Filecoin Backup App',
    description:
      'An app for storing files with webnative and filecoin. Read about it at https://talk.fission.codes/',
    image: 'https://ancient-round-crab.fission.app/crab.png',
    imageAlt: 'Ancient round crab icon'
  }}
/>

<div id="layout">
  <Theme persist bind:theme>
    <Header />
    <Content style="background: none; padding: 0;">
      <Grid style="height: 100%">
        <slot />
      </Grid>
    </Content>
    <Footer />
  </Theme>
</div>

<style>
  #layout {
    height: 100vh;
    display: grid;
    grid-template-rows: 1fr auto;
  }
</style>
