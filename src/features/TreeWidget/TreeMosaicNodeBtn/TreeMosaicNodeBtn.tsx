import styles from './TreeMosaicNodeBtn.module.scss';

import { CancelItemIcon, NewItemIcon, TrashItemIcon } from '~/assets/icons';

const variants = {
  trash: TrashItemIcon,
  item: NewItemIcon,
  cancel: CancelItemIcon,
} as const satisfies Record<string, () => React.ReactNode>;

interface TreeMosaicNodeBtnProps {
  variant: keyof typeof variants;
}
export function TreeMosaicNodeBtn({ variant }: TreeMosaicNodeBtnProps) {
  const VariantIcon = variants[variant];
  return (
    <button className={styles.element} tabIndex={-1}>
      <VariantIcon />
    </button>
  );
}
