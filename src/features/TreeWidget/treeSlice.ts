import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { NewParentNodeId, TreeViewRowBody } from './treeTypes';
import { getApiErrors } from '~/api/common';
import { ApiError } from '~/api/common.types';
import { outlayRowsAPI } from '~/api/outlayRows';
import { Changed, RowCreateResponse, RowPatchResponse, RowTreeNode } from '~/api/outlayRows.types';
import { makeRequestExtraReducer, makeRequestStateProperty, RequestList, RequestStateProperty } from '~/store/helpers';

const SLICE_NAME = 'tree';

interface IS {
  newParentNodeId: NewParentNodeId | null;
  editRowId: number | null;
  fetchRowListRequest: RequestStateProperty<RowTreeNode[], ApiError>;
  addRowRequest: RequestStateProperty<unknown, ApiError>;
  patchRowRequest: RequestStateProperty<unknown, ApiError>;
  deleteRowRequest: RequestStateProperty<unknown, ApiError>;
}

const initialState: IS = {
  newParentNodeId: null,
  editRowId: null,
  addRowRequest: makeRequestStateProperty(),
  fetchRowListRequest: makeRequestStateProperty(),
  deleteRowRequest: makeRequestStateProperty(),
  patchRowRequest: makeRequestStateProperty(),
};

const { actions, reducer, selectors } = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    clear: () => initialState,
    setNewParentNodeId: (state, action: PayloadAction<NewParentNodeId | null>) => {
      state.newParentNodeId = action.payload;
    },
    setEditRowId: (state, action: PayloadAction<number | null>) => {
      state.editRowId = action.payload;
    },
    add: (state, action: PayloadAction<{ newParentNodeId: NewParentNodeId; body: RowCreateResponse['current'] }>) => {
      if (!state.fetchRowListRequest.data) {
        return;
      }
      if (action.payload.newParentNodeId.value === null) {
        state.fetchRowListRequest.data.push({ ...action.payload.body, child: [] });
        return;
      }

      const stack: RowTreeNode[] = state.fetchRowListRequest.data.slice();

      while (stack.length > 0) {
        const current = stack.shift();
        if (current) {
          if (current.id === action.payload.newParentNodeId.value) {
            current.child.push({ ...action.payload.body, child: [] });
            return;
          }
          stack.unshift(...current.child.slice());
        }
      }
    },
    patch: (state, action: PayloadAction<{ editRowId: number; body: RowPatchResponse['current'] }>) => {
      if (!state.fetchRowListRequest.data) {
        return;
      }

      const stack: RowTreeNode[] = state.fetchRowListRequest.data.slice();

      while (stack.length > 0) {
        const current = stack.shift();
        if (current) {
          if (current.id === action.payload.editRowId) {
            Object.assign(current, { ...action.payload.body, child: current.child });
            return;
          }
          stack.unshift(...current.child.slice());
        }
      }
    },
    delete: (state, action: PayloadAction<{ deleteRowId: number }>) => {
      if (state.fetchRowListRequest.data === null) {
        return;
      }

      const rootList = state.fetchRowListRequest.data;

      const stack: { data: RowTreeNode; parentList: RowTreeNode[] }[] = state.fetchRowListRequest.data.map((el) => ({
        data: el,
        parentList: rootList,
      }));
      while (stack.length > 0) {
        const current = stack.shift();
        if (current) {
          if (current.data.id === action.payload.deleteRowId) {
            const idx = current.parentList.findIndex((el) => el.id === action.payload.deleteRowId);
            if (idx > -1) {
              current.parentList.splice(idx, 1);
            }
            return;
          }
          stack.unshift(
            ...current.data.child.map((el) => ({
              data: el,
              parentList: current.data.child,
            })),
          );
        }
      }
    },

    updateGlobal: (state, action: PayloadAction<Changed[]>) => {
      if (state.fetchRowListRequest.data === null) {
        return;
      }

      const changeMap: Record<number, Changed> = {};
      for (const el of action.payload) {
        changeMap[el.id] = el;
      }
      const stack: RowTreeNode[] = [...state.fetchRowListRequest.data];

      while (stack.length > 0) {
        const el = stack.shift();
        if (el) {
          stack.unshift(...el.child);
          const elNewData = changeMap[el.id];
          if (elNewData) {
            Object.assign(el, { ...elNewData, child: el.child });
          }
        }
      }
    },
  },
  selectors: {
    isLoading: (state) =>
      state.fetchRowListRequest.isLoading ||
      state.addRowRequest.isLoading ||
      state.patchRowRequest.isLoading ||
      state.deleteRowRequest.isLoading,
  },
  extraReducers: (builder) => {
    makeRequestExtraReducer<RequestList<IS>>(builder, fetchRowListThunk, 'fetchRowListRequest');
    makeRequestExtraReducer<RequestList<IS>>(builder, deleteRowThunk, 'deleteRowRequest');
    makeRequestExtraReducer<RequestList<IS>>(builder, patchRowThunk, 'patchRowRequest');
    makeRequestExtraReducer<RequestList<IS>>(builder, addRowThunk, 'addRowRequest');
  },
});

