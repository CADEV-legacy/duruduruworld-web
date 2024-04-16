'use client';

import { CheckboxElement, CheckboxElementProps } from 'react-hook-form-mui';

import * as S from './CustomCheckboxElement.styles';

import { SmartImage } from '@/(client)/component';

import checkboxIcon from '#/icons/checkbox.svg';
import checkboxCheckedIcon from '#/icons/checkboxChecked.svg';

type CustomCheckboxElementProps = {
  children: React.ReactNode;
} & Omit<CheckboxElementProps, 'checkedIcon' | 'icon' | 'ref'>;

export const CustomCheckboxElement: React.FC<CustomCheckboxElementProps> = ({
  children,
  ...checkboxProps
}) => {
  return (
    <S.Container>
      <CheckboxElement
        label={children}
        icon={<SmartImage alt='checkbox-icon' src={checkboxIcon} />}
        checkedIcon={<SmartImage alt='checkbox-checked-icon' src={checkboxCheckedIcon} />}
        {...checkboxProps}
      />
    </S.Container>
  );
};
