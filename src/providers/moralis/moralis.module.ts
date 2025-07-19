import { IBlockExplorer } from '@/types';
import { getHoldingTokens, getTokenInfo, getTransactions } from './functions';
import { AbstractBlockExplorer } from '@/core';

export class MoralisModule extends AbstractBlockExplorer implements IBlockExplorer {
  public readonly requiredApiKey: boolean = true;
  readonly getHoldingTokens = getHoldingTokens(this);
  readonly getTokenInfo = getTokenInfo(this);
  readonly getTransactions = getTransactions(this);
}
