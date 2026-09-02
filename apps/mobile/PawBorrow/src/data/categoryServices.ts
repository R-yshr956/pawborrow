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
  // TODO: add entries here for Vaccinations, Operations, Behaviorals,
  // Dentistry — same shape, once you have their sub-service photos/names
];