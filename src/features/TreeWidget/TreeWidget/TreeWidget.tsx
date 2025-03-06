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
  const isLoading = useAppSelector(treeSlice.selectors.isLoading);

  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch(treeSlice.actions.setNewParentNodeId(null));
        dispatch(treeSlice.actions.setEditRowId(null));
      }
    };
    if (editRowId !== null || newParentNodeId !== null) {
      window.addEventListener('keydown', keyDown);
    }
    return () => {
      window.removeEventListener('keydown', keyDown);
    };
  }, [editRowId, newParentNodeId]);

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
    dispatch(treeSlice.actions.setNewParentNodeId(null));
    dispatch(treeSlice.actions.setEditRowId(null));
    setTimeout(() => {
      const res = confirm('Удалить?');
      if (res) {
        dispatch(treeSlice.thunks.deleteRowThunk({ deleteRowId: elId }));
      }
    }, 300);
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
          disabled={isLoading}
        />
      )}
    </>
  );
}
