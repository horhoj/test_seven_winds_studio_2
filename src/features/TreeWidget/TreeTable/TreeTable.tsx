import classNames from 'classnames';
import { useMemo } from 'react';
import { NewParentNodeId, TreeViewRowBody } from '../treeTypes';
import { makeDataView } from '../treeHelpers';
import { TreeMosaicRootElement } from '../TreeMosaicRootElement';
import { TreeMosaicElement } from '../TreeMosaicElement';
import { TreeMosaicNodeBtn } from '../TreeMosaicNodeBtn';
import { TreeRowView } from '../TreeRowView';
import { TreeRowForm } from '../TreeRowForm';
import styles from './TreeTable.module.scss';
import { RowTreeNode } from '~/api/outlayRows.types';

interface TreeTableProps {
  tree: RowTreeNode[];
  newParentNodeId: null | NewParentNodeId;
  editRowId: number | null;
  onAdd: (parent: NewParentNodeId) => void;
  onEdit: (elId: number) => void;
  onCancel: () => void;
  onAddSubmit: (values: TreeViewRowBody) => void;
  onPatchSubmit: (values: TreeViewRowBody) => void;
  onDeleteSubmit: (elId: number) => void;
  disabled: boolean;
}

export function TreeTable({
  tree,
  newParentNodeId,
  onAdd,
  onCancel,
  onAddSubmit,
  editRowId,
  onEdit,
  onPatchSubmit,
  onDeleteSubmit,
  disabled,
}: TreeTableProps) {
  const view = useMemo(() => makeDataView({ tree, newParentNodeId }), [tree, newParentNodeId]);
  return (
    <div className={styles.TreeTable}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tHeadTr}>
            <th className={styles.tHeadTdFirst}>
              <TreeMosaicRootElement>
                <TreeMosaicNodeBtn variant={'item'} onClick={() => onAdd({ value: null })} disabled={disabled} />
              </TreeMosaicRootElement>
              <span className={styles.tHeaderLevelTitle}>Уровень</span>
            </th>
            <th>Наименование</th>
            <th>Основная з/п</th>
            <th>Оборудование</th>
            <th>Накладные расходы</th>
            <th>Сметная прибыль</th>
          </tr>
        </thead>
        <tbody>
          {view.map((el, i) => (
            <tr key={el.data.id} className={styles.tBodyTr} onDoubleClick={() => !disabled && onEdit(el.data.id)}>
              <td
                className={classNames(styles.tBodyTdFirst)}
                // style={{ height: `${(i + 1) * 50}px` }}
              >
                <div className={styles.tBodyTdFirstContentWrapper}>
                  <TreeMosaicElement mosaicList={el.treeMosaic} isChild={el.isChild}>
                    <TreeMosaicNodeBtn
                      variant={'item'}
                      onClick={() => onAdd({ value: el.data.id })}
                      disabled={el.isNew || disabled}
                    />
                    {!el.isNew && editRowId !== el.data.id && (
                      <TreeMosaicNodeBtn
                        variant={'trash'}
                        onClick={() => onDeleteSubmit(el.data.id)}
                        disabled={disabled}
                      />
                    )}
                    {(el.isNew || editRowId === el.data.id) && (
                      <TreeMosaicNodeBtn variant={'cancel'} onClick={onCancel} disabled={disabled} />
                    )}
                  </TreeMosaicElement>
                </div>
              </td>
              {!el.isNew && editRowId !== el.data.id && <TreeRowView rowData={el.data} />}
              {el.isNew && editRowId !== el.data.id && (
                <TreeRowForm rowData={el.data} onSubmit={(values) => onAddSubmit(values)} disabled={disabled} />
              )}
              {!el.isNew && editRowId === el.data.id && (
                <TreeRowForm
                  rowData={el.data}
                  disabled={disabled}
                  onSubmit={(values) => {
                    onPatchSubmit(values);
                  }}
                />
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
