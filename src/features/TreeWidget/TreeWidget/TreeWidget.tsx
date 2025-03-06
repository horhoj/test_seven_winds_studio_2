import { useEffect } from 'react';
import { TreeTable } from '../TreeTable';
import { treeSlice } from '../treeSlice';
import { NewParentNodeId, TreeViewRowBody } from '../treeTypes';
import { useAppDispatch, useAppSelector } from '~/store/hooks';

export function TreeWidget() {
  const dispatch = useAppDispatch();

  const tree = useAppSelector((state) => state.tree.fetchRowListRequest.data);

  const newParentNodeId = useAppSelector((state) => state.tree.newParentNodeId);
  const editRowId = useAppSelector((state) => state.tree.editRowId);

  useEffect(() => {
    dispatch(treeSlice.thunks.fetchRowListThunk());
    return () => {
      treeSlice.actions.clear();
    };
  }, []);

  const handleAdd = (newParentNodeId: NewParentNodeId) => {
    dispatch(treeSlice.actions.setEditRowId(null));
    dispatch(treeSlice.actions.setNewParentNodeId(newParentNodeId));
  };

  const handleEdit = (elId: number) => {
    dispatch(treeSlice.actions.setNewParentNodeId(null));
    dispatch(treeSlice.actions.setEditRowId(elId));
  };

  const handleCancel = () => {
    dispatch(treeSlice.actions.setNewParentNodeId(null));
    dispatch(treeSlice.actions.setEditRowId(null));
  };

  const handleAddSubmit = (values: TreeViewRowBody) => {
    if (newParentNodeId) {
      dispatch(treeSlice.thunks.addRowThunk({ values, newParentNodeId }));
    }
  };

  const handlePatchSubmit = (values: TreeViewRowBody) => {
    if (editRowId) {
      dispatch(treeSlice.thunks.patchRowThunk({ editRowId, values }));
    }
  };

  const handleDeleteSubmit = (elId: number) => {
    const res = confirm('Удалить?');
    if (res) {
      dispatch(treeSlice.thunks.deleteRowThunk({ deleteRowId: elId }));
    }
  };

  return (
    <>
      {tree && (
        <TreeTable
          newParentNodeId={newParentNodeId}
          editRowId={editRowId}
          tree={tree}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onAddSubmit={handleAddSubmit}
          onPatchSubmit={handlePatchSubmit}
          onDeleteSubmit={handleDeleteSubmit}
        />
      )}
    </>
  );
}
