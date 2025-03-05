import { useEffect } from 'react';
import { TreeTable } from '../TreeTable';
import { treeSlice } from '../treeSlice';
import { useAppDispatch, useAppSelector } from '~/store/hooks';

export function TreeWidget() {
  const dispatch = useAppDispatch();

  const fetchRowListRequest = useAppSelector((state) => state.tree.fetchRowListRequest);

  useEffect(() => {
    dispatch(treeSlice.thunks.fetchRowListThunk());
    return () => {
      treeSlice.actions.clear();
    };
  }, []);

  return <>{fetchRowListRequest.data && <TreeTable newParentNodeId={null} tree={fetchRowListRequest.data} />}</>;
}
