import { supabase } from "./supabaseClient";

export type CmsContentType = "page" | "banner" | "announcement" | "faq";

export type CmsContent = {
  content_id: number;
  content_key: string;
  content_type: CmsContentType;
  title: string;
  body: string;
  image_url: string | null;
  link_url: string | null;
  is_published: boolean;
  sort_order: number;
  metadata: Record<string, unknown>;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type CmsContentInput = {
  content_key: string;
  content_type: CmsContentType;
  title: string;
  body: string;
  image_url?: string | null;
  link_url?: string | null;
  is_published: boolean;
  sort_order: number;
  metadata?: Record<string, unknown>;
};

const CMS_SELECT = `
  content_id,
  content_key,
  content_type,
  title,
  body,
  image_url,
  link_url,
  is_published,
  sort_order,
  metadata,
  created_by,
  updated_by,
  created_at,
  updated_at
`;

export async function getCmsContent(): Promise<CmsContent[]> {
  const { data, error } = await supabase
    .from("cms_content")
    .select(CMS_SELECT)
    .order("content_type")
    .order("sort_order")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as CmsContent[];
}

export async function getPublishedCmsContent(
  contentKey: string,
): Promise<CmsContent | null> {
  const { data, error } = await supabase
    .from("cms_content")
    .select(CMS_SELECT)
    .eq("content_key", contentKey)
    .eq("is_published", true)
    .maybeSingle();

  if (error) throw error;
  return data as CmsContent | null;
}

export async function getPublishedCmsContentByType(
  contentType: CmsContentType,
): Promise<CmsContent[]> {
  const { data, error } = await supabase
    .from("cms_content")
    .select(CMS_SELECT)
    .eq("content_type", contentType)
    .eq("is_published", true)
    .order("sort_order")
    .order("created_at");

  if (error) throw error;
  return (data ?? []) as CmsContent[];
}

export async function createCmsContent(
  input: CmsContentInput,
): Promise<CmsContent> {
  const { data, error } = await supabase
    .from("cms_content")
    .insert({
      ...input,
      content_key: input.content_key.trim().toLowerCase(),
      title: input.title.trim(),
      body: input.body.trim(),
      image_url: input.image_url?.trim() || null,
      link_url: input.link_url?.trim() || null,
      metadata: input.metadata ?? {},
    })
    .select(CMS_SELECT)
    .single();

  if (error) throw error;
  return data as CmsContent;
}

export async function updateCmsContent(
  contentId: number,
  input: CmsContentInput,
): Promise<CmsContent> {
  const { data, error } = await supabase
    .from("cms_content")
    .update({
      ...input,
      content_key: input.content_key.trim().toLowerCase(),
      title: input.title.trim(),
      body: input.body.trim(),
      image_url: input.image_url?.trim() || null,
      link_url: input.link_url?.trim() || null,
      metadata: input.metadata ?? {},
    })
    .eq("content_id", contentId)
    .select(CMS_SELECT)
    .single();

  if (error) throw error;
  return data as CmsContent;
}

export async function deleteCmsContent(contentId: number): Promise<void> {
  const { error } = await supabase
    .from("cms_content")
    .delete()
    .eq("content_id", contentId);

  if (error) throw error;
}
