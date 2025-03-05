import classNames from 'classnames';
import { useMemo } from 'react';
import { NewParentNodeId } from '../treeTypes';
import { makeDataView } from '../treeHelpers';
import { TreeMosaicRootElement } from '../TreeMosaicRootElement';
import { TreeMosaicElement } from '../TreeMosaicElement';
import { TreeMosaicNodeBtn } from '../TreeMosaicNodeBtn';
import styles from './TreeTable.module.scss';
import { RowTreeNode } from '~/api/outlayRows.types';

interface TreeTableProps {
  tree: RowTreeNode[];
  newParentNodeId: null | NewParentNodeId;
}

export function TreeTable({ tree, newParentNodeId }: TreeTableProps) {
  const view = useMemo(() => makeDataView({ tree, newParentNodeId }), [tree]);
  return (
    <div className={styles.TreeTable}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tHeadTr}>
            <th className={styles.tHeadTdFirst}>
              <TreeMosaicRootElement>
                <TreeMosaicNodeBtn variant={'item'} />
              </TreeMosaicRootElement>
            </th>
            <th>Основная з/п</th>
            <th>Оборудование</th>
            <th>Накладные расходы</th>
            <th>Сметная прибыль</th>
          </tr>
        </thead>
        <tbody>
          {view.map((el, i) => (
            <tr key={el.data.id} className={styles.tBodyTr}>
              <td
                className={classNames(styles.tBodyTdFirst)}
                // style={{ height: `${(i + 1) * 50}px` }}
              >
                <TreeMosaicElement mosaicList={el.treeMosaic} isChild={el.isChild}>
                  <TreeMosaicNodeBtn variant={'item'} />
                  <TreeMosaicNodeBtn variant={'trash'} />
                </TreeMosaicElement>
              </td>
              <td>{el.data.rowName}</td>

              <td>{el.data.salary.toLocaleString()}</td>
              <td>{el.data.equipmentCosts.toLocaleString()}</td>
              <td>{el.data.overheads.toLocaleString()}</td>
              <td>{el.data.estimatedProfit.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
