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

import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { Stopwatch } from '@noelware/utils';
import * as prettier from 'prettier';
import * as colors from 'colorette';
import { resolve } from 'node:path';
import { globby } from 'globby';
import * as log from './util/logging';

export async function main() {
    const ROOT = fileURLToPath(new URL('..', import.meta.url));
    log.info(`root directory: ${ROOT}`);

    const config = await prettier.resolveConfig(resolve(ROOT, '.prettierrc.json'));
    if (config === null) {
        throw new Error(`was unable to resolve Prettier config in [${resolve(ROOT, '.prettierrc.json')}] ?!`);
    }

    for (const file of await globby('**/*.{ts,js,md,yaml,yml,json}')) {
        if (file.includes('node_modules') || file.includes('dist')) {
            continue;
        }

        log.info(
            `${colors.isColorSupported ? colors.bold(colors.magenta('START')) : 'START'}   ${resolve(ROOT, file)}`
        );

        const info = await prettier.getFileInfo(resolve(ROOT, file));
        if (info.inferredParser === null) {
            log.warn(
                `${colors.isColorSupported ? colors.bold(colors.gray('IGNORED')) : 'IGNORED'}   ${resolve(ROOT, file)}`
            );

            continue;
        }

        const contents = await readFile(resolve(ROOT, file), 'utf-8');
        if (log.ci) {
            const correct = await prettier.check(contents, {
                parser: info.inferredParser,
                ...config
            });

            if (!correct) {
                log.error(
                    `${
                        colors.isColorSupported ? colors.bold(colors.red('FAILED')) : 'FAILED'
                    } file was not properly formatted. run \`yarn lint\` outside of CI`,
                    {
                        file: resolve(ROOT, file)
                    }
                );

                continue;
            }

            log.info(
                `${colors.isColorSupported ? colors.bold(colors.magenta('END')) : 'END'}     ${resolve(ROOT, file)}`
            );
        } else {
            const formatted = await prettier.format(contents, {
                parser: info.inferredParser,
                ...config
            });

            await writeFile(resolve(ROOT, file), formatted);

            log.info(
                `${colors.isColorSupported ? colors.bold(colors.magenta('END')) : 'END'}     ${resolve(ROOT, file)}`
            );
        }
    }

    log.endGroup();
    process.exit(0);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main().catch((ex) => {
        log.error(ex);
        process.exit(1);
    });
}
