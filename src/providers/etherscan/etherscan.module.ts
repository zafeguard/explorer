import { IBlockExplorer } from '@/types';
import { getBalance, getTransactions } from './functions';
import { AbstractBlockExplorer } from '@/core';

export class EtherscanModule extends AbstractBlockExplorer implements IBlockExplorer {
  public readonly requiredApiKey: boolean = true;
  readonly getTransactions = getTransactions(this);
  readonly getBalance = getBalance(this);
}
