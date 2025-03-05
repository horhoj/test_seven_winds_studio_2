import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getApiErrors } from '~/api/common';
import { ApiError } from '~/api/common.types';
import { outlayRowsAPI } from '~/api/outlayRows';
import { RowTreeNode } from '~/api/outlayRows.types';
import { makeRequestExtraReducer, makeRequestStateProperty, RequestList, RequestStateProperty } from '~/store/helpers';

const SLICE_NAME = 'tree';

interface IS {
  fetchRowListRequest: RequestStateProperty<RowTreeNode[], ApiError>;
}

const initialState: IS = {
  fetchRowListRequest: makeRequestStateProperty(),
};

const { actions, reducer, selectors } = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    makeRequestExtraReducer<RequestList<IS>>(builder, fetchRowListThunk, 'fetchRowListRequest');
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

export const treeSlice = { actions, selectors, thunks: { fetchRowListThunk } } as const;

export const treeReducer = reducer;
