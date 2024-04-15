'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import {
  FieldErrors,
  FormContainer,
  PasswordElement,
  RadioButtonGroup,
  TextFieldElement,
  TextareaAutosizeElement,
  useForm,
} from 'react-hook-form-mui';

import { Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import * as S from './SignUpForm.styles';

import { GENDER, Gender } from '@/(server)/union';

import { CustomCheckboxElement, FormItem, SmartImage } from '@/(client)/component';
import { useTimerHook } from '@/(client)/hook';
import { AuthSignUpRequestBody } from '@/(client)/request';
import { useAuthMutation } from '@/(client)/service';

import { isBadRequest, isForbidden, isTooManyRequests, isValidationFailed } from '@/(error)';

import { COLOR, ROUTE_URL } from '@/constant';

import addAnimalGroupIcon from '#/icons/addAnimalGroup.svg';

type SignUpFormProps = Omit<AuthSignUpRequestBody, 'image'> & {
  identifier: string;
  passwordAccept: string;
  agreeToAll: boolean;
  termOfUseAndPrivacyPolicy: boolean;
  personalInformationCollectionAndUsageAgreement: boolean;
  over14YearsOld: boolean;
  consentToReceiveMarketingInformation: boolean;
};

const SIGN_UP_FORM_DEFAULT_VALUES: SignUpFormProps = {
  identifier: '',
  email: '',
  password: '',
  passwordAccept: '',
  name: '',
  phoneNumber: '',
  age: '',
  gender: GENDER.male,
  postalCode: '',
  address: '',
  addressDetail: '',
  verificationCode: '',
  agreeToAll: false,
  termOfUseAndPrivacyPolicy: false,
  personalInformationCollectionAndUsageAgreement: false,
  over14YearsOld: false,
  consentToReceiveMarketingInformation: false,
};

export const SignUpForm: React.FC = () => {
  const router = useRouter();
  const signUpForm = useForm<SignUpFormProps>({ defaultValues: SIGN_UP_FORM_DEFAULT_VALUES });
  const { enqueueSnackbar } = useSnackbar();
  const daumAddressSearchOverlayRef = useRef<HTMLDivElement>(null);
  const daumAddressSearchWrapperRef = useRef<HTMLDivElement>(null);
  const daumAddressSearchContainerRef = useRef<HTMLDivElement>(null);
  const [gender, setGender] = useState<Gender>(GENDER.male);
  const { run, reset, timerStatus, leftTime } = useTimerHook({ time: { minutes: 5 } });
  const { authSignUpMutation, authDuplicateIDCheckMutation, authVerificationCodeSendMutation } =
    useAuthMutation();

  const leftTimeString = useMemo(() => {
    if (!timerStatus || timerStatus === 'initialized') return;

    const minutes = leftTime.minutes;
    const seconds = leftTime.seconds;

    return `0${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }, [timerStatus, leftTime]);

  const onSignUpFormSuccess = async ({
    email,
    password,
    passwordAccept,
    name,
    phoneNumber,
    age,
    gender,
    postalCode,
    address,
    addressDetail,
    verificationCode,
  }: SignUpFormProps) => {
    try {
      if (password !== passwordAccept) {
        signUpForm.setError('passwordAccept', { message: '비밀번호가 일치하지 않습니다.' });

        return;
      }

      const data = new FormData();

      data.append('email', email);
      data.append('password', password);
      data.append('name', name);
      data.append('phoneNumber', phoneNumber);
      data.append('age', age);
      data.append('gender', gender);
      data.append('postalCode', postalCode);
      data.append('address', address);
      addressDetail && data.append('addressDetail', addressDetail);
      data.append('verificationCode', verificationCode);

      await authSignUpMutation({ data });

      router.push(ROUTE_URL.auth.signIn);
    } catch (error) {
      if (isBadRequest(error)) {
        error.detail.forEach(({ field }) => {
          return signUpForm.setError(field as keyof SignUpFormProps, {
            message: '필수 입력 사항입니다.',
          });
        });
      }

      if (isValidationFailed(error)) {
        error.detail.forEach(({ field, reason }) => {
          switch (reason) {
            case 'REGEX_NOT_MATCHED':
              return signUpForm.setError(field as keyof SignUpFormProps, {
                message: '형식이 맞지 않습니다.',
              });
            default:
              return signUpForm.setError(field as keyof SignUpFormProps, {
                message: reason,
              });
          }
        });
      }

      if (
        isForbidden(error) &&
        error.detail.field === 'verification' &&
        error.detail.reason === 'TIMEOUT'
      ) {
        enqueueSnackbar('인증 시간이 만료되었습니다. 다시 시도해주세요.', { variant: 'error' });
      }
    }
  };

  const onDuplicateCheckButtonClick = async () => {
    const email = signUpForm.getValues('email');

    if (!email) {
      signUpForm.setError('email', { message: '중복확인 전에 입력해주세요' });

      return;
    }

    signUpForm.clearErrors('email');

    const { isDuplicate } = await authDuplicateIDCheckMutation({ email });

    if (isDuplicate) {
      signUpForm.setError('email', { message: '중복된 이메일입니다.' });

      return;
    }

    enqueueSnackbar('사용 가능한 이메일입니다.');
  };

  const onVerificationRequestButtonClick = async () => {
    const phoneNumber = signUpForm.getValues('phoneNumber');

    if (!phoneNumber) {
      signUpForm.setError('phoneNumber', { message: '인증 요청 전에 핸드폰 번호는 필수입니다.' });

      return;
    }

    signUpForm.clearErrors('phoneNumber');

    try {
      await authVerificationCodeSendMutation({ phoneNumber: signUpForm.getValues('phoneNumber') });

      reset();
      run();

      enqueueSnackbar('인증번호가 발송되었습니다.');
    } catch (error) {
      if (isTooManyRequests(error)) {
        const retryAfterDate = new Date(error.detail.retryAfter);
        const retryAfterMinutes = retryAfterDate.getMinutes();
        const retryAfterSeconds = retryAfterDate.getSeconds();

        enqueueSnackbar(
          `인증번호 요청은 5분에 한 번만 가능합니다. 요청 가능 시간은 ${retryAfterMinutes}분 ${retryAfterSeconds}초 후 입니다.`,
          { variant: 'error' }
        );
      }
    }
  };

  const onSignUpFormError = async (field: FieldErrors<SignUpFormProps>) => {
    console.error('Sign Up Form Error', field);
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
        bgColor: COLOR.black,
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
    setGender(gender);
    signUpForm.setValue('gender', gender);
  };

  const onAgreeToAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isAgreeToAllChecked = event.target.checked;

    signUpForm.setValue('termOfUseAndPrivacyPolicy', isAgreeToAllChecked);
    signUpForm.setValue('personalInformationCollectionAndUsageAgreement', isAgreeToAllChecked);
    signUpForm.setValue('over14YearsOld', isAgreeToAllChecked);
    signUpForm.setValue('consentToReceiveMarketingInformation', isAgreeToAllChecked);
  };

  return (
    <S.Container>
      <S.TitleContainer>
        <Typography variant='h1' fontSize='2rem'>
          회원가입
        </Typography>
        <Typography variant='h5' fontWeight='300'>
          제가 당신을 기억할 수 있도록 도와주실래요?
        </Typography>
      </S.TitleContainer>
      <S.Divider />
      <Typography variant='h5'>*는 필수 입력 정보입니다</Typography>
      <S.FormContainer>
        <FormContainer
          formContext={signUpForm}
          onSuccess={onSignUpFormSuccess}
          onError={onSignUpFormError}>
          <FormItem
            label='아이디 *'
            formHandleButtonProps={{ text: '중복확인', onClick: onDuplicateCheckButtonClick }}>
            <TextFieldElement
              name='identifier'
              placeholder='공백 제외, 6~20자 영문 소문자 필수 입력 (특수문자 입력 불가)'
              required
            />
          </FormItem>
          <FormItem label='비밀번호 *'>
            <PasswordElement
              name='password'
              placeholder='공백 제외, 8~30자 영문, 숫자 필수 입력(특수 문자 선택 입력)'
              required
            />
          </FormItem>
          <FormItem label='비밀번호 확인 *'>
            <PasswordElement
              name='passwordAccept'
              placeholder='비밀번호와 동일하게 입력해주세요.'
              required
            />
          </FormItem>
          <FormItem label='이메일 주소'>
            <TextFieldElement name='email' placeholder='이메일 주소를 입력해주세요.' />
          </FormItem>
          <S.SubtitleContainer>
            <Typography fontSize='1.25rem' fontWeight='bold'>
              우리집 반려동물 정보
            </Typography>
          </S.SubtitleContainer>
          <S.Divider style={{ marginBottom: '1rem' }} />
          <FormItem label='반려동물 이름 *'>
            <TextFieldElement
              name='name'
              placeholder='공백 제외, 한글, 영문 대/소문자 입력'
              required
            />
          </FormItem>
          <FormItem label='반려동물 생년월일(예상일자 가능) *'>
            <TextFieldElement name='name' placeholder='예) 20200811 (숫자만 입력 가능)' required />
          </FormItem>
          <FormItem label='반려동물 종'>
            <TextFieldElement name='name' placeholder='예) 20200811 (숫자만 입력 가능)' required />
          </FormItem>
          <FormItem label='특징 및 성격'>
            <TextareaAutosizeElement
              name='content'
              placeholder='예) 우리 콜라는 검은색푸틀이고 하얀털이 조금 섞여있는 특이한 푸들이에요. 아주 활발하며 사람을 무척 좋아해요.'
              rows={5}
            />
          </FormItem>
          <S.AddAnimalGroupIconContainer>
            <S.AddAnimalGroupIconWrapper className='clickable'>
              <SmartImage alt='add-animal-group-icon' src={addAnimalGroupIcon} />
            </S.AddAnimalGroupIconWrapper>
            <Typography fontSize='0.625rem' color={COLOR.inputBorder}>
              가족 추가하기
            </Typography>
          </S.AddAnimalGroupIconContainer>
          <S.SubtitleContainer>
            <Typography fontSize='1.25rem' fontWeight='bold'>
              받는 사람 정보
            </Typography>
          </S.SubtitleContainer>
          <S.Divider style={{ marginBottom: '1rem' }} />
          <FormItem label='이름 *'>
            <TextFieldElement
              name='name'
              placeholder='공백 제외, 한글, 영문 입력(특수문자 불가)'
              required
            />
          </FormItem>
          <FormItem
            label='주소 *'
            formHandleButtonProps={{ text: '주소검색', onClick: onAddressSearchButtonClick }}>
            <TextFieldElement
              name='address'
              placeholder='우측 주소검색 버튼을 클릭해주세요 :)'
              disabled
              required
            />
          </FormItem>
          <S.AddressDetailInputContainer>
            <TextFieldElement
              name='addressDetail'
              placeholder='상세주소를 입력해주세요.'
              required
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
            label='휴대폰번호 *'
            formHandleButtonProps={{
              text: '인증 요청',
              onClick: onVerificationRequestButtonClick,
            }}>
            <TextFieldElement
              name='phoneNumber'
              placeholder='하이폰(-)을 제외한 문자열입니다. 예) 01012345678'
              required
            />
          </FormItem>
          <S.VerificationCodeInputContainer>
            <TextFieldElement
              name='verificationCode'
              placeholder='전송된 인증번호를 입력해주세요.'
              required
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
            <CustomCheckboxElement name='consentToReceiveMarketingInformation'>
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
        </FormContainer>
      </S.FormContainer>
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
