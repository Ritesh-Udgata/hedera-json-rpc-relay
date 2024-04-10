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

// external resources
import { expect } from 'chai';
import { ethers, WebSocketProvider } from 'ethers';
import RelayClient from '../../clients/relayClient';

describe('@release @web-socket eth_getBlockByHash', async function () {
  const WS_RELAY_URL = `${process.env.WS_RELAY_URL}`;
  const METHOD_NAME = 'eth_getBlockByHash';
  const INVALID_PARAMS = [
    [],
    ['0x469652152b68e142a9639848e0f37786681a8b5fbdaecb9459f80fcb2fe4722b'],
    ['0x469652152b68e142a9639848e0f37786681a8b5fbdaecb9459f80fcb2fe4722b', '0xhbar'],
    ['0x469652152b68e142a9639848e0f37786681a8b5fbdaecb9459f80fcb2fe4722b', '54'],
    ['0x469652152b68e142a9639848e0f37786681a8b5fbdaecb9459f80fcb2fe4722b', true, 39],
    [false],
  ];

  const INVALID_BLOCK_PARAM = [
    ['0xhedera', true],
    ['0xhbar', false],
  ];

  let relayClient: RelayClient, wsProvider: WebSocketProvider;

  before(async () => {
    // @ts-ignore
    const { relay } = global;

    relayClient = relay;
  });

  beforeEach(async () => {
    wsProvider = new ethers.WebSocketProvider(WS_RELAY_URL);
  });

  afterEach(async () => {
    if (wsProvider) {
      await wsProvider.destroy();
    }
  });

  for (const params of INVALID_PARAMS) {
    it(`Should throw predefined.INVALID_PARAMETERS if the request's params variable is invalid. params=[${params}]`, async () => {
      try {
        await wsProvider.send(METHOD_NAME, params);
        expect(true).to.eq(false);
      } catch (error) {
        expect(error.error).to.exist;
        expect(error.error.code).to.eq(-32602);
        expect(error.error.name).to.eq('Invalid parameters');
        expect(error.error.message).to.eq('Invalid params');
      }
    });
  }

  for (const params of INVALID_BLOCK_PARAM) {
    it(`Should handle invalid block hash. params=[${params}]`, async () => {
      try {
        await wsProvider.send(METHOD_NAME, [...params]);
        expect(true).to.eq(false);
      } catch (error) {
        console.log(error);
        expect(error.error.code).to.eq(-32602);
        expect(error.error.name).to.eq('Invalid parameters');
        expect(error.error.message).to.eq('Invalid params');
      }
    });
  }

  it('Should handle valid requests correctly', async () => {
    const expectedResult = await relayClient.call('eth_getBlockByNumber', ['latest', true]);
    const result = await wsProvider.send(METHOD_NAME, [expectedResult.hash, true]);
    expect(result).to.deep.eq(expectedResult);
  });
});
