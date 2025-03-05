import { useMemo } from 'react';
import classNames from 'classnames';
import { treeMosaicType } from '../treeTypes';
import styles from './TreeMosaicElement.module.scss';
import { getUUID } from '~/utils/getUUID';

interface TreeMosaicElementProps {
  mosaicList: treeMosaicType[];
  isChild: boolean;
  children?: React.ReactNode;
}

export function TreeMosaicElement({ mosaicList, isChild, children }: TreeMosaicElementProps) {
  const mosaicListData = useMemo(() => mosaicList.map((value) => ({ id: getUUID(), value })), [mosaicList]);

  return (
    <>
      <span className={styles.mosaicElementWrapper}>
        {mosaicListData.map((el) => (
          <span className={classNames(styles.mosaicElement)} key={el.id}>
            {el.value === treeMosaicType.line && <span className={styles.mosaicElementLine} />}

            {el.value === treeMosaicType.start && (
              <>
                <span className={styles.mosaicElementStartEl1} />
                <span className={styles.mosaicElementStartEl2} />
              </>
            )}

            {el.value === treeMosaicType.end && (
              <>
                <span className={styles.mosaicElementEndEl1} />
                <span className={styles.mosaicElementEndEl2} />
              </>
            )}
          </span>
        ))}
      </span>
      <span className={styles.iconWrapper}>
        <span className={styles.iconWrapperExictsChild} />
        {isChild && (
          <>
            <span className={styles.iconWrapperExictsChildEl} />
          </>
        )}
        <span className={styles.iconWrapperChildren}>{children}</span>
      </span>
    </>
  );
}
