![](https://raw.githubusercontent.com/fission-suite/kit/6a20e9af963dd000903b1c6e64f9fbb2102ba472/images/badge-solid-colored.svg)

# Filecoin Backup

[![Build Status](https://github.com/fission-suite/filecoin-backup/workflows/Publish/badge.svg)](https://github.com/{user}/{repo}/actions)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/fission-suite/blob/master/LICENSE)
[![Built by FISSION](https://img.shields.io/badge/⌘-Built_by_FISSION-purple.svg)](https://fission.codes)
[![Discord](https://img.shields.io/discord/478735028319158273.svg)](https://discord.gg/zAQBDEq)
[![Discourse](https://img.shields.io/discourse/https/talk.fission.codes/topics)](https://talk.fission.codes)

Filecoin Backup integrates Fission webnative and Filecoin to store your files in the browser and to Filecoin.

[Try it out!](https://ancient-round-crab.fission.app/)

# Setup

Install dependencies.

```shell
npm install
```

## Develop

To work on the application locally:

```shell
npm run dev
```

Navigate to `localhost:3000` in your web browser.

## Build

Export a static build.

```shell
npm run export
```

The build outputs the static site to the `__sapper__/export` directory.

## Publish

Publish the site.

```shell
fission app publish
```
