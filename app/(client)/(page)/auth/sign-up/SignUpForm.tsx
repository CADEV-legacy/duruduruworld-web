'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FormContainer,
  PasswordElement,
  PasswordRepeatElement,
  RadioButtonGroup,
  TextFieldElement,
  TextareaAutosizeElement,
  useForm,
} from 'react-hook-form-mui';

import { Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import * as S from './SignUpForm.styles';

import { PetSchema } from '@/(server)/model';
import { GENDER, Gender, PET_TYPE, PetType } from '@/(server)/union';
import {
  BIRTH_REGEX,
  EMAIL_REGEX,
  IDENTIFIER_REGEX,
  NAME_REGEX,
  PASSWORD_REGEX,
  PHONE_NUMBER_REGEX,
  VERIFICATION_CODE_REGEX,
} from '@/(server)/util';

import { CustomCheckboxElement, FormItem, SmartImage } from '@/(client)/component';
import { useTimerHook } from '@/(client)/hook';
import { AuthSignUpRequestProps } from '@/(client)/request';
import { useAuthMutation } from '@/(client)/service';

import RHFMSelectElement from '@/(client)/component/RHFMSelectElement';

import {
  isBadRequest,
  isForbidden,
  isNotFound,
  isTooManyRequestWithCount,
  isTooManyRequestWithTime,
  isTooManyRequests,
  isValidationFailed,
} from '@/(error)';

import { COLOR, PET_NAME, ROUTE_URL } from '@/constant';

import addAnimalGroupIcon from '#/icons/addAnimalGroup.svg';
import deleteAnimalIcon from '#/icons/deleteAnimal.svg';
import newAnimalIcon from '#/icons/newAnimal.svg';

const PET_MAX_COUNT = 10;
const EXCEPT_NUMBER_REGEX = /[^0-9]/g;
const SPACE_REGEX = /\s/g;

type SignUpFormProps = Omit<AuthSignUpRequestProps<'credential'>, 'type' | 'pets'> & {
  petName: string;
  petBirth: string;
  petType: string;
  petTypeText: string;
  petContent: string;
  agreeToAll: boolean;
  termOfUseAndPrivacyPolicy: boolean;
  personalInformationCollectionAndUsageAgreement: boolean;
  over14YearsOld: boolean;
};

const SIGN_UP_FORM_DEFAULT_VALUES: SignUpFormProps = {
  identifier: '',
  password: '',
  passwordAccept: '',
  email: '',
  petName: '',
  petBirth: '',
  petType: PET_TYPE.goldenRetriever,
  petTypeText: '',
  petContent: '',
  name: '',
  birth: '',
  postalCode: '',
  address: '',
  addressDetail: '',
  gender: GENDER.male,
  phoneNumber: '',
  verificationCode: '',
  agreeToAll: false,
  termOfUseAndPrivacyPolicy: false,
  personalInformationCollectionAndUsageAgreement: false,
  over14YearsOld: false,
  marketingAgreement: false,
};

const VALIDATION: {
  [key in keyof SignUpFormProps]?: {
    required?: string;
    pattern?: { value: RegExp; message: string };
  };
} = {
  identifier: {
    required: '아이디를 입력해주세요.',
    pattern: {
      value: IDENTIFIER_REGEX,
      message: '6-20자의 영문 소문자, 숫자, 언더바(_)만 사용 가능합니다.',
    },
  },
  password: {
    required: '비밀번호를 입력해주세요.',
    pattern: {
      value: PASSWORD_REGEX,
      message: '8-30자의 영문 대/소문자, 숫자, 특수문자 각 1가지 이상을 조합해주세요.',
    },
  },
  passwordAccept: {
    required: '비밀번호를 다시 입력해주세요.',
  },
  email: {
    pattern: {
      value: EMAIL_REGEX,
      message: '이메일 형식이 올바르지 않습니다.',
    },
  },
  petName: {
    required: '반려동물 이름을 입력해주세요.',
    pattern: {
      value: NAME_REGEX,
      message: '1-20자의 한글, 영문만 입력 가능합니다.',
    },
  },
  petBirth: {
    required: '반려동물 생년월일을 입력해주세요.',
    pattern: {
      value: BIRTH_REGEX,
      message: '숫자 8자리로 YYYYMMDD 형식으로만 입력 가능합니다.',
    },
  },
  petType: {
    required: '반려동물 종을 선택해주세요.',
  },
  name: {
    required: '이름을 입력해주세요.',
    pattern: {
      value: NAME_REGEX,
      message: '1-20자의 한글, 영문만 입력 가능합니다.',
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
  phoneNumber: {
    required: '휴대전화번호를 입력해주세요.',
    pattern: {
      value: PHONE_NUMBER_REGEX,
      message: '휴대전화번호가 정확한지 확인해 주세요.',
    },
  },
  verificationCode: {
    required: '인증번호를 입력해주세요.',
    pattern: {
      value: VERIFICATION_CODE_REGEX,
      message: '인증번호는 6자리 숫자로만 입력 가능합니다.',
    },
  },
};

type Pet = Omit<PetSchema, '_id' | 'createdAt' | 'updatedAt'>;

export const SignUpForm: React.FC = () => {
  const router = useRouter();
  const signUpForm = useForm<SignUpFormProps>({ defaultValues: SIGN_UP_FORM_DEFAULT_VALUES });
  const {
    petName,
    petBirth,
    petType,
    petTypeText,
    gender,
    termOfUseAndPrivacyPolicy,
    personalInformationCollectionAndUsageAgreement,
    over14YearsOld,
    marketingAgreement,
  } = signUpForm.watch();
  const { enqueueSnackbar } = useSnackbar();
  const [pets, setPets] = useState<(Pet | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [isIdentifierUnique, setIsIdentifierUnique] = useState<boolean>();
  const [isVerificationCodeSend, setIsVerificationCodeSend] = useState<boolean>();
  const { run, reset, timerStatus, leftTime } = useTimerHook({ time: { minutes: 5 } });
  const {
    authSignUpMutation,
    authDuplicateIdentifierCheckMutation,
    authVerificationCodeSendMutation,
  } = useAuthMutation();
  const daumAddressSearchOverlayRef = useRef<HTMLDivElement>(null);
  const daumAddressSearchWrapperRef = useRef<HTMLDivElement>(null);
  const daumAddressSearchContainerRef = useRef<HTMLDivElement>(null);

  const leftTimeString = useMemo(() => {
    if (!timerStatus || timerStatus === 'initialized') return;

    const minutes = leftTime.minutes;
    const seconds = leftTime.seconds;

    return `0${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }, [timerStatus, leftTime]);

  const onSignUpFormSuccess = async ({
    identifier,
    password,
    passwordAccept,
    email,
    name,
    birth,
    postalCode,
    address,
    addressDetail,
    gender,
    phoneNumber,
    verificationCode,
    termOfUseAndPrivacyPolicy,
    personalInformationCollectionAndUsageAgreement,
    over14YearsOld,
    marketingAgreement,
  }: SignUpFormProps) => {
    try {
      if (setIsIdentifierUnique === undefined) {
        signUpForm.setError('identifier', { message: '아이디 중복 확인을 해주세요.' });

        return;
      }

      if (
        !termOfUseAndPrivacyPolicy ||
        !personalInformationCollectionAndUsageAgreement ||
        !over14YearsOld
      ) {
        enqueueSnackbar('필수 동의 사항을 모두 동의해주세요.', { variant: 'error' });
      }

      const fulledPets = pets.filter(pet => pet !== null) as Pet[];

      if (fulledPets.length === 0) {
        if (
          !petName ||
          !petBirth ||
          !petType ||
          ((petType === PET_TYPE.mixed || petType === PET_TYPE.etc) && !petTypeText)
        ) {
          if (!petName) signUpForm.setError('petName', { message: VALIDATION.petName?.required });

          if (!petBirth)
            signUpForm.setError('petBirth', { message: VALIDATION.petBirth?.required });

          if (
            !petType ||
            ((petType === PET_TYPE.mixed || petType === PET_TYPE.etc) && !petTypeText)
          )
            signUpForm.setError('petType', { message: VALIDATION.petType?.required });

          return;
        }
      }

      await authSignUpMutation.mutateAsync({
        type: 'credential',
        identifier,
        password,
        passwordAccept,
        email,
        pets:
          fulledPets.length > 0
            ? fulledPets
            : [
                {
                  name: petName,
                  birth: petBirth,
                  type: petType as PetType,
                  typeText: petTypeText,
                  content: signUpForm.getValues('petContent'),
                },
              ],
        name,
        birth,
        postalCode,
        address,
        addressDetail,
        gender,
        phoneNumber,
        verificationCode,
        marketingAgreement,
      });

      enqueueSnackbar('회원가입이 완료되었습니다. 로그인해주세요.');

      router.push(ROUTE_URL.auth.signIn);
    } catch (error) {
      if (isBadRequest(error)) {
        error.detail.forEach(({ field }) => {
          switch (field as keyof AuthSignUpRequestProps<'credential'>) {
            case 'identifier':
              signUpForm.setError(field as keyof SignUpFormProps, {
                message: VALIDATION.identifier?.required,
              });

              return;
            case 'password':
              signUpForm.setError(field as keyof SignUpFormProps, {
                message: VALIDATION.password?.required,
              });

              return;
            case 'passwordAccept':
              signUpForm.setError(field as keyof SignUpFormProps, {
                message: VALIDATION.passwordAccept?.required,
              });

              return;
            case 'pets':
              signUpForm.setError('petName', { message: VALIDATION.petName?.required });
              signUpForm.setError('petBirth', { message: VALIDATION.petBirth?.required });
              signUpForm.setError('petType', { message: VALIDATION.petType?.required });

              return;
            case 'name':
              signUpForm.setError('name', { message: VALIDATION.name?.required });

              return;
            case 'birth':
              signUpForm.setError('birth', { message: VALIDATION.birth?.required });

              return;
            case 'phoneNumber':
              signUpForm.setError('phoneNumber', { message: VALIDATION.phoneNumber?.required });

              return;
            case 'verificationCode':
              signUpForm.setError('verificationCode', {
                message: VALIDATION.verificationCode?.required,
              });

              return;
            default:
              signUpForm.setError(field as keyof SignUpFormProps, {
                message: '필수 입력 사항입니다.',
              });
          }
        });
      }

      if (isValidationFailed(error)) {
        error.detail.forEach(({ field, reason }) => {
          switch (field as keyof AuthSignUpRequestProps<'credential'>) {
            case 'identifier':
              signUpForm.setError('identifier', {
                message: VALIDATION.identifier?.pattern?.message,
              });

              return;
            case 'password':
              if (reason === 'REGEX_NOT_MATCHED') {
                signUpForm.setError('password', {
                  message: VALIDATION.password?.pattern?.message,
                });

                return;
              } else if (reason === 'NOT_MATCHED') {
                signUpForm.setError('passwordAccept', {
                  message: '비밀번호가 일치하지 않습니다.',
                });

                return;
              }

              return;
            case 'email':
              signUpForm.setError('email', { message: VALIDATION.email?.pattern?.message });

              return;
            case 'pets':
              signUpForm.setError('petName', { message: VALIDATION.petName?.pattern?.message });
              signUpForm.setError('petBirth', { message: VALIDATION.petBirth?.pattern?.message });
              signUpForm.setError('petType', { message: VALIDATION.petType?.pattern?.message });

              return;
            case 'name':
              signUpForm.setError('name', { message: VALIDATION.name?.pattern?.message });

              return;
            case 'birth':
              signUpForm.setError('birth', { message: VALIDATION.birth?.pattern?.message });

              return;
            case 'phoneNumber':
              signUpForm.setError('phoneNumber', {
                message: VALIDATION.phoneNumber?.pattern?.message,
              });

              return;
            case 'verificationCode':
              signUpForm.setError('verificationCode', {
                message: VALIDATION.verificationCode?.pattern?.message,
              });

              return;
            default:
              signUpForm.setError(field as keyof SignUpFormProps, {
                message: reason,
              });

              return;
          }
        });
      }

      if (isNotFound(error) && error.detail === 'verification') {
        signUpForm.setError('phoneNumber', {
          message: '휴대전화번호 인증 요청 후 다시 시도해주세요.',
        });

        return;
      }

      if (isForbidden(error) && error.detail.field === 'verificationCode') {
        if (error.detail.reason === 'INVALID') {
          signUpForm.setError('verificationCode', {
            message: '인증번호가 일치하지 않습니다. 다시 한 번 확인해주세요.',
          });

          return;
        } else if (error.detail.reason === 'TIMEOUT') {
          signUpForm.setError('verificationCode', {
            message: '인증 시간이 초과되었습니다. 다시 한 번 요청해주세요.',
          });

          return;
        }

        return;
      }
    }
  };

  const onAuthDuplicateIdentifierCheckButtonClick = async () => {
    const identifier = signUpForm.getValues('identifier');

    if (!identifier) {
      signUpForm.setError('identifier', { message: '아이디를 입력해주세요.' });

      return;
    }

    signUpForm.clearErrors('identifier');

    setIsIdentifierUnique(undefined);

    try {
      const { isDuplicate } = await authDuplicateIdentifierCheckMutation.mutateAsync({
        identifier,
      });

      if (isDuplicate) {
        signUpForm.setError('identifier', {
          message: '이미 사용중인 아이디입니다. 다른 아이디를 입력해주세요.',
        });

        return;
      }

      setIsIdentifierUnique(!isDuplicate);
    } catch (error) {
      if (isValidationFailed(error)) {
        signUpForm.setError('identifier', {
          message: VALIDATION.identifier?.pattern?.message,
        });
      }
    }
  };

  const onBirthInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const birth = event.target.value;

    if (SPACE_REGEX.test(birth)) {
      signUpForm.setValue('birth', birth.replace(SPACE_REGEX, ''));

      return;
    }

    if (EXCEPT_NUMBER_REGEX.test(birth)) {
      signUpForm.setValue('birth', birth.replace(EXCEPT_NUMBER_REGEX, ''));

      return;
    }

    if (birth.length > 8) signUpForm.setValue('birth', birth.slice(0, 8));
  };

  const onPetBirthInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const petBirth = event.target.value;

    if (SPACE_REGEX.test(petBirth)) {
      signUpForm.setValue('petBirth', petBirth.replace(SPACE_REGEX, ''));

      return;
    }

    if (EXCEPT_NUMBER_REGEX.test(petBirth)) {
      signUpForm.setValue('petBirth', petBirth.replace(EXCEPT_NUMBER_REGEX, ''));

      return;
    }

    if (petBirth.length > 8) signUpForm.setValue('petBirth', petBirth.slice(0, 8));
  };

  const onPhoneNumberInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = event.target.value;

    if (SPACE_REGEX.test(phoneNumber)) {
      signUpForm.setValue('phoneNumber', phoneNumber.replace(SPACE_REGEX, ''));

      return;
    }

    if (EXCEPT_NUMBER_REGEX.test(phoneNumber)) {
      signUpForm.setValue('phoneNumber', phoneNumber.replace(EXCEPT_NUMBER_REGEX, ''));

      return;
    }

    if (phoneNumber.length > 11) signUpForm.setValue('phoneNumber', phoneNumber.slice(0, 11));
  };

  const clearPetFormErrors = () => {
    signUpForm.clearErrors('petName');
    signUpForm.clearErrors('petBirth');
    signUpForm.clearErrors('petType');
    signUpForm.clearErrors('petTypeText');
    signUpForm.clearErrors('petContent');
  };

  const onAddAnimalGroupIconClick = () => {
    if (
      !petName ||
      !petBirth ||
      !petType ||
      ((petType === PET_TYPE.mixed || petType === PET_TYPE.etc) && !petTypeText)
    ) {
      if (!petName) signUpForm.setError('petName', { message: VALIDATION.petName?.required });

      if (!petBirth) signUpForm.setError('petBirth', { message: VALIDATION.petBirth?.required });

      if (!petType || ((petType === PET_TYPE.mixed || petType === PET_TYPE.etc) && !petTypeText))
        signUpForm.setError('petType', { message: VALIDATION.petType?.required });

      return;
    }

    const fulledPets = pets.filter(pet => pet !== null);

    if (fulledPets.length === PET_MAX_COUNT)
      return enqueueSnackbar('반려동물 정보는 최대 10마리까지 등록 가능합니다.', {
        variant: 'error',
      });

    clearPetFormErrors();

    setPets(prevPets => {
      const emptyIndex = prevPets.findIndex(pet => pet === null);

      if (emptyIndex === -1) return prevPets;

      const newPets = [...prevPets];

      newPets[emptyIndex] = {
        name: petName,
        birth: petBirth,
        type: petType as PetType,
        typeText: petTypeText,
        content: signUpForm.getValues('petContent'),
      };

      return [...newPets];
    });

    signUpForm.setValue('petName', '');
    signUpForm.setValue('petBirth', '');
    signUpForm.setValue('petType', PET_TYPE.goldenRetriever);
    signUpForm.setValue('petTypeText', '');
    signUpForm.setValue('petContent', '');
  };

  const onNewAnimalIconClick = (pet: Pet | null, petIndex: number) => {
    if (!pet) return;

    clearPetFormErrors();

    setPets(prevPets => {
      const newPets = [...prevPets];

      newPets[petIndex] = null;

      return newPets;
    });

    signUpForm.setValue('petName', pet.name);
    signUpForm.setValue('petBirth', pet.birth);
    signUpForm.setValue('petType', pet.type);
    signUpForm.setValue('petTypeText', pet.typeText);
    signUpForm.setValue('petContent', pet.content);
  };

  const onDeleteAnimalIconClick = (pet: Pet, petIndex: number) => {
    if (!pet) return;

    setPets(prevPets => {
      const newPets = [...prevPets];

      newPets[petIndex] = null;

      return newPets;
    });

    signUpForm.setValue('petName', '');
    signUpForm.setValue('petBirth', '');
    signUpForm.setValue('petType', PET_TYPE.goldenRetriever);
    signUpForm.setValue('petTypeText', '');
    signUpForm.setValue('petContent', '');
  };

  const onGenderRadioClick = (gender: Gender) => {
    signUpForm.setValue('gender', gender);
  };

  const onVerificationRequestButtonClick = async () => {
    const phoneNumber = signUpForm.getValues('phoneNumber');

    setIsVerificationCodeSend(false);

    if (!phoneNumber) {
      signUpForm.setError('phoneNumber', { message: VALIDATION.phoneNumber?.required });

      return;
    }

    if (!PHONE_NUMBER_REGEX.test(phoneNumber)) {
      signUpForm.setError('phoneNumber', { message: VALIDATION.phoneNumber?.pattern?.message });

      return;
    }

    signUpForm.clearErrors('phoneNumber');

    try {
      await authVerificationCodeSendMutation.mutateAsync({
        phoneNumber: signUpForm.getValues('phoneNumber'),
      });

      reset();
      run();

      setIsVerificationCodeSend(true);
    } catch (error) {
      if (isTooManyRequests(error)) {
        if (isTooManyRequestWithTime(error.detail)) {
          const retryAfterDate = new Date(error.detail.retryAfter);
          const retryAfterSeconds = retryAfterDate.getSeconds();

          signUpForm.setError('phoneNumber', {
            message: `인증번호 요청은 1분에 한 번만 가능합니다. 남은 시간은 ${retryAfterSeconds}초 후 입니다.`,
          });
        } else if (isTooManyRequestWithCount(error.detail)) {
          const count = error.detail.count;

          signUpForm.setError('phoneNumber', {
            message: `인증번호 요청 횟수가 초과되었습니다. 일 ${count}회까지만 요청이 가능합니다.`,
          });
        }
      }
    }
  };

  const onAddressSearchButtonClick = () => {
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
        signUpForm.setValue('postalCode', data.zonecode);
        signUpForm.setValue('address', data.address);

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

  const onAgreeToAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isAgreeToAllChecked = event.target.checked;

    signUpForm.setValue('termOfUseAndPrivacyPolicy', isAgreeToAllChecked);
    signUpForm.setValue('personalInformationCollectionAndUsageAgreement', isAgreeToAllChecked);
    signUpForm.setValue('over14YearsOld', isAgreeToAllChecked);
    signUpForm.setValue('marketingAgreement', isAgreeToAllChecked);
  };

  useEffect(() => {
    if (petType !== PET_TYPE.mixed && petType !== PET_TYPE.etc)
      signUpForm.setValue('petTypeText', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petType]);

  useEffect(() => {
    if (
      termOfUseAndPrivacyPolicy &&
      personalInformationCollectionAndUsageAgreement &&
      over14YearsOld &&
      marketingAgreement
    ) {
      signUpForm.setValue('agreeToAll', true);
    } else {
      signUpForm.setValue('agreeToAll', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    termOfUseAndPrivacyPolicy,
    personalInformationCollectionAndUsageAgreement,
    over14YearsOld,
    marketingAgreement,
  ]);

  return (
    <S.Container>
      <FormContainer formContext={signUpForm} onSuccess={onSignUpFormSuccess}>
        <S.FormContainer>
          <FormItem
            label='아이디 *'
            formHandleButtonProps={{
              text: '중복확인',
              disabled: authDuplicateIdentifierCheckMutation.isPending,
              onClick: onAuthDuplicateIdentifierCheckButtonClick,
            }}>
            <TextFieldElement
              name='identifier'
              placeholder='공백 제외, 6~20자 영문 소문자, 숫자 및 언더바(_)'
              autoComplete='username'
              helperText={isIdentifierUnique ? '사용 가능한 아이디입니다.' : ''}
              validation={VALIDATION.identifier}
            />
          </FormItem>
          <FormItem label='비밀번호 *'>
            <PasswordElement
              name='password'
              placeholder='공백 제외, 8~30자 영문, 숫자 필수 입력(특수 문자 선택 입력)'
              autoComplete='new-password'
              validation={VALIDATION.password}
            />
          </FormItem>
          <FormItem label='비밀번호 확인 *'>
            <PasswordRepeatElement
              name='passwordAccept'
              passwordFieldName='password'
              placeholder='비밀번호와 동일하게 입력해주세요.'
              autoComplete='new-password'
              validation={VALIDATION.passwordAccept}
              customInvalidFieldMessage='비밀번호가 일치하지 않습니다.'
            />
          </FormItem>
          <FormItem label='이메일 주소'>
            <TextFieldElement
              name='email'
              placeholder='이메일 주소를 입력해주세요.'
              validation={VALIDATION.email}
            />
          </FormItem>
          <S.SubtitleContainer>
            <Typography fontSize='1.25rem' fontWeight='bold'>
              우리집 반려동물 정보
            </Typography>
          </S.SubtitleContainer>
          <S.Divider style={{ marginBottom: '1rem' }} />
          <S.AddAnimalGroupIconContainer className='invisible-scroll'>
            {pets.map((pet, petIndex) => (
              <S.NewAnimalIconContainer
                key={`new-animal-icon-container-${petIndex}`}
                hasPet={!!pet}>
                <S.NewAnimalIconWrapper
                  className='clickable'
                  hasPet={!!pet}
                  onClick={() => onNewAnimalIconClick(pet, petIndex)}>
                  <SmartImage alt={`new-animal-icon-${petIndex}`} src={newAnimalIcon} />
                  {pet && (
                    <S.NewAnimalNameContainer>
                      <Typography fontSize='0.8125rem' align='center'>
                        {pet.name}
                      </Typography>
                    </S.NewAnimalNameContainer>
                  )}
                </S.NewAnimalIconWrapper>
                {pet && (
                  <S.DeleteAnimialIconContainer
                    onClick={() => onDeleteAnimalIconClick(pet, petIndex)}>
                    <S.DeleteAnimalIconWrapper>
                      <SmartImage alt={`delete-animal-icon-${petIndex}`} src={deleteAnimalIcon} />
                    </S.DeleteAnimalIconWrapper>
                  </S.DeleteAnimialIconContainer>
                )}
              </S.NewAnimalIconContainer>
            ))}
            <S.AddAnimalGroupIconWrapper className='clickable' onClick={onAddAnimalGroupIconClick}>
              <SmartImage alt='add-animal-group-icon' src={addAnimalGroupIcon} />
            </S.AddAnimalGroupIconWrapper>
          </S.AddAnimalGroupIconContainer>
          <FormItem label='반려동물 이름 *'>
            <TextFieldElement
              name='petName'
              placeholder='1~20자의 한글, 영문만 입력 가능'
              validation={VALIDATION.petName}
            />
          </FormItem>
          <FormItem label='반려동물 생년월일 *'>
            <TextFieldElement
              name='petBirth'
              placeholder='예) 20200811 (숫자 8자리 입력, 예상일자 가능)'
              validation={VALIDATION.petBirth}
              onChange={onPetBirthInputChange}
            />
          </FormItem>
          <FormItem label='반려동물 종 *'>
            <S.PetTypeSelectContainer>
              <RHFMSelectElement
                name='petType'
                validation={VALIDATION.petType}
                labelKey='label'
                valueKey='value'
                options={Object.keys(PET_NAME).map((petNameKey, petNameKeyIndex) => ({
                  id: `pet-name_${petNameKeyIndex}`,
                  label: PET_NAME[petNameKey as PetType],
                  value: petNameKey,
                }))}
              />
              <S.PetTypeTextInputContainer>
                <TextFieldElement
                  name='petTypeText'
                  placeholder='믹스견, 기타 선택 직접 입력'
                  focused={petType === PET_TYPE.mixed || petType === PET_TYPE.etc}
                  disabled={petType !== PET_TYPE.mixed && petType !== PET_TYPE.etc}
                />
              </S.PetTypeTextInputContainer>
            </S.PetTypeSelectContainer>
          </FormItem>
          <FormItem label='[선택] 특징 및 성격'>
            <TextareaAutosizeElement
              name='petContent'
              placeholder='예) 우리 콜라는 검은색푸틀이고 하얀털이 조금 섞여있는 특이한 푸들이에요. 아주 활발하며 사람을 무척 좋아해요. 알러지는 따로 없어요.'
              rows={5}
            />
          </FormItem>
          <S.SubtitleContainer>
            <Typography fontSize='1.25rem' fontWeight='bold'>
              보호자 정보
            </Typography>
          </S.SubtitleContainer>
          <S.Divider style={{ marginBottom: '1rem' }} />
          <FormItem label='이름 *'>
            <TextFieldElement
              name='name'
              placeholder='공백 제외, 한글, 영문 입력(특수문자 불가)'
              validation={VALIDATION.name}
            />
          </FormItem>
          <FormItem label='생년월일 *'>
            <TextFieldElement
              name='birth'
              placeholder='예) 20200811 (숫자 8자리 입력, 예상일자 가능)'
              validation={VALIDATION.birth}
              onChange={onBirthInputChange}
            />
          </FormItem>
          <FormItem
            label='주소 *'
            formHandleButtonProps={{ text: '주소검색', onClick: onAddressSearchButtonClick }}>
            <TextFieldElement
              name='address'
              placeholder='영역을 클릭해 검색해주세요 :)'
              validation={VALIDATION.address}
              onFocus={onAddressSearchButtonClick}
            />
          </FormItem>
          <S.AddressDetailInputContainer>
            <TextFieldElement
              name='addressDetail'
              placeholder='상세주소입력(직접입력)'
              validation={VALIDATION.addressDetail}
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
          <FormItem
            label='휴대전화번호 *'
            formHandleButtonProps={{
              text: '인증 요청',
              disabled: authVerificationCodeSendMutation.isPending,
              onClick: onVerificationRequestButtonClick,
            }}>
            <TextFieldElement
              name='phoneNumber'
              placeholder='하이폰(-)을 제외한 문자열입니다. 예) 01012345678'
              validation={VALIDATION.phoneNumber}
              onChange={onPhoneNumberInputChange}
              helperText={isVerificationCodeSend ? '인증번호가 발송되었습니다.' : ''}
            />
          </FormItem>
          <S.VerificationCodeInputContainer>
            <TextFieldElement
              name='verificationCode'
              placeholder='전송된 인증번호를 입력해주세요.'
              validation={VALIDATION.verificationCode}
            />
            <S.VerificationTimerContainer>
              <Typography variant='h5'>{leftTimeString}</Typography>
            </S.VerificationTimerContainer>
          </S.VerificationCodeInputContainer>
          <S.AgreementCheckboxContainer>
            <CustomCheckboxElement name='agreeToAll' onChange={onAgreeToAllChange}>
              <Typography fontSize='1rem' fontWeight='bold'>
                전체 동의하기
              </Typography>
            </CustomCheckboxElement>
            <CustomCheckboxElement name='termOfUseAndPrivacyPolicy'>
              <Typography fontSize='0.875rem'>
                (필수) <S.AgreementLink href=''>이용약관</S.AgreementLink>,{' '}
                <S.AgreementLink href=''>개인정보처리방침</S.AgreementLink>
              </Typography>
            </CustomCheckboxElement>
            <CustomCheckboxElement name='personalInformationCollectionAndUsageAgreement'>
              <Typography fontSize='0.875rem'>
                (필수) <S.AgreementLink href=''>개인정보 수집 및 이용</S.AgreementLink> 동의
              </Typography>
            </CustomCheckboxElement>
            <CustomCheckboxElement name='over14YearsOld'>
              <Typography fontSize='0.875rem'>(필수) 만 14세 이상입니다.</Typography>
            </CustomCheckboxElement>
            <CustomCheckboxElement name='marketingAgreement'>
              <Typography fontSize='0.875rem'>
                (선택) <S.AgreementLink href=''>마케팅 정보 수신 동의</S.AgreementLink>
              </Typography>
            </CustomCheckboxElement>
          </S.AgreementCheckboxContainer>
          <S.SignUpButton type='submit'>
            <Typography fontSize='1.25rem' fontWeight='bold'>
              가입하기
            </Typography>
          </S.SignUpButton>
        </S.FormContainer>
      </FormContainer>
      <S.DaumAddressSearchOverlay
        ref={daumAddressSearchOverlayRef}
        onClick={onDaumAddressSearchOverlayClick}>
        <S.DaumAddressSearchWrapper ref={daumAddressSearchWrapperRef}>
          <S.DaumAddressSearchContainer ref={daumAddressSearchContainerRef} />
        </S.DaumAddressSearchWrapper>
      </S.DaumAddressSearchOverlay>
    </S.Container>
  );
};