const fetchRowListThunk = createAsyncThunk(`SLICE_NAME/fetchRowListThunk`, async (_, store) => {
  try {
    const res = await outlayRowsAPI.fetchRowList();
    toast.success('Дерево сущностей загружено успешно');
    return store.fulfillWithValue(res);
  } catch (e: unknown) {
    const error = getApiErrors(e);
    toast.error(`Ошибка загрузки дерева сущностей: ${error.errorMessage}`);
    return store.rejectWithValue(error);
  }
});

interface AddRowThunkPayload {
  values: TreeViewRowBody;
  newParentNodeId: NewParentNodeId;
}

const addRowThunk = createAsyncThunk(
  `SLICE_NAME/addRowThunk`,
  async ({ values, newParentNodeId }: AddRowThunkPayload, store) => {
    try {
      const res = await outlayRowsAPI.createRow({ ...values, parentId: newParentNodeId.value });
      store.dispatch(actions.add({ body: res.current, newParentNodeId }));
      store.dispatch(actions.updateGlobal(res.changed));
      store.dispatch(actions.setNewParentNodeId(null));
      store.dispatch(actions.setEditRowId(null));

      toast.success('Создано успешно');
      return store.fulfillWithValue(res);
    } catch (e: unknown) {
      const error = getApiErrors(e);
      toast.error(`Ошибка создания: ${error.errorMessage}`);
      return store.rejectWithValue(error);
    }
  },
);

interface PatchRowThunkPayload {
  values: TreeViewRowBody;
  editRowId: number;
}

const patchRowThunk = createAsyncThunk(
  `SLICE_NAME/patchRowThunk`,
  async ({ values, editRowId }: PatchRowThunkPayload, store) => {
    try {
      const res = await outlayRowsAPI.patchRowList(editRowId, values);
      store.dispatch(actions.patch({ body: res.current, editRowId }));
      store.dispatch(actions.updateGlobal(res.changed));
      store.dispatch(actions.setNewParentNodeId(null));
      store.dispatch(actions.setEditRowId(null));
      toast.success('Отредактировано успешно');
      return store.fulfillWithValue(res);
    } catch (e: unknown) {
      const error = getApiErrors(e);
      toast.error(`Ошибка редактирования: ${error.errorMessage}`);
      return store.rejectWithValue(error);
    }
  },
);

interface DeleteRowThunkPayload {
  deleteRowId: number;
}

const deleteRowThunk = createAsyncThunk(
  `SLICE_NAME/deleteRowThunk`,
  async ({ deleteRowId }: DeleteRowThunkPayload, store) => {
    try {
      const res = await outlayRowsAPI.deleteRowList(deleteRowId);
      store.dispatch(actions.delete({ deleteRowId }));
      store.dispatch(actions.updateGlobal(res.changed));
      store.dispatch(actions.setNewParentNodeId(null));
      store.dispatch(actions.setEditRowId(null));
      toast.success('Удалено успешно');
      return store.fulfillWithValue(res);
    } catch (e: unknown) {
      const error = getApiErrors(e);
      toast.error(`Ошибка удаления: ${error.errorMessage}`);
      return store.rejectWithValue(error);
    }
  },
);

export const treeSlice = {
  actions,
  selectors,
  thunks: { fetchRowListThunk, addRowThunk, patchRowThunk, deleteRowThunk },
} as const;

export const treeReducer = reducer;
