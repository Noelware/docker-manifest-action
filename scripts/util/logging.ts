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

import { hasOwnProperty } from '@noelware/utils';
import * as colors from 'colorette';
import {
    startGroup as __startGroup,
    endGroup as __endGroup,
    AnnotationProperties,
    warning as __warn,
    error as __error,
    info as __info
} from '@actions/core';

export const ci = hasOwnProperty(process.env, 'CI') && process.env.CI !== '';
export const startGroup: typeof __startGroup = (name) =>
    ci
        ? __startGroup(name)
        : (() => {
              console.info(
                  `${colors.isColorSupported ? colors.bold(colors.magenta('>>')) : '>>'} ${
                      colors.isColorSupported ? colors.cyan(name) : name
                  }`
              );
          })();

export const endGroup: typeof __endGroup = () => {
    if (ci) __endGroup();
};

export const info = (message: string) =>
    ci
        ? __info(message)
        : console.info(`${colors.isColorSupported ? colors.green('[info]') : '[info]'}       ${message}`);

export function warn(message: string): void;
export function warn(message: string, properties: AnnotationProperties): void;
export function warn(message: string, properties?: AnnotationProperties) {
    if (ci) {
        __warn(message, properties);
        return;
    }

    console.warn(`${colors.isColorSupported ? colors.yellow('[warning]') : '[warning]'}    ${message}`);
}

export function error(error: Error): void;
export function error(message: string): void;
export function error(message: string, properties: AnnotationProperties): void;
export function error(msgOrError: Error | string, properties?: AnnotationProperties) {
    if (ci) {
        __error(msgOrError, properties);
        return;
    }

    if (typeof msgOrError === 'string') {
        console.error(`${colors.isColorSupported ? colors.red('[error]') : '[error]'}      ${msgOrError}`);
        return;
    }

    if (msgOrError instanceof Error) {
        console.error(msgOrError);
        return;
    }

    console.error(`${colors.isColorSupported ? colors.red('[error]') : '[error]'}      ${JSON.stringify(msgOrError)}`);
}
