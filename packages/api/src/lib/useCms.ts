import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createCmsContent,
  deleteCmsContent,
  getCmsContent,
  getPublishedCmsContent,
  updateCmsContent,
  type CmsContentInput,
} from "./cms";

export function useCmsContent() {
  return useQuery({
    queryKey: ["cms-content"],
    queryFn: getCmsContent,
  });
}

export function usePublishedCmsContent(contentKey: string) {
  return useQuery({
    queryKey: ["cms-content", "published", contentKey],
    queryFn: () => getPublishedCmsContent(contentKey),
    enabled: Boolean(contentKey),
  });
}

export function useCreateCmsContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CmsContentInput) => createCmsContent(input),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["cms-content"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["audit-logs"],
        }),
      ]);
    },
  });
}

export function useUpdateCmsContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contentId,
      input,
    }: {
      contentId: number;
      input: CmsContentInput;
    }) => updateCmsContent(contentId, input),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["cms-content"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["audit-logs"],
        }),
      ]);
    },
  });
}

export function useDeleteCmsContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contentId: number) => deleteCmsContent(contentId),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["cms-content"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["audit-logs"],
        }),
      ]);
    },
  });
}
