import { NewParentNodeId, treeMosaicType, TreeViewItem } from './treeTypes';
import { RowTreeNode } from '~/api/outlayRows.types';

export const makeDataView = ({
  tree,
  newParentNodeId,
}: {
  tree: RowTreeNode[];
  newParentNodeId: null | NewParentNodeId;
}): TreeViewItem[] => {
  interface StackItem {
    treeNode: RowTreeNode;
    level: number;
    treeMosaic: treeMosaicType[];
    listIdx: number;
    listLength: number;
    isParentClose: boolean;
    isNew: boolean;
  }

  const result: TreeViewItem[] = [];

  const rootLengthFix = newParentNodeId?.value === null ? 1 : 0;
  const stack: StackItem[] = tree
    .map((treeNode, i) => ({
      level: 0,
      treeNode,
      treeMosaic: [],
      listIdx: i + rootLengthFix,
      listLength: tree.length + rootLengthFix,
      isParentClose: false,
      isNew: false,
    }))
    .reverse();
  while (stack.length > 0) {
    const stackItem = stack.pop();
    if (stackItem) {
      const { child, ...data } = stackItem.treeNode;
      let currentTreeMosaicItem = treeMosaicType.start;

      if (stackItem.listIdx === stackItem.listLength - 1) {
        currentTreeMosaicItem = treeMosaicType.end;
      }

      const treeMosaic = stackItem.treeMosaic.slice();
      if (treeMosaic.length > 0) {
        treeMosaic[treeMosaic.length - 1] = stackItem.isParentClose ? treeMosaicType.space : treeMosaicType.line;
      }
      treeMosaic.push(currentTreeMosaicItem);

      const viewItem: TreeViewItem = {
        data,
        isChild: child.length > 0,
        treeMosaic,
      };
      result.push(viewItem);

      if (child) {
        for (let i = child.length - 1; i >= 0; i--) {
          stack.push({
            treeNode: child[i],
            level: stackItem.level + 1,
            treeMosaic,
            listIdx: i,
            listLength: child.length,
            isParentClose: stackItem.listIdx === stackItem.listLength - 1,
            isNew: false,
          });
        }
      }
    }
  }

  return result;
};
