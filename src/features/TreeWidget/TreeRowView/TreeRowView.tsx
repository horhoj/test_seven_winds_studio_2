import { TreeViewRowBody } from '../treeTypes';
// import styles from './TreeRowView.module.scss';

interface TreeRowViewProps {
  rowData: TreeViewRowBody;
}

export function TreeRowView({ rowData }: TreeRowViewProps) {
  return (
    <>
      <td>{rowData.rowName}</td>
      <td>{rowData.salary.toLocaleString()}</td>
      <td>{rowData.equipmentCosts.toLocaleString()}</td>
      <td>{rowData.overheads.toLocaleString()}</td>
      <td>{rowData.estimatedProfit.toLocaleString()}</td>
    </>
  );
}
