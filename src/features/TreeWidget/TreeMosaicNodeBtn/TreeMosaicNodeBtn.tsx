import styles from './TreeMosaicNodeBtn.module.scss';

import { CancelItemIcon, NewItemIcon, TrashItemIcon } from '~/assets/icons';

const variants = {
  trash: TrashItemIcon,
  item: NewItemIcon,
  cancel: CancelItemIcon,
} as const satisfies Record<string, () => React.ReactNode>;

interface TreeMosaicNodeBtnProps {
  variant: keyof typeof variants;
  onClick: () => void;
  disabled?: boolean;
}
export function TreeMosaicNodeBtn({ variant, onClick, disabled = false }: TreeMosaicNodeBtnProps) {
  const VariantIcon = variants[variant];
  return (
    <button className={styles.element} tabIndex={-1} onClick={onClick} disabled={disabled}>
      <VariantIcon />
    </button>
  );
}
