import { treeSlice } from '../TreeWidget/treeSlice';
import { useAppSelector } from '~/store/hooks';
import { Spinner } from '~/ui/Spinner';

export function GlobalSpinner() {
  const isLoading = useAppSelector(treeSlice.selectors.isLoading);

  return <Spinner isShow={isLoading} />;
}
