import { RowTreeNode } from '~/api/outlayRows.types';

export enum treeMosaicType {
  line = '|',
  start = '+',
  end = '_',
  space = '.',
}

export type TreeViewRowBody = Omit<RowTreeNode, 'child'>;

export interface TreeViewItem {
  treeMosaic: treeMosaicType[];
  isChild: boolean;
  data: TreeViewRowBody;
  isNew: boolean;
}

export interface NewParentNodeId {
  value: null | number;
}
