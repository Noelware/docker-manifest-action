# 🐳 Docker Manifest GitHub Action

> _GitHub action to apply Docker manifest objects onto an image._

## How to use

You can use **docker-manifest-action** really easily. You will need to build the image before you
use this action or it can't really create it!

> **NOTE**: \`docker-manifest-action\` is ALPHA SOFTWARE! Bugs will occur, please report an issue [here](https://github.com/Noelware/docker-manifest-action/issues) if you encounter any issues!

```yml
name: Some job
on: ...

jobs:
  job-name:
    runs-on: ubuntu-last
    steps:
      - name: Create and push manifest images
        uses: Noelware/docker-manifest-action@master # or use whatever version.
        with:
          base-image: namespace/image:latest
          extra-images: namespace/image:latest-amd64,namespace/image:latest-arm64,namespace/image:latest-armv7

          push: true
```

### Inputs

| Name           | Type         | Description                                                          | Required | Default? |
| -------------- | ------------ | -------------------------------------------------------------------- | -------- | -------- |
| `base-image`   | String       | The base image to apply all the extra images to.                     | true     | -        |
| `extra-images` | List[String] | The extra images with a seperator of `,` to apply to the base image. | true     | -        |
| `push`         | Boolean      | If the action should push it to its respected registry.              | false    | true     |

## License

**docker-manifest-action** is released under the **MIT License** by Noel. Read [here](/LICENSE) for more information.
