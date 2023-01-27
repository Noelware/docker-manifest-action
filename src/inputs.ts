/*
 * 🐳 Docker Manifest GitHub Action: Simple and tiny GitHub action to link Docker manifests easily.
 * Copyright (c) 2022-2023 Noelware, LLC. <team@noelware.org>
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

import { getBooleanInput, getInput, warning } from '@actions/core';
import { debug } from 'console';

/**
 * Represents the action's inputs
 */
export interface Input {
  /**
   * A list of input Docker images (that were previously built) as the inputs for the merged manifests.
   * Optionally, comma-seperate to create multiple final images with the same manifest.
   */
  inputs: string[];

  /**
   * Comma-seperated list of images that will be applied from the {@link Input.inputs inputs}.
   */
  outputs: string[];

  /**
   * If the action should apply the **--amend** flag to `docker manifest create` (and `docker manifest push` if `push` is true).
   * This is useful if the action has created a manifest but had errored when creating (or pushing) a merged manifest.
   */
  amend: boolean;

  /**
   * If the action should push the outputs to the Docker registry listed as.
   */
  push: boolean;
}

export const getInputs = (): Input | null => {
  let inputs = getInput('inputs', { trimWhitespace: true, required: true })
    .split(',')
    .map((i) => i.trim());

  let outputs = getInput('outputs', { trimWhitespace: true, required: true })
    .split(',')
    .map((i) => i.trim());

  const push = getBooleanInput('push', { trimWhitespace: true });
  const amend = getBooleanInput('amend', { trimWhitespace: true });
  const baseImages = getInput('base-image', { trimWhitespace: true, required: true })
    .split(',')
    .map((i) => i.trim());

  if (inputs.length === 0 && baseImages.length > 0) {
    warning('Using the `base-image` input has been deprecated since v0.3, please use the `inputs` input instead.');
    inputs = baseImages;
  }

  const extraImages = getInput('extra-images', { trimWhitespace: true, required: true })
    .split(',')
    .map((i) => i.trim());

  if (outputs.length === 0 && extraImages.length > 0) {
    warning('Using the `extra-images` input has been deprecated since v0.3, please use the `outputs` input instead.');
    outputs = extraImages;
  }

  // Warn if we don't have any inputs
  if (inputs.length === 0) {
    warning('You will need to set some inputs! Did you forget to use `,` as the seperator?');
    debug(
      [
        '+~+~+~+~+~+~+~+~+~+~+~+~+~+~+~+~+~+~+~+~+',
        `Outputs => ${inputs.join(', ') || 'None'}`,
        `Amend   => ${amend ? 'Yes' : 'No'}`,
        `Push    => ${push ? 'Yes' : 'No'}`,
        '+~+~+~+~+~+~+~+~+~+~+~+~+~+~+~+~+~+~+~+~+'
      ].join('\n')
    );

    process.exitCode = 1;
    return null;
  }

  // Warn if we don't have any outputs
  if (outputs.length === 0) {
    warning('You will need to set some outputs! Did you forget to use `,` as the seperator?');
    debug(
      [
        '+~+~+~+~+~+~+~+~+~+~+~+~+~+~+~+~+~+~+~+~+',
        `Inputs => ${inputs.join(', ')}`,
        `Amend  => ${amend ? 'Yes' : 'No'}`,
        `Push   => ${push ? 'Yes' : 'No'}`,
        '+~+~+~+~+~+~+~+~+~+~+~+~+~+~+~+~+~+~+~+~+'
      ].join('\n')
    );

    process.exitCode = 1;
    return null;
  }

  return {
    inputs,
    outputs,
    push,
    amend
  };
};
