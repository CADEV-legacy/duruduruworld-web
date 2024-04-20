'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FormContainer,
  TextFieldElement,
  TextareaAutosizeElement,
  useForm,
} from 'react-hook-form-mui';
import Slider, { Settings } from 'react-slick';

import { Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import * as S from './PetInformationForm.styles';

import { PetSchema } from '@/(server)/model';
import { PetType, PET_TYPE } from '@/(server)/union';
import { NAME_REGEX, BIRTH_REGEX } from '@/(server)/util';

import { FormItem, SmartImage } from '@/(client)/component';
import { UserMeRequestReturn } from '@/(client)/request';
import { useAuthMutation, useUserMe, userQueryKeys } from '@/(client)/service';
import { useAuthStore } from '@/(client)/store';

import RHFMSelectElement from '@/(client)/component/RHFMSelectElement';

import { PET_NAME } from '@/constant';

import addAnimalGroupIcon from '#/icons/addAnimalGroup.svg';
import leftArrowIcon from '#/icons/leftArrow.svg';
import rightArrowIcon from '#/icons/rightArrow.svg';
import myPagePet from '#/image/myPagePet.png';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

type Pet = Omit<PetSchema, '_id' | 'createdAt' | 'updatedAt'>;

type PetInformationFormProps = Pet;

const PET_MAX_COUNT = 10;
const EXCEPT_NUMBER_REGEX = /[^0-9]/g;
const SPACE_REGEX = /\s/g;

const SLICK_SETTINGS: Settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
};

const VALIDATION: {
  [key in keyof PetInformationFormProps]?: {
    required?: string;
    pattern?: { value: RegExp; message: string };
  };
} = {
  name: {
    required: '반려동물 이름을 입력해주세요.',
    pattern: {
      value: NAME_REGEX,
      message: '1-20자의 한글, 영문만 입력 가능합니다.',
    },
  },
  birth: {
    required: '반려동물 생년월일을 입력해주세요.',
    pattern: {
      value: BIRTH_REGEX,
      message: '숫자 8자리로 YYYYMMDD 형식으로만 입력 가능합니다.',
    },
  },
  type: {
    required: '반려동물 종을 선택해주세요.',
  },
};

