<script lang="ts">
  export let segment = undefined;

  import { onMount } from 'svelte';
  import { Content, Grid } from 'carbon-components-svelte';
  import Header from '../components/Header.svelte';
  import Theme from '../components/Theme.svelte';

  let theme: 'g10' = 'g10';

  onMount(async () => {
    const { initialize } = await import('../webnative');
    initialize();
  });
</script>

<Theme persist bind:theme>
  <Header {segment} />
  <Content style="background: none; padding: 1rem; height: calc(100vh - 4rem)">
    <Grid style="height: 100%">
      <slot />
    </Grid>
  </Content>
</Theme>
