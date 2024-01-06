/*
 * 🐳 docker-manifest-action: Simple and tiny GitHub action to link Docker manifests easily.
 * Copyright (c) 2022-2024 Noelware, LLC. <team@noelware.org>
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

import { test, expect, describe, beforeEach } from 'vitest';
import { getInputs } from '../src/inputs';

describe('Inputs', () => {
    beforeEach(() => {
        process.env = Object.keys(process.env).reduce((acc, curr) => {
            if (!curr.startsWith('INPUT_')) {
                acc[curr] = process.env[curr];
            }

            return acc;
        }, {});
    });

    test('resolve deprecated inputs', () => {
        setInput('base-image', 'namespace/image:latest');
        setInput('extra-images', 'namespace/image:latest-amd64,namespace/image:latest-arm64');
        setInput('push', 'false');
        setInput('amend', 'false');

        const inputs = getInputs();
        expect(inputs).not.toBeNull();
        expect(inputs!.amend).toBeFalsy();
        expect(inputs!.push).toBeFalsy();
        expect(inputs!.images).toStrictEqual(['namespace/image:latest-amd64', 'namespace/image:latest-arm64']);
        expect(inputs!.inputs).toStrictEqual(['namespace/image:latest']);
    });

    test('resolve new and deprecated inputs', () => {
        setInput('base-image', 'namespace/image:latest');
        setInput('extra-images', 'namespace/image:latest-amd64,namespace/image:latest-arm64');
        setInput('push', 'false');
        setInput('amend', 'false');
        setInput('inputs', 'woah/owo:latest');
        setInput('images', 'woah/owo:latest-arm64');

        const inputs = getInputs();
        expect(inputs).not.toBeNull();
        expect(inputs!.amend).toBeFalsy();
        expect(inputs!.push).toBeFalsy();
        expect(inputs!.images).toStrictEqual([
            'woah/owo:latest-arm64',
            'namespace/image:latest-amd64',
            'namespace/image:latest-arm64'
        ]);

        expect(inputs!.inputs).toStrictEqual(['woah/owo:latest', 'namespace/image:latest']);
    });

    test('inputs should be null if `inputs` is not defined', () => {
        setInput('images', 'woah/owo:latest-arm64,woah/owo:latest-amd64');
        setInput('push', 'false');
        setInput('amend', 'false');

        const inputs = getInputs();
        expect(inputs).toBeNull();
    });
});

// See: https://github.com/actions/toolkit/blob/a1b068ec31a042ff1e10a522d8fdf0b8869d53ca/packages/core/src/core.ts#L89
function getInputName(name: string) {
    return `INPUT_${name.replace(/ /g, '_').toUpperCase()}`;
}

function setInput(name: string, value: string) {
    process.env[getInputName(name)] = value;
}
