import vaccinationsBanner from '../assets/images/utils/placeholder.png';
import vaccineCorePhoto from '../assets/images/utils/placeholder.png';
import vaccineRabiesPhoto from '../assets/images/utils/placeholder.png';
import vaccineBoosterPhoto from '../assets/images/utils/placeholder.png';
import vaccineTravelPhoto from '../assets/images/utils/placeholder.png';

import operationsBanner from '../assets/images/utils/placeholder.png';
import spayNeuterPhoto from '../assets/images/utils/placeholder.png';
import dentalSurgeryPhoto from '../assets/images/utils/placeholder.png';
import tumorRemovalPhoto from '../assets/images/utils/placeholder.png';
import orthopedicPhoto from '../assets/images/utils/placeholder.png';

import behavioralsBanner from '../assets/images/utils/placeholder.png';         // Temporary placeholder sa mga images na wala pang file
import aggressionPhoto from '../assets/images/utils/placeholder.png';           // Palitan nalang kung sakaling may actual image na
import anxietyPhoto from '../assets/images/utils/placeholder.png';
import obedienceConsultPhoto from '../assets/images/utils/placeholder.png';
import socializationPhoto from '../assets/images/utils/placeholder.png';

import dentistryBanner from '../assets/images/utils/placeholder.png';
import teethCleaningPhoto from '../assets/images/utils/placeholder.png';
import toothExtractionPhoto from '../assets/images/utils/placeholder.png';
import gumTreatmentPhoto from '../assets/images/utils/placeholder.png';
import dentalXrayPhoto from '../assets/images/utils/placeholder.png';

import groomingBanner from '../assets/images/service/grooming-banner.png';
import bathingPhoto from '../assets/images/service/bathing-drying.png';
import hairTrimPhoto from '../assets/images/service/hair-trimming.png';
import nailTrimPhoto from '../assets/images/service/nail-trimming.png';
import earCleaningPhoto from '../assets/images/service/ear-cleaning.png';
import teethBrushingPhoto from '../assets/images/service/teeth-brushing.png';
import fleaTreatmentPhoto from '../assets/images/service/flea-treatment.png';


export interface SubService {
  name: string;
  photo: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  discountBadge: string;
  discountSubtitle: string;
  discountPhoto: string;
  subServices: SubService[];
}

export const categoryServices: ServiceCategory[] = [
{
    id: 'vaccinations',
    title: 'Vaccinations',
    discountBadge: '20% OFF',
    discountSubtitle: 'On first vaccine visit',
    discountPhoto: vaccinationsBanner,
    subServices: [
      { name: 'Core Vaccines', photo: vaccineCorePhoto },
      { name: 'Rabies Vaccine', photo: vaccineRabiesPhoto },
      { name: 'Booster Shots', photo: vaccineBoosterPhoto },
      { name: 'Travel Vaccines', photo: vaccineTravelPhoto },
    ],
  },
  {
    id: 'operations',
    title: 'Operations',
    discountBadge: '15% OFF',
    discountSubtitle: 'On surgical packages',
    discountPhoto: operationsBanner,
    subServices: [
      { name: 'Spay & Neuter', photo: spayNeuterPhoto },
      { name: 'Dental Surgery', photo: dentalSurgeryPhoto },
      { name: 'Tumor Removal', photo: tumorRemovalPhoto },
      { name: 'Orthopedic Surgery', photo: orthopedicPhoto },
    ],
  },
  {
    id: 'behaviorals',
    title: 'Behaviorals',
    discountBadge: '10% OFF',
    discountSubtitle: 'On first consultation',
    discountPhoto: behavioralsBanner,
    subServices: [
      { name: 'Aggression Therapy', photo: aggressionPhoto },
      { name: 'Anxiety Treatment', photo: anxietyPhoto },
      { name: 'Obedience Consult', photo: obedienceConsultPhoto },
      { name: 'Socialization', photo: socializationPhoto },
    ],
  },
  {
    id: 'dentistry',
    title: 'Dentistry',
    discountBadge: '25% OFF',
    discountSubtitle: 'On teeth cleaning',
    discountPhoto: dentistryBanner,
    subServices: [
      { name: 'Teeth Cleaning', photo: teethCleaningPhoto },
      { name: 'Tooth Extraction', photo: toothExtractionPhoto },
      { name: 'Gum Treatment', photo: gumTreatmentPhoto },
      { name: 'Dental X-Ray', photo: dentalXrayPhoto },
    ],
  },

  {
    id: 'grooming',
    title: 'Grooming',
    discountBadge: '60% OFF',
    discountSubtitle: 'On hair & spa treatment',
    discountPhoto: groomingBanner,
    subServices: [
      { name: 'Bathing & Drying', photo: bathingPhoto },
      { name: 'Hair Trimming', photo: hairTrimPhoto },
      { name: 'Nail Trimming', photo: nailTrimPhoto },
      { name: 'Ear Cleaning', photo: earCleaningPhoto },
      { name: 'Teeth Brushing', photo: teethBrushingPhoto },
      { name: 'Flea Treatment', photo: fleaTreatmentPhoto },
    ],
  },
];