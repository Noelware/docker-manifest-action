# 🐻‍❄️🐳 docker-manifest-action: Tiny, simple GitHub Action to link Docker manifests easily
# Copyright (c) 2022-2025 Noelware, LLC. <team@noelware.org>
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
# ------------------------------------------------------------------------------------------
# This Dockerfile is used for integration testing to address the following issues:
#
#   * Noelware/docker-manifest-action#880 (https://github.com/Noelware/docker-manifest-action/issues/880)
#
# The actual contents of the image doesn't really matter but it run Bazelisk as the `bazel` commandline
# and pushes to the GitHub Container Registry (`ghcr.io/noelware/docker-manifest-action/playground`). Don't
# use this please.

FROM debian@sha256:c2880112cc5c61e1200c26f106e4123627b49726375eb5846313da9cca117337

RUN apt update -y && apt install -y curl

ENV BAZELISK_VERSION="1.19.0"

RUN set -eux; \
  arch="$(dpkg --print-architecture)"; \
  case "${arch}" in \
    aarch64|arm64) \
      BAZELISK_DOWNLOAD_URL="https://github.com/bazelbuild/bazelisk/releases/download/v${BAZELISK_VERSION}/bazelisk-linux-arm64"; \
      ;; \
    amd64|x86_64) \
      BAZELISK_DOWNLOAD_URL="https://github.com/bazelbuild/bazelisk/releases/download/v${BAZELISK_VERSION}/bazelisk-linux-amd64"; \
      ;; \
  esac; \
  curl -fsSL -o /usr/local/bin/bazel ${BAZELISK_DOWNLOAD_URL}

RUN echo "hello world 2"
