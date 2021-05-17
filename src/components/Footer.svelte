<script>
  import { Grid, Row, Column, Link, Icon } from 'carbon-components-svelte';
  import LogoSlack32 from 'carbon-icons-svelte/lib/LogoSlack32';
  import LogoDiscord32 from 'carbon-icons-svelte/lib/LogoDiscord32';
  import LogoGithub32 from 'carbon-icons-svelte/lib/LogoGithub32';
  import Chat32 from 'carbon-icons-svelte/lib/Chat32';
</script>

<footer class="bx--content">
  <Grid>
    <Row>
      <Column>
        <div class="social-icons">
          <Link href="https://filecoin.io/slack/" target="_blank">
            <Icon render={LogoSlack32} style="fill: var(--cds-icon-01)" />
          </Link>
          <Link href="https://discord.gg/daDMAjE" target="_blank">
            <Icon render={LogoDiscord32} style="fill: var(--cds-icon-01)" />
          </Link>
          <Link
            href="https://github.com/fission-suite/filecoin-backup"
            target="_blank"
          >
            <Icon render={LogoGithub32} style="fill: var(--cds-icon-01)" />
          </Link>
          <Link
            href="https://talk.fission.codes/c/projects/webnative-filecoin-integration/48"
            target="_blank"
          >
            <Icon render={Chat32} style="fill: var(--cds-icon-01)" />
          </Link>
        </div>
      </Column>
    </Row>
  </Grid>
</footer>

<style>
  footer {
    grid-row-start: 2;
    grid-row-end: 3;
    background: var(--cds-ui-01);
  }

  .social-icons {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    column-gap: 1rem;
    place-items: center center;
  }
</style>
