# 🐻‍❄️🐳 Docker Manifest GitHub Action

> _Simple and tiny GitHub action to link [Docker manifests](https://docs.docker.com/engine/reference/commandline/manifest) easily._

**docker-manifest-action** is a simple and tiny GitHub action to link [Docker manifests](https://docs.docker.com/engine/reference/commandline/manifest) easily without managing it yourself, just input one or more images and merge multiple manifests into one Docker manifest.

Do note that **docker-manifest-action** is in beta stages (and might not work properly!), so please create [issues](https://github.com/Noelware/docker-manifest/action/issues/new) so that we can make this production ready!

## Usage

```yaml
on:
  push:
steps:
  - name: Create and push manifest images
    uses: Noelware/docker-manifest-action@master # or use a pinned version in the Releases tab
    with:
      inputs: namespace/image:latest
      images: namespace/image:latest-amd64[,namespace/other-image:latest-arm64]
      push: true
```

## Inputs

> **Warning** -- As of v0.3, `base-image` has been renamed to `inputs` and `extra-images` has been renamed to `output`. The former inputs will work but will be deprecated into v0.4!

### inputs

> Type: List
>
> Required: True

A list of input Docker images (that were previously built) as the inputs for the merged manifests. Optionally, comma-seperate to create multiple final images with the same manifest.

#### Example

```yaml
inputs: namespace/image:latest-amd64,namespace/image:latest-arm64
```

### images

> Type: List or String
>
> Required: True

Comma-seperated list of images that will be applied in the merged manifest from the [inputs](#inputs).

#### Example

```yaml
output: namespace/image:latest
```

### push

> Type: Boolean
>
> Required: False
>
> Default: `false`

If the final [output](#output) image should be pushed or not.

### amend

> Type: Boolean
>
> Required: False
>
> Default: `false`

If the action should apply the **--amend** flag to `docker manifest create` (and `docker manifest push` if [push](#push) is true). This is useful if the action has created a manifest but had errored when creating (or pushing) a merged manifest.

## Contributing

Thanks for considering contributing to **docker-manifest-action**! Before you boop your heart out on your keyboard ✧ ─=≡Σ((( つ•̀ω•́)つ, we recommend you to do the following:

- Read the [Code of Conduct](./.github/CODE_OF_CONDUCT.md)
- Read the [Contributing Guide](./.github/CONTRIBUTING.md)

If you read both if you're a new time contributor, now you can do the following:

- [Fork me! ＊\*♡( ⁎ᵕᴗᵕ⁎ ）](https://github.com/Noelware/docker-manifest-action/fork)
- Clone your fork on your machine: `git clone https://github.com/your-username/docker-manifest-action`
- Create a new branch: `git checkout -b some-branch-name`
- Run `corepack enable` and use `yarn` for this project
- BOOP THAT KEYBOARD!!!! ♡┉ˏ͛ (❛ 〰 ❛)ˊˎ┉♡
- Commit your changes onto your branch: `git commit -am "add features （｡>‿‿<｡ ）"`
- Push it to the fork you created: `git push -u origin some-branch-name`
- Submit a Pull Request and then cry! ｡･ﾟﾟ･(థ Д థ。)･ﾟﾟ･｡

## License

**docker-manifest-action** is released under the **MIT License** with love by [Noelware](https://noelware.org)! :polar_bear::purple_heart:
