import styles from './TreeMosaicRootElement.module.scss';

interface TreeMosaicRootElementProps {
  children?: React.ReactNode;
}

export function TreeMosaicRootElement({ children }: TreeMosaicRootElementProps) {
  return (
    <span className={styles.TreeMosaicRootElement}>
      <span className={styles.TreeMosaicRootElementEl1} />

      <span className={styles.TreeMosaicRootElementEl2}>{children}</span>
    </span>
  );
}
