'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FormContainer, RadioButtonGroup, TextFieldElement, useForm } from 'react-hook-form-mui';

import { Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import * as S from './AccountInformationForm.styles';

import { GENDER, Gender } from '@/(server)/union';
import { BIRTH_REGEX, EMAIL_REGEX, NAME_REGEX } from '@/(server)/util';

import { AccountInformationSchemaSelect } from '@/(server)/api/user/me/type';

import { FormItem, SmartTypography } from '@/(client)/component';
import { AuthUpdateMeRequestProps, UserMeRequestReturn } from '@/(client)/request';
import { useAuthMutation, useUserMe, userQueryKeys } from '@/(client)/service';
import { useAuthStore } from '@/(client)/store';

import { isBadRequest, isNotFound, isValidationFailed } from '@/(error)';

import { COLOR, ROUTE_URL } from '@/constant';

const EXCEPT_NUMBER_REGEX = /[^0-9]/g;
const SPACE_REGEX = /\s/g;

type AccountInformationFormProps = Omit<
  AccountInformationSchemaSelect,
  'pets' | 'deliveredCount'
> & {
  deliveredCount: string;
};

const VALIDATION: {
  [key in keyof AccountInformationFormProps]?: {
    required?: string;
    pattern?: { value: RegExp; message: string };
  };
} = {
  name: {
    required: '이름을 입력해주세요.',
    pattern: {
      value: NAME_REGEX,
      message: '1-20자의 한글, 영문만 입력 가능합니다.',
    },
  },
  email: {
    pattern: {
      value: EMAIL_REGEX,
      message: '이메일 형식이 올바르지 않습니다.',
    },
  },
  birth: {
    required: '생년월일을 입력해주세요.',
    pattern: {
      value: BIRTH_REGEX,
      message: '숫자 8자리로 YYYYMMDD 형식으로만 입력 가능합니다.',
    },
  },
  address: {
    required: '주소를 입력해주세요.',
  },
  addressDetail: {
    required: '상세주소를 입력해주세요.',
  },
};

export const AccountInformationForm: React.FC = () => {
  const router = useRouter();
  const accountInformationForm = useForm<AccountInformationFormProps>();
  const { gender } = accountInformationForm.watch();
  const [isEditMode, setIsEditMode] = useState(false);
  const { accessToken } = useAuthStore();
  const { authUpdateMeMutation } = useAuthMutation();
  const { data } = useUserMe(accessToken);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const daumAddressSearchOverlayRef = useRef<HTMLDivElement>(null);
  const daumAddressSearchWrapperRef = useRef<HTMLDivElement>(null);
  const daumAddressSearchContainerRef = useRef<HTMLDivElement>(null);

  const accountInformationData = useMemo(() => data?.information, [data]);

  const onAccountInformationFormSuccess = async ({
    name,
    email,
    birth,
    postalCode,
    address,
    addressDetail,
    gender,
  }: AccountInformationFormProps) => {
    try {
      await authUpdateMeMutation.mutateAsync(
        {
          name,
          email,
          birth,
          postalCode,
          address,
          addressDetail,
          gender,
        },
        {
          onSuccess: () => {
            queryClient.setQueryData<UserMeRequestReturn>(userQueryKeys.me(accessToken), prev => {
              if (!prev) return;

              return {
                ...prev,
                information: {
                  ...prev.information,
                  name,
                  email,
                  birth,
                  postalCode,
                  address,
                  addressDetail,
                  gender,
                },
              };
            });
          },
        }
      );

      enqueueSnackbar('정보 수정이 완료되었습니다 :)', { variant: 'success' });

      setIsEditMode(false);
    } catch (error) {
      if (isBadRequest(error)) {
        error.detail.forEach(({ field }) => {
          switch (field as keyof AuthUpdateMeRequestProps) {
            case 'name':
              accountInformationForm.setError(field as keyof AuthUpdateMeRequestProps, {
                message: VALIDATION.name?.required,
              });

              return;
            case 'birth':
              accountInformationForm.setError(field as keyof AuthUpdateMeRequestProps, {
                message: VALIDATION.birth?.required,
              });

              return;
            case 'address':
              accountInformationForm.setError(field as keyof AuthUpdateMeRequestProps, {
                message: VALIDATION.address?.required,
              });

              return;
            case 'addressDetail':
              accountInformationForm.setError(field as keyof AuthUpdateMeRequestProps, {
                message: VALIDATION.addressDetail?.required,
              });

              return;
            default:
              accountInformationForm.setError(field as keyof AuthUpdateMeRequestProps, {
                message: '필수 입력 사항입니다.',
              });
          }
        });
      }

      if (isValidationFailed(error)) {
        error.detail.forEach(({ field, reason }) => {
          switch (field as keyof AuthUpdateMeRequestProps) {
            case 'name':
              accountInformationForm.setError(field as keyof AuthUpdateMeRequestProps, {
                message: VALIDATION.name?.pattern?.message,
              });

              return;
            case 'email':
              accountInformationForm.setError(field as keyof AuthUpdateMeRequestProps, {
                message: VALIDATION.email?.pattern?.message,
              });

              return;
            case 'birth':
              accountInformationForm.setError(field as keyof AuthUpdateMeRequestProps, {
                message: VALIDATION.birth?.pattern?.message,
              });

              return;
            default:
              accountInformationForm.setError(field as keyof AuthUpdateMeRequestProps, {
                message: reason,
              });
          }
        });
      }

      if (isNotFound(error)) {
        if (error.detail === 'accountInformation') {
          enqueueSnackbar('회원 정보를 찾을 수 없습니다 :(', { variant: 'error' });

          router.push(ROUTE_URL.auth.signIn);
        }
      }
    }
  };

  const onBirthInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const birth = event.target.value;

    if (SPACE_REGEX.test(birth)) {
      accountInformationForm.setValue('birth', birth.replace(SPACE_REGEX, ''));

      return;
    }

    if (EXCEPT_NUMBER_REGEX.test(birth)) {
      accountInformationForm.setValue('birth', birth.replace(EXCEPT_NUMBER_REGEX, ''));

      return;
    }

    if (birth.length > 8) accountInformationForm.setValue('birth', birth.slice(0, 8));
  };

  const onAddressSearchButtonClick = () => {
    if (!isEditMode) return;

    if (
      daumAddressSearchOverlayRef.current === null ||
      daumAddressSearchWrapperRef.current === null ||
      daumAddressSearchContainerRef.current === null
    )
      return;

    daumAddressSearchOverlayRef.current.style.display = 'flex';
    daumAddressSearchWrapperRef.current.style.display = 'flex';
    daumAddressSearchContainerRef.current.style.display = 'block';

    new daum.Postcode({
      oncomplete: function (data) {
        accountInformationForm.setValue('postalCode', data.zonecode);
        accountInformationForm.setValue('address', data.address);

        if (
          daumAddressSearchOverlayRef.current === null ||
          daumAddressSearchWrapperRef.current === null ||
          daumAddressSearchContainerRef.current === null
        )
          return;

        daumAddressSearchOverlayRef.current.style.display = 'none';
        daumAddressSearchWrapperRef.current.style.display = 'none';
        daumAddressSearchContainerRef.current.style.display = 'none';
      },
      onresize: size => {
        if (
          daumAddressSearchOverlayRef.current === null ||
          daumAddressSearchWrapperRef.current === null ||
          daumAddressSearchContainerRef.current === null
        )
          return;

        daumAddressSearchContainerRef.current.style.width = `${size.width}px`;
        daumAddressSearchContainerRef.current.style.height = `${size.height}px`;
      },
      width: '100%',
      height: '100%',
      theme: {
        bgColor: COLOR.themeColor2,
      },
    }).embed(daumAddressSearchContainerRef.current);
  };

  const onDaumAddressSearchOverlayClick = () => {
    if (
      daumAddressSearchOverlayRef.current === null ||
      daumAddressSearchWrapperRef.current === null ||
      daumAddressSearchContainerRef.current === null
    )
      return;

    daumAddressSearchOverlayRef.current.style.display = 'none';
    daumAddressSearchWrapperRef.current.style.display = 'none';
    daumAddressSearchContainerRef.current.style.display = 'none';
  };

  const onGenderRadioClick = (gender: Gender) => {
    if (!isEditMode) return;

    accountInformationForm.setValue('gender', gender);
  };

  const onCancelButtonClick = () => {
    if (!accountInformationData) return;

    setIsEditMode(false);

    accountInformationForm.reset({
      ...accountInformationData,
      deliveredCount: accountInformationData.deliveredCount.toString(),
    });
  };

  useEffect(() => {
    if (accountInformationData)
      accountInformationForm.reset({
        ...accountInformationData,
        deliveredCount: accountInformationData.deliveredCount.toString(),
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountInformationData]);

  return (
    <FormContainer formContext={accountInformationForm} onSuccess={onAccountInformationFormSuccess}>
      <S.Container>
        <FormItem label='이름'>
          <TextFieldElement name='name' validation={VALIDATION.name} disabled={!isEditMode} />
        </FormItem>
        <FormItem label='이메일'>
          <TextFieldElement name='email' validation={VALIDATION.email} disabled={!isEditMode} />
        </FormItem>
        <FormItem label='생년월일'>
          <TextFieldElement
            name='birth'
            validation={VALIDATION.birth}
            onChange={onBirthInputChange}
            disabled={!isEditMode}
          />
        </FormItem>
        <FormItem
          label='주소'
          formHandleButtonProps={{
            text: '주소검색',
            disabled: !isEditMode,
            onClick: onAddressSearchButtonClick,
          }}>
          <TextFieldElement
            name='address'
            placeholder='영역을 클릭해 검색해주세요 :)'
            validation={VALIDATION.address}
            onFocus={onAddressSearchButtonClick}
            disabled={!isEditMode}
          />
        </FormItem>
        <S.AddressDetailInputContainer>
          <TextFieldElement
            name='addressDetail'
            placeholder='상세주소입력(직접입력)'
            validation={VALIDATION.addressDetail}
            disabled={!isEditMode}
          />
        </S.AddressDetailInputContainer>
        <FormItem label='성별'>
          <>
            <S.InvisibleRadioContainer>
              <RadioButtonGroup
                name='gender'
                required
                valueKey='value'
                options={[
                  { id: 'gender-option1', label: '남성', value: GENDER.male },
                  { id: 'gender-option2', label: '여성', value: GENDER.female },
                  { id: 'gender-option1', label: '남성', value: GENDER.none },
                ]}
                row
              />
            </S.InvisibleRadioContainer>
            <S.GenderCustomRadioContainer>
              <S.GenderCustomRadio
                selected={gender === 'male'}
                onClick={() => onGenderRadioClick(GENDER.male)}>
                <Typography fontSize='1.125rem' fontWeight='bold'>
                  남성
                </Typography>
              </S.GenderCustomRadio>
              <S.GenderCustomRadio
                selected={gender === 'female'}
                onClick={() => onGenderRadioClick(GENDER.female)}>
                <Typography fontSize='1.125rem' fontWeight='bold'>
                  여성
                </Typography>
              </S.GenderCustomRadio>
              <S.GenderCustomRadio
                selected={gender === 'none'}
                onClick={() => onGenderRadioClick(GENDER.none)}>
                <Typography fontSize='1.125rem' fontWeight='bold'>
                  선택안함
                </Typography>
              </S.GenderCustomRadio>
            </S.GenderCustomRadioContainer>
          </>
        </FormItem>
        <FormItem label='배송 완료 횟수'>
          <S.SmartTypographyContainer>
            <SmartTypography
              fontSize='1.25rem'
              text={
                accountInformationData
                  ? `현재까지 ${accountInformationData.deliveredCount}회 배송되었습니다 :)`
                  : undefined
              }
            />
          </S.SmartTypographyContainer>
        </FormItem>
        {!isEditMode && (
          <S.EditButton type='button' onClick={() => setIsEditMode(true)}>
            정보 수정하기
          </S.EditButton>
        )}
        {isEditMode && (
          <>
            <S.UpdateButton type='submit' disabled={authUpdateMeMutation.isPending}>
              수정완료
            </S.UpdateButton>
            <S.CancelButton type='button' onClick={onCancelButtonClick}>
              취소하기
            </S.CancelButton>
          </>
        )}
        <S.DaumAddressSearchOverlay
          ref={daumAddressSearchOverlayRef}
          onClick={onDaumAddressSearchOverlayClick}>
          <S.DaumAddressSearchWrapper ref={daumAddressSearchWrapperRef}>
            <S.DaumAddressSearchContainer ref={daumAddressSearchContainerRef} />
          </S.DaumAddressSearchWrapper>
        </S.DaumAddressSearchOverlay>
      </S.Container>
    </FormContainer>
  );
};
