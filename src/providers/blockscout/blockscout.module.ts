import { IBlockExplorer } from '@/types';
import { getHoldingTokens, getTokenInfo, getTransactions } from './functions';
import { AbstractBlockExplorer } from '@/core';

export class BlockscoutModule extends AbstractBlockExplorer implements IBlockExplorer {
  public readonly requiredApiKey: boolean = false;
  readonly getHoldingTokens = getHoldingTokens(this);
  readonly getTokenInfo = getTokenInfo(this);
  readonly getTransactions = getTransactions(this);
}
