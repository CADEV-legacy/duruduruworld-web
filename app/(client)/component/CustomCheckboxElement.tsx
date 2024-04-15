'use client';

import { CheckboxElement, CheckboxElementProps } from 'react-hook-form-mui';

import * as S from './CustomCheckboxElement.styles';

import { SmartImage } from '@/(client)/component';

import checkboxIcon from '#/icons/checkbox.svg';

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
        icon={<SmartImage alt='checkbox-icon' src={checkboxIcon} />}
        label={children}
        // checkedIcon={<S.CustomCheckboxCheckedIcon />}
        {...checkboxProps}
      />
    </S.Container>
  );
};
