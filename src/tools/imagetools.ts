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

import { endGroup, info, setOutput, startGroup, warning } from '@actions/core';
import { Buildx } from '@docker/actions-toolkit/lib/buildx/buildx.js';
import { Inputs } from '../inputs.js';
import { exec } from '@actions/exec';

const getArguments = (type: 'create' | 'inspect', inputs: Omit<Inputs, 'fallback'>) => {
    const args = [] as string[];

    if (inputs.builder) args.push(`--builder=${inputs.builder}`);
    args.push('imagetools', type);
    args.push(...inputs.inputs);
    args.push(...inputs.annotations.map((annotation) => `--annotation=${annotation}`));
    args.push(...inputs.tags.map((tag) => `--tag=${tag}`));

    if (inputs.append) args.push('--append');

    return args;
};

export default async function runImageTools(
    buildx: Buildx,
    { inputs, tags, push, append, annotations, builder }: Omit<Inputs, 'fallback'>
) {
    // TODO(@auguwu): determine how we should get images?
    const images = [] as string[];
    const createArgs = getArguments('create', { inputs, tags, push, append, annotations, builder });

    const { command, args } = await buildx.getCommand(createArgs);
    startGroup(`$ ${command} ${args.join(' ')}`);

    const exitCode = await exec(command, args);
    if (exitCode !== 0) {
        warning(`Exited with code ${exitCode}.`);
    }

    endGroup();

    for (const input of inputs) {
        startGroup(`manifest inspect :: ${input}`);

        const inspectArgs = getArguments('inspect', {
            annotations: [],
            builder,
            inputs: [input],
            append: false,
            push: false,
            tags: []
        });

        const { command, args } = await buildx.getCommand(inspectArgs);

        info(`$ ${command} ${args.join(' ')}`);
        await exec(command, args);

        endGroup();

        // inspect again for the digest
        const { command: cmd, args: args2 } = await buildx.getCommand([
            ...inspectArgs,
            '--format',
            "'{{json .Manifest.Digest}}'"
        ]);

        let digest = '';
        await exec(cmd, args2, {
            silent: true,
            listeners: {
                stdout: (data) => {
                    digest += data.toString();
                }
            }
        });

        images.push(`${input}@${digest.replaceAll('"', '').trim()}`);
    }

    setOutput('images', images.join());
}
