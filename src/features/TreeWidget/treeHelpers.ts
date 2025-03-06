import { NewParentNodeId, treeMosaicType, TreeViewItem } from './treeTypes';
import { RowTreeNode } from '~/api/outlayRows.types';

const makeGenId = () => {
  let id = 0;
  return () => {
    id--;
    return id;
  };
};

const makeId = makeGenId();

const makeNewNode = (id: number): RowTreeNode => ({
  id,
  rowName: '',
  total: 0,
  salary: 0,
  mimExploitation: 0,
  machineOperatorSalary: 0,
  materials: 0,
  mainCosts: 0,
  supportCosts: 0,
  equipmentCosts: 0,
  overheads: 0,
  estimatedProfit: 0,
  child: [],
});

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
  }

  const result: TreeViewItem[] = [];
  const stack: StackItem[] = [];

  const newId = makeId();

  let actualTree = tree;
  if (newParentNodeId?.value === null) {
    actualTree = tree.slice();
    actualTree.push(makeNewNode(newId));
  }

  for (let i = actualTree.length - 1; i >= 0; i--) {
    stack.push({
      treeNode: actualTree[i],
      level: 0,
      treeMosaic: [],
      listIdx: i,
      listLength: actualTree.length,
      isParentClose: false,
    });
  }
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
      let actualChild = child;
      if (newParentNodeId?.value === stackItem.treeNode.id) {
        actualChild = child.slice();
        actualChild.push(makeNewNode(newId));
      }
      const viewItem: TreeViewItem = {
        data,
        isChild: actualChild.length > 0,
        treeMosaic,
        isNew: stackItem.treeNode.id === newId,
      };
      result.push(viewItem);

      for (let i = actualChild.length - 1; i >= 0; i--) {
        stack.push({
          treeNode: actualChild[i],
          level: stackItem.level + 1,
          treeMosaic,
          listIdx: i,
          listLength: actualChild.length,
          isParentClose: stackItem.listIdx === stackItem.listLength - 1,
        });
      }
    }
  }

  return result;
};
