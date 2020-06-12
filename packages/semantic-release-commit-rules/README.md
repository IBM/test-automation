# Project Overview

Tools for customizing [semantic release's default plugins](https://semantic-release.gitbook.io/semantic-release/usage/plugins#plugins) related to commit messages. By default semantic release uses Angular's commit conventions. This tool allows users to integrate a non-standard rules configuration which replaces the default commit message rules during the  _Analyze commits_ and _Generate notes_ [release steps](https://semantic-release.gitbook.io/semantic-release/#release-steps).

## Usage

1. To use this you'll you'll want to install the `semantic-release-commit-rules` NPM package

    ```bash
    npm install semantic-release-commit-rules --save-dev
    ```

    or

    ```bash
    yarn add semantic-release-commit-rules --dev
    ```

2. Create an configuration object based on your projects needs.  See `lib/defaults.js` for object structure definitions and an example.

3. Configure your semantic release plugins using the helper functions

    ```javascript
    const {
      generateCommitAnalyzerConfig,
      generateReleaseNotesConfig
    } = require('semantic-release-commit-rules');
    const myConfig = require('./path-to-project-config/');

    const semanticReleaseConfig = {
      // ...
      plugins: [
        // ...
        ['@semantic-release/commit-analyzer',
          generateCommitAnalyzerConfig(myConfig)
        ],
        ['@semantic-release/release-notes-generator',
          generateReleaseNotesConfig(myConfig)
        ]
      ],
      // ...
    };
    ```

## Getting started

Follow the setup on the [Test Automatation README](../../README.md) for instructions about getting a copy of the monorepo and running it on your local machine for development and testing purposes.

## Contribution Guide

Please read [CONTRIBUTING.md](../../CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.
