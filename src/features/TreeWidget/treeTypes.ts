import { RowTreeNode } from '~/api/outlayRows.types';

export enum treeMosaicType {
  line = '|',
  start = '+',
  end = '_',
  space = '.',
}

export interface TreeViewItem {
  treeMosaic: treeMosaicType[];
  isChild: boolean;
  data: Omit<RowTreeNode, 'child'>;
}

export interface NewParentNodeId {
  value: null | string;
}
