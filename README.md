### 🐻‍❄️🐳 `docker-manifest-action`

#### _A tiny, simple GitHub Action to link Docker manifests easily_

**docker-manifest-action** is a simple GitHub action that combines a list of Docker manifests and merges them into one image via the [`docker buildx imagetools`] command.

As of **docker-manifest-action** v1, the API is stable enough to not break at all.

## Usage

```yaml
on:
    # ...
jobs:
    docker:
        runs-on: ubuntu-latest
        name: my ci job
        steps:
            - uses: Noelware/docker-manifest-action@v1
              with:
                  inputs: namespace/image:latest
                  images: namespace/image:latest-amd64,namespace:image/latest-arm64
                  push: true
```

## Migrating from `v0.4.x`

- `images` was changed to `tags` to better reflect `buildx imagetools create`
- `base-image` was removed, use `inputs` instead
- `extra-images` was removed, use `tags` instead
- `amend` was renamed to `append` to better reflect `buildx imagetools create`

## Inputs

### `inputs` (array of strings)

A list of Docker images thdocker buildx imagetoolsat were built from `docker build` into the merged manifests.

Optionally, it can be a comma-separated list (i.e, `image/a:latest-amd64,image/b:latest-amd64`) to create multiple final images from the given [`tags`](#tags-array-of-strings).

### `tags` (array of strings)

A comma-separated list of tags that will be applied into the merged manifest from [`inputs`](#inputs-array-of-strings).

### `push` (`boolean`)

Whether if the action should push the outputs to the Docker registry.

### `annotations` (mapping of `label=value`)

A mapping of annotations to annotate the final, merged manifest.

This is the same syntax as the official Docker GitHub actions handles mappings of `label=value`.

View the [`docker buildx imagetools create --annotation`](https://docs.docker.com/reference/cli/docker/buildx/imagetools/create/#annotation) documentation on how to format each annotation.

### `append` (boolean)

Sets the `--append` flag, which will add new sources to existing manifests.

### `builder` (string)

Sets the `--builder` for the `buildx` command.

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

**docker-manifest-action** is released under the **MIT License** with love and care by [Noelware, LLC.](https://noelware.org).

[`docker buildx imagetools`]: https://docs.docker.com/reference/cli/docker/buildx/imagetools/create
