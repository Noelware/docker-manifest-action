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

import { Stopwatch } from '@noelware/utils';

/**
 * Measures the given {@link func} and returns a tuple of `[time in ms, result of func]`
 * @param func The function to measure
 * @param args The arguments to the function.
 */
export async function measureAsyncFunction<F extends (...args: any[]) => Promise<any>>(
  func: F,
  ...args: Parameters<F>
): Promise<[time: string, result: ReturnType<F>]> {
  const stopwatch = Stopwatch.createStarted();
  const result = await func(...args);

  const time = stopwatch.stop()!;
  return [time, result];
}
