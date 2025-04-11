/*
 * 🐻‍❄️🐳 docker-manifest-action: Tiny, simple GitHub Action to link Docker manifests easily
 * Copyright (c) 2022-2025 Noelware, LLC. <team@noelware.org>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { endGroup, error, startGroup, warning } from '@actions/core';
import runImageTools from './tools/imagetools.js';
import { all, get } from './inputs.js';
import runFallback from './tools/manifest.js';
import { Docker } from '@docker/actions-toolkit/lib/docker/docker.js';
import { Buildx } from '@docker/actions-toolkit/lib/buildx/buildx.js';
import { exit } from 'node:process';

async function main() {
    // Prepare the cache for inputs
    all();

    {
        startGroup('Docker Information');

        await Docker.printVersion();
        await Docker.printInfo();

        endGroup();
    }

    const inputs = get('inputs') || [];
    if (inputs.length === 0) {
        error('Missing a list of input images to merge.');
        exit(1);
    }

    const tags = get('tags') || [];
    const push = get('push') || false;
    const append = get('append') || false;
    const annotations = get('annotations') || [];
    const builder = get('builder');

    // Check if `docker buildx` is avaliable
    const buildx = new Buildx();
    if (!(await buildx.isAvailable())) {
        error(`\`docker buildx\` is not avaliable!`);
        warning('Did you forget to use `docker/setup-buildx-action`?');
        warning('~> Using `docker manifest` as a fallback!');

        return runFallback({ inputs, tags, push, append });
    }

    if (get('fallback')) {
        return runFallback({ inputs, tags, push, append });
    }

    return runImageTools(buildx, {
        inputs,
        tags,
        push,
        append,
        annotations,
        builder
    });
}

main();
