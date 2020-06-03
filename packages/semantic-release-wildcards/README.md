Semantic Release Wildcards
---

[semantic-release] plugin to convert dependency wildcards into the latest released version number within a module's package.json file.

| Step               | Description|
|--------------------|---------------------------------------------------------------------|
| `prepare`          | Update the `package.json` version and [create](https://docs.npmjs.com/cli/pack) the npm package tarball.|

## Usage

The plugin can be configured in the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

```js
{
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['semantic-release-wildcards',
      {
        packages: [
          'module-name-1'.
          '@scoped/module-2',
          'another-module-2',
        ]
      }
    ],
    '@semantic-release/npm',
    '@semantic-release/github'
  ],
}
```


[semantic-release]: https://semantic-release.gitbook.io/semantic-release/
