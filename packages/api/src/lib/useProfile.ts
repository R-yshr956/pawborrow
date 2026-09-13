import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from './profile';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getMyProfile,
  });
}