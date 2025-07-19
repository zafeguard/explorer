import { IBlockExplorer } from '@/types';
import {
  broadcast,
  getBalance,
  getTransactions,
  getUTXOs,
} from './functions';
import { AbstractBlockExplorer } from '@/core';

export class BlockstreamModule extends AbstractBlockExplorer implements IBlockExplorer {
  public readonly requiredApiKey: boolean = false;
  readonly getTransactions = getTransactions(this);
  readonly getBalance = getBalance(this);
  readonly getUTXOs = getUTXOs(this);
  readonly broadcast = broadcast(this);
}