export const PetInformationForm = () => {
  const petInformationForm = useForm<PetInformationFormProps>();
  const { type, birth } = petInformationForm.watch();
  const [isEditMode, setIsEditMode] = useState(false);
  const [petIndex, setPetIndex] = useState(0);
  const slickRef = useRef<Slider | null>(null);
  const { accessToken } = useAuthStore();
  const { authUpdatePetMutation } = useAuthMutation();
  const { data } = useUserMe(accessToken);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const pets = useMemo(() => data?.pets, [data?.pets]);

  const isEditable = useMemo(
    () => isEditMode || (!!pets && petIndex === pets.length),
    [isEditMode, petIndex, pets]
  );

  const onPetInformationFormSuccess = async ({
    name,
    birth,
    type,
    typeText,
    content,
  }: PetInformationFormProps) => {
    if (!pets) return;

    const totalPets =
      petIndex === pets.length ? [...pets, { name, birth, type, typeText, content }] : pets;

    try {
      await authUpdatePetMutation.mutateAsync(
        { pets: totalPets },
        {
          onSuccess: () => {
            queryClient.setQueryData<UserMeRequestReturn>(userQueryKeys.me(accessToken), prev => {
              if (!prev) return;

              return {
                ...prev,
                pets: totalPets,
              };
            });
          },
        }
      );

      enqueueSnackbar('반려동물 정보가 수정되었습니다.', { variant: 'success' });
    } catch (error) {
      console.info(error);
    }
  };

  const onPetBirthInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const petBirth = event.target.value;

    if (SPACE_REGEX.test(petBirth)) {
      petInformationForm.setValue('birth', birth.replace(SPACE_REGEX, ''));

      return;
    }

    if (EXCEPT_NUMBER_REGEX.test(petBirth)) {
      petInformationForm.setValue('birth', birth.replace(EXCEPT_NUMBER_REGEX, ''));

      return;
    }

    if (petBirth.length > 8) petInformationForm.setValue('birth', petBirth.slice(0, 8));
  };

  const slickPreviousEvent = useCallback(() => {
    slickRef.current?.slickPrev();
  }, []);

  const slickNextEvent = useCallback(() => {
    slickRef.current?.slickNext();
  }, []);

  const onSliderBeforeChange = (_oldIndex: number, newIndex: number) => {
    if (!pets) return;

    setPetIndex(newIndex);
  };

  const onAddButtonClick = () => {
    const { name, birth, type, typeText, content } = petInformationForm.getValues();

    if (
      !name ||
      !birth ||
      !type ||
      ((type === PET_TYPE.mixed || type === PET_TYPE.etc) && !typeText)
    ) {
      if (!name) petInformationForm.setError('name', { message: VALIDATION.name?.required });

      if (!birth) petInformationForm.setError('birth', { message: VALIDATION.birth?.required });

      if (!type || ((type === PET_TYPE.mixed || type === PET_TYPE.etc) && !typeText))
        petInformationForm.setError('type', { message: VALIDATION.type?.required });

      return;
    }

    queryClient.setQueryData<UserMeRequestReturn>(userQueryKeys.me(accessToken), prev => {
      if (!prev) return;

      return {
        ...prev,
        pets: [...prev.pets, { name, birth, type, typeText, content }],
      };
    });
    slickNextEvent();
  };

  const onCancelButtonClick = () => {
    if (!pets) return;

    petInformationForm.reset(pets[petIndex]);
  };

  const onDeleteButtonClick = () => {
    if (!pets) return;

    queryClient.setQueryData<UserMeRequestReturn>(userQueryKeys.me(accessToken), prev => {
      if (!prev) return;

      console.info(prev.pets);
      console.info(petIndex);

      return {
        ...prev,
        pets: prev.pets.filter((_, prevPetIndex) => prevPetIndex !== petIndex),
      };
    });
  };

  useEffect(() => {
    if (pets) {
      petInformationForm.reset(pets[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pets]);

  useEffect(() => {
    console.info('Current data is ', pets);
  }, [pets]);

  useEffect(() => {
    console.info(petIndex);
  }, [petIndex]);

  useEffect(() => {
    if (!pets) return;

    if (petIndex >= pets.length) {
      petInformationForm.reset({
        name: '',
        birth: '',
        type: PET_TYPE.goldenRetriever as PetType,
        typeText: '',
        content: '',
      });

      return;
    }

    const pet = pets[petIndex];

    petInformationForm.reset(pet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pets, petIndex]);

  return (
    <>
      <S.PetInformationTitleContainer>
        <S.PetSliderContainer>
          {pets ? (
            <Slider ref={slickRef} {...SLICK_SETTINGS} beforeChange={onSliderBeforeChange}>
              {pets.map((pet, petIndex) => (
                <S.ImageContainer key={`mypage-pet-image_${petIndex}`}>
                  <S.ImageAlignContainer>
                    <S.PetImageWrapper>
                      <SmartImage alt='mypage-pet-image' src={myPagePet} />
                    </S.PetImageWrapper>
                    <S.ImageTextContainer>{pet.name}</S.ImageTextContainer>
                  </S.ImageAlignContainer>
                </S.ImageContainer>
              ))}
              {pets.length !== PET_MAX_COUNT && (
                <S.ImageContainer>
                  <S.ImageAlignContainer key='mypage-pet-add-icon'>
                    <S.AddImageWrapper>
                      <SmartImage alt='add-animal-group-icon' src={addAnimalGroupIcon} />
                    </S.AddImageWrapper>
                  </S.ImageAlignContainer>
                </S.ImageContainer>
              )}
            </Slider>
          ) : (
            <S.PetImageContainer>
              <S.PetImageWrapper>
                <SmartImage alt='mypage-pet-image' src={myPagePet} />
              </S.PetImageWrapper>
            </S.PetImageContainer>
          )}
          <PrevArrow onClick={slickPreviousEvent} />
          <NextArrow onClick={slickNextEvent} />
        </S.PetSliderContainer>
        <Typography variant='h1' fontSize='1.5rem'>
          가족 정보
        </Typography>
      </S.PetInformationTitleContainer>
      <S.PetContentContainer>
        <FormContainer formContext={petInformationForm} onSuccess={onPetInformationFormSuccess}>
          <S.FormContainer>
            <FormItem label='반려동물 이름 *'>
              <TextFieldElement
                name='name'
                placeholder='1~20자의 한글, 영문만 입력 가능'
                validation={VALIDATION.name}
                disabled={!isEditable}
              />
            </FormItem>
            <FormItem label='반려동물 생년월일 *'>
              <TextFieldElement
                name='birth'
                placeholder='예) 20200811 (숫자 8자리 입력, 예상일자 가능)'
                validation={VALIDATION.birth}
                disabled={!isEditable}
                onChange={onPetBirthInputChange}
              />
            </FormItem>
            <FormItem label='반려동물 종 *'>
              <S.PetTypeSelectContainer>
                <RHFMSelectElement
                  name='type'
                  validation={VALIDATION.type}
                  labelKey='label'
                  valueKey='value'
                  disabled={!isEditable}
                  options={Object.keys(PET_NAME).map((petNameKey, petNameKeyIndex) => ({
                    id: `pet-name_${petNameKeyIndex}`,
                    label: PET_NAME[petNameKey as PetType],
                    value: petNameKey,
                  }))}
                />
                <S.PetTypeTextInputContainer>
                  <TextFieldElement
                    name='typeText'
                    placeholder='믹스견, 기타 선택 직접 입력'
                    focused={type === PET_TYPE.mixed || type === PET_TYPE.etc}
                    disabled={
                      !isEditable ||
                      (isEditable && type !== PET_TYPE.mixed && type !== PET_TYPE.etc)
                    }
                  />
                </S.PetTypeTextInputContainer>
              </S.PetTypeSelectContainer>
            </FormItem>
            <FormItem label='[선택] 특징 및 성격'>
              <TextareaAutosizeElement
                name='content'
                placeholder='예) 우리 콜라는 검은색푸틀이고 하얀털이 조금 섞여있는 특이한 푸들이에요. 아주 활발하며 사람을 무척 좋아해요. 알러지는 따로 없어요.'
                rows={5}
                disabled={!isEditable}
              />
            </FormItem>
            {!isEditable || !pets ? (
              <>
                <S.EditButton type='button' onClick={() => setIsEditMode(true)}>
                  정보 수정하기
                </S.EditButton>
                <S.DeleteButton type='button' onClick={onDeleteButtonClick}>
                  정보 삭제하기
                </S.DeleteButton>
              </>
            ) : (
              <>
                <S.UpdateButton type='submit' disabled={authUpdatePetMutation.isPending}>
                  수정완료
                </S.UpdateButton>
                {petIndex === pets?.length && petIndex !== PET_MAX_COUNT ? (
                  <S.AddButton type='button' onClick={onAddButtonClick}>
                    더 추가하기
                  </S.AddButton>
                ) : (
                  <S.CancelButton type='button' onClick={onCancelButtonClick}>
                    취소하기
                  </S.CancelButton>
                )}
              </>
            )}
          </S.FormContainer>
        </FormContainer>
      </S.PetContentContainer>
    </>
  );
};

interface ArrowActions {
  onClick: () => void;
}

const PrevArrow: React.FC<ArrowActions> = ({ onClick }) => (
  <S.PrevArrowIconContainer onClick={onClick} className='clickable'>
    <S.ArrowIconWrapper>
      <SmartImage alt='react-slick-left-icon' src={leftArrowIcon} />
    </S.ArrowIconWrapper>
  </S.PrevArrowIconContainer>
);

const NextArrow: React.FC<ArrowActions> = ({ onClick }) => (
  <S.NextArrowIconContainer onClick={onClick} className='clickable'>
    <S.ArrowIconWrapper>
      <SmartImage alt='react-slick-right-icon' src={rightArrowIcon} />
    </S.ArrowIconWrapper>
  </S.NextArrowIconContainer>
);
