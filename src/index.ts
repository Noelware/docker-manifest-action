/*
 * 🐳 @noelware/docker-manifest-action: GitHub action to apply Docker manifest objects onto an image.
 * Copyright (c) 2022 Noelware <team@noelware.org>
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

import { Stopwatch, formatDate } from '@augu/utils';
import * as core from '@actions/core';
import { exec } from '@actions/exec';

/**
 * Overwrites the logger utilities from `@actions/core` to pretty-print the result.
 * @return A dispose function to revert to the previous changes.
 */
const overwriteLogger = () => {
  const originalInfo = core.info;
  const originalDebug = core.debug;
  const originalWarn = core.warning;

  // @ts-ignore :)
  core.warning = (message: string | Error, properties?: core.AnnotationProperties) => {
    const date = formatDate(new Date());
    if (message instanceof Error) {
      originalWarn(message, properties);
    } else {
      originalWarn(`${date} WARN :: ${message}`, properties);
    }
  };

  // @ts-ignore :)
  core.info = (message: string) => {
    const date = formatDate(new Date());
    originalInfo(`${date} INFO :: ${message}`);
  };

  // @ts-ignore :)
  core.debug = (message: string) => {
    if (!core.isDebug()) return;

    const date = formatDate(new Date());
    originalDebug(`${date} DEBUG :: ${message}`);
  };

  return () => {
    // @ts-ignore :)
    core.info = originalInfo;

    // @ts-ignore
    core.warning = originalWarn;

    // @ts-ignore
    core.debug = originalDebug;
  };
};

/**
 * Measure this {@link func function}'s time that it took to execute.
 * @param func The function to measure.
 * @param args The arguments the function needs to use.
 * @returns A tuple of the [result, time it took].
 */
const measureAsyncFunction = async <
  F extends (...args: any[]) => Promise<any>,
  Args extends any[] = Parameters<F>,
  R extends any = ReturnType<F> extends Promise<infer U> ? U : never
>(
  func: F,
  ...args: Args
): Promise<[string, R]> => {
  const stopwatch = new Stopwatch();
  stopwatch.start();

  const result: R = await func(...args);
  const end = stopwatch.end();

  return [end, result];
};

const getArgs = (type: 'create' | 'push', baseImage: string, images: string[] = [], amend = false) =>
  amend
    ? ['docker', 'manifest', '--amend', type, baseImage, ...images]
    : ['docker', 'manifest', type, baseImage, ...images];

const main = async () => {
  const revertBack = overwriteLogger();

  // retrieve inputs
  const baseImage = core.getInput('base-image', { trimWhitespace: true, required: true });
  const extraImages = core.getInput('extra-images', { trimWhitespace: true, required: true });
  const shouldPush = core.getBooleanInput('push');
  const amend = core.getBooleanInput('amend');

  const imagesToCreate = extraImages.split(',').map((i) => i.trim());
  if (imagesToCreate.length === 0) {
    core.warning(
      `You will need some extra images to set, at the moment, you have none! Did you forget to use \`,\` as the seperator?`
    );

    core.debug(`Data: ${extraImages}`);
    revertBack();
    process.exitCode = 1;

    return;
  }

  core.info(`Creating manifests for image '${baseImage}'...`);
  const [time] = await measureAsyncFunction(async () => {
    await exec('docker', getArgs('create', baseImage, imagesToCreate, amend));
  });

  core.debug(`Took ${time} to execute command: \`docker manifest create ${baseImage} ${imagesToCreate.join(' ')}\``);
  core.info(`Created manifested image: ${baseImage} with images ${imagesToCreate.join(', ')}`);

  if (shouldPush) {
    core.info(`Pushing to its respected registry...`);
    const [otherTime, result] = await measureAsyncFunction(async () => {
      await exec('docker', getArgs('push', baseImage));
      await exec('docker', ['manifest', 'push', baseImage]);
    });

    core.debug(`Took ${otherTime} to execute command: \`docker manifest push ${baseImage}\`!\nResult: ${result}`);
    core.info(`Pushed image ${baseImage} to its respected registry.`);
  }

  revertBack();
};

main().catch((ex) => {
  core.error(ex);
  process.exit(1);
});
