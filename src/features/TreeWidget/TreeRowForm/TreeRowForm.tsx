import { useEffect, useMemo, useRef } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { TreeViewRowBody } from '../treeTypes';
import styles from './TreeRowForm.module.scss';
import { getUUID } from '~/utils/getUUID';
import { getFormikFieldData } from '~/utils/getFormikFieldData';
import { Portal } from '~/ui/Portal';

interface TreeRowFormProps {
  rowData: TreeViewRowBody;
  onSubmit: (values: TreeViewRowBody) => void;
  disabled: boolean;
}

type FormValues = Pick<TreeViewRowBody, 'rowName' | 'salary' | 'equipmentCosts' | 'overheads' | 'estimatedProfit'>;

const integerValidator = (n: number | undefined): boolean =>
  typeof n === 'number' && new RegExp('^[0-9]+$').test(n.toString());

const VALIDATION_IS_EMPTY_MSG = 'не заполнено';
const VALIDATION_IS_NOT_STRING = 'не строка';
const VALIDATION_IS_NOT_NUMBER = 'не число';
const VALIDATION_IS_NOT_INTEGER = 'не целое число';
const VALIDATION_VERY_BIG_NUMBER = 'слишком большое число';
const VALIDATION_MAX_NUMBER = 999999999999999;

const validationSchema: yup.ObjectSchema<FormValues> = yup.object({
  rowName: yup.string().typeError(VALIDATION_IS_NOT_STRING).required(VALIDATION_IS_EMPTY_MSG),
  salary: yup
    .number()
    .typeError(VALIDATION_IS_NOT_NUMBER)
    .max(VALIDATION_MAX_NUMBER, VALIDATION_VERY_BIG_NUMBER)
    .test('isInteger', VALIDATION_IS_NOT_INTEGER, integerValidator)
    .required(VALIDATION_IS_EMPTY_MSG),
  equipmentCosts: yup
    .number()
    .typeError(VALIDATION_IS_NOT_NUMBER)
    .max(VALIDATION_MAX_NUMBER, VALIDATION_VERY_BIG_NUMBER)
    .test('isInteger', VALIDATION_IS_NOT_INTEGER, integerValidator)
    .required(VALIDATION_IS_EMPTY_MSG),
  overheads: yup
    .number()
    .typeError(VALIDATION_IS_NOT_NUMBER)
    .max(VALIDATION_MAX_NUMBER, VALIDATION_VERY_BIG_NUMBER)
    .test('isInteger', VALIDATION_IS_NOT_INTEGER, integerValidator)
    .required(VALIDATION_IS_EMPTY_MSG),
  estimatedProfit: yup
    .number()
    .typeError(VALIDATION_IS_NOT_NUMBER)
    .max(VALIDATION_MAX_NUMBER, VALIDATION_VERY_BIG_NUMBER)
    .test('isInteger', VALIDATION_IS_NOT_INTEGER, integerValidator)
    .required(VALIDATION_IS_EMPTY_MSG),
});

export function TreeRowForm({ rowData, onSubmit, disabled }: TreeRowFormProps) {
  const ref = useRef<HTMLInputElement>(null);

  const FORM_ID = useMemo(() => `form_${getUUID()}`, []);

  const formik = useFormik<FormValues>({
    initialValues: {
      rowName: rowData.rowName,
      salary: rowData.salary,
      equipmentCosts: rowData.equipmentCosts,
      estimatedProfit: rowData.estimatedProfit,
      overheads: rowData.overheads,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      const parse = (value: number) => Number.parseInt(value.toString());
      const result: TreeViewRowBody = {
        ...rowData,
        rowName: values.rowName,
        salary: parse(values.salary),
        equipmentCosts: parse(values.equipmentCosts),
        overheads: parse(values.overheads),
        estimatedProfit: parse(values.estimatedProfit),
      };
      onSubmit(result);
    },
  });

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    ref.current?.focus();
  }, [rowData.id]);

  const rowNameFieldData = getFormikFieldData(formik, 'rowName');
  const salaryFieldData = getFormikFieldData(formik, 'salary');
  const equipmentCostsFieldData = getFormikFieldData(formik, 'equipmentCosts');
  const overheadsFieldData = getFormikFieldData(formik, 'overheads');
  const estimatedProfitFieldData = getFormikFieldData(formik, 'estimatedProfit');

  return (
    <>
      <>
        <Portal>
          <form noValidate autoComplete={'off'} id={FORM_ID} onSubmit={formik.handleSubmit} className={styles.form}>
            <button form={FORM_ID} type={'submit'} disabled={disabled}>
              submit
            </button>
          </form>
        </Portal>
        <td>
          <span className={styles.field}>
            <input
              type="text"
              {...rowNameFieldData.fieldProps}
              form={FORM_ID}
              className={styles.input}
              ref={ref}
              readOnly={disabled}
            />

            {rowNameFieldData.isError && <span className={styles.error}>{rowNameFieldData.errorText}</span>}
          </span>
        </td>

        <td>
          <span className={styles.field}>
            <input
              type="number"
              {...salaryFieldData.fieldProps}
              form={FORM_ID}
              className={styles.input}
              readOnly={disabled}
            />
            {salaryFieldData.isError && <span className={styles.error}>{salaryFieldData.errorText}</span>}
          </span>
        </td>

        <td>
          <span className={styles.field}>
            <input
              type="number"
              {...equipmentCostsFieldData.fieldProps}
              form={FORM_ID}
              className={styles.input}
              readOnly={disabled}
            />
            {equipmentCostsFieldData.isError && (
              <span className={styles.error}>{equipmentCostsFieldData.errorText}</span>
            )}
          </span>
        </td>

        <td>
          <span className={styles.field}>
            <input
              type="number"
              {...overheadsFieldData.fieldProps}
              form={FORM_ID}
              className={styles.input}
              readOnly={disabled}
            />
            {overheadsFieldData.isError && <span className={styles.error}>{overheadsFieldData.errorText}</span>}
          </span>
        </td>

        <td>
          <span className={styles.field}>
            <input
              type="number"
              {...estimatedProfitFieldData.fieldProps}
              form={FORM_ID}
              className={styles.input}
              readOnly={disabled}
            />
            {estimatedProfitFieldData.isError && (
              <span className={styles.error}>{estimatedProfitFieldData.errorText}</span>
            )}
          </span>
        </td>
      </>
    </>
  );
}
