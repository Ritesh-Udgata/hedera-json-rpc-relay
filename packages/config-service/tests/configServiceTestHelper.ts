/*-
 *
 * Hedera JSON RPC Relay
 *
 * Copyright (C) 2024 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import dotenv from 'dotenv';
import { ConfigService } from '../dist/services';

/**
 * There are many tests, both integration and acceptance that
 * change the environment variables during their runtime. We added this helper
 * in order to keep the main env provider as clean as possible but at the same
 * time, we will be able to override, delete, or append environment variables.
 */
export class ConfigServiceTestHelper {
  /**
   * Override an env variable, used in test cases only
   * @param name string
   * @param value string
   * @returns void
   */
  public static dynamicOverride(name: string, value: string | number | boolean | null | undefined): void {
    // @ts-ignore
    ConfigService.getInstance().envs[name] = value;
  }

  /**
   * Delete an env variable, used in test cases only
   * @param name string
   * @returns void
   */
  public static remove(name: string): void {
    // @ts-ignore
    delete ConfigService.getInstance().envs[name];
  }

  /**
   * Hot reload a new instance into the current one, used in test cases only
   * @param configPath string
   * @returns void
   */
  public static appendEnvsFromPath(configPath: string): void {
    dotenv.config({ path: configPath, override: true });
    Object.entries(process.env).forEach(([key, value]) => {
      this.dynamicOverride(key, value);
    });
  }
}
