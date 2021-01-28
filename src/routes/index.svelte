<script lang="ts">
  import {
    Content,
    Grid,
    Row,
    Column,
    Tabs,
    TabContent,
    Tab,
    Select,
    SelectItem
  } from 'carbon-components-svelte';

  import { getContext } from 'svelte';

  const { carbon_theme } = getContext('Theme');
</script>

<Row>
  <Column lg={16}>
    <h1 style="margin-bottom: 1.5rem">
      Store Files with Filecoin &amp Fission
    </h1>
  </Column>
</Row>

<Row>
  <Column noGutter>
    <Tabs aria-label="Tab navigation">
      <Tab label="About" />
      <Tab label="Balances" />
      <Tab label="Files" />
      <div slot="content" class="tabbed-content">
        <Grid as fullWidth let:props>
          <TabContent {...props}>
            <Row>
              <Column md={4} lg={7}>
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
                <p>
                  Filecoin Backup App integrates Fission webnative and Filecoin
                  to store your files in the browser and to the Filecoin
                  network.
                </p>
              </Column>
            </Row>
          </TabContent>
          <TabContent {...props}>
            <Row>
              <Column md={4} lg={7}>
                <p>Filecoin and Lotus provider wallet balances go here.</p>
              </Column>
            </Row>
          </TabContent>
          <TabContent {...props}>
            <Row>
              <Column md={4} lg={7}>
                <p>Webnative and Filecoin backups go here.</p>
              </Column>
            </Row>
          </TabContent>
        </Grid>
      </div>
    </Tabs>
  </Column>
</Row>
