/*
 * 🐳 docker-manifest-action: Simple and tiny GitHub action to link Docker manifests easily.
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

import { getInputs } from './inputs';
import * as util from './utils';
import * as core from '@actions/core';
import { exec } from '@actions/exec';

const getManifestArguments = (
    type: 'create' | 'push',
    baseImage: string,
    images: string[] = [],
    amend = false
): string[] =>
    amend && type === 'create'
        ? ['manifest', type, '--amend', baseImage, ...images]
        : ['manifest', type, baseImage, ...images];

async function main() {
    const inputs = getInputs();
    if (inputs === null) {
        process.exitCode = 1;
        return;
    }

    core.startGroup('Inputs');
    {
        core.info(`Images to Merge => ${inputs.images.join(', ')}`);
        core.info(`Base Images     => ${inputs.inputs.join(', ')}`);
        core.info(`Amend?          => ${inputs.amend ? 'Yes' : 'No'}`);
        core.info(`Push?           => ${inputs.push ? 'Yes' : 'No'}`);
    }
    core.endGroup();

    let images: string[] = [];
    await Promise.all(
        inputs.inputs.map(async (image) => {
            core.info(`Creating manifest for image [${image}] with [${inputs.images.join(', ')}] outputs`);
            const [time, res] = await util.measureAsyncFunction(() =>
                exec('docker', getManifestArguments('create', image, inputs.images, inputs.amend))
            );

            core.info(
                `Took ${time} to create manifest for image [${image}] with [${inputs.images.join(
                    ', '
                )}] as the outputs!`
            );

            core.debug(`$ docker ${getManifestArguments('create', image, inputs.images, inputs.amend)}\n${res}`);

            if (inputs.push) {
                core.info(`Now pushing image ${image}`);

                let digest = '';
                let options = {
                    listeners: {
                        stdout: (data: Buffer) => (digest += data.toString())
                    }
                };

                const [other, result] = await util.measureAsyncFunction(() =>
                    exec('docker', getManifestArguments('push', image, [], inputs.amend), options)
                );

                images.push(`${image}@${digest}`);
                core.info(`Took ${other} to push image [${image}] with digest ${digest}`);
                core.debug(`$ docker ${getManifestArguments('push', image, [], inputs.amend)}\n${result}`);
            }
        })
    );

    core.setOutput('images', images.join());
}

main().catch((ex) => {
    core.error(ex);
    process.exit(1);
});
