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

import { endGroup, info, setOutput, startGroup } from '@actions/core';
import type { Inputs } from '../inputs.js';
import { exec } from '@actions/exec';

const createManifestArguments = (
    type: 'create' | 'push',
    base: string,
    images: string[] = [],
    amend = false
): string[] =>
    amend && type === 'create'
        ? ['manifest', type, '--amend', base].concat(images)
        : ['manifest', type, base].concat(images);

export default async function runFallback({ inputs, tags, push, append }: Omit<Inputs, 'annotations' | 'builder'>) {
    let images = [] as string[];

    for (const image of inputs) {
        info(`Creating manifest for image [${image}] with the following images: ${tags.join(', ')}...`);

        {
            const createArgs = createManifestArguments('create', image, tags, append);
            startGroup(`$ docker ${createArgs.join(' ')}`);

            await exec('docker', createArgs);

            endGroup();

            info(`Created manifest for image ${image}!`);
        }

        if (push) {
            info(`Pushing image ${image}...`);

            const pushArgs = createManifestArguments('push', image, [], append);
            startGroup(`$ docker ${pushArgs.join(' ')}`);

            let digest = '';
            await exec('docker', pushArgs, {
                listeners: {
                    stdout: (data: Buffer) => {
                        digest += data.toString();
                    }
                }
            });

            images.push(`${image}@${digest}`);
            endGroup();

            info(`Pushed image ${image} successfully!`);
        }
    }

    setOutput('images', images.join());
}
