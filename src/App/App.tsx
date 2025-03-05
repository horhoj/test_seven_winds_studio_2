import styles from './App.module.scss';
import { HeaderBottom } from '~/components/HeaderBottom';
import { HeaderTop } from '~/components/HeaderTop';
import { LeftMenu } from '~/components/LeftMenu';

export function App() {
  return (
    <div className={styles.App}>
      <HeaderTop />
      <HeaderBottom />
      <div className={styles.center}>
        <LeftMenu />
      </div>
    </div>
  );
}
