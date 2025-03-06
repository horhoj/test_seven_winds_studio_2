import { ToastContainer } from 'react-toastify';
import styles from './App.module.scss';
import { HeaderBottom } from '~/components/HeaderBottom';
import { HeaderTop } from '~/components/HeaderTop';
import { LeftMenu } from '~/components/LeftMenu';
import { TreeWidget } from '~/features/TreeWidget/TreeWidget';
import { Portal } from '~/ui/Portal';
import 'react-toastify/dist/ReactToastify.css';
import { GlobalSpinner } from '~/features/GlobalSpinner/GlobalSpinner';

export function App() {
  return (
    <>
      <GlobalSpinner />
      <Portal>
        <ToastContainer theme={'dark'} position={'bottom-right'} />
      </Portal>
      <div className={styles.App}>
        <HeaderTop />
        <HeaderBottom />
        <div className={styles.center}>
          <LeftMenu />
          <TreeWidget />
        </div>
      </div>
    </>
  );
}
