'use server';

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export const createCompanion = async (
  formData: CreateCompanion & { lessonPlanFile?: FileList }
) => {
  const { userId: author } = await auth();
  const supabase = createSupabaseClient();

  const { lessonPlanFile, ...companionData } = formData;

  let lesson_plan_url: string | null = null;
  if (lessonPlanFile?.length) {
    const file = lessonPlanFile[0];
    const path = `lesson-plans/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("lesson-plans")
      .upload(path, file);
    if (uploadError) throw new Error(uploadError.message);

    const { publicUrl } =
      supabase.storage.from("lesson-plans").getPublicUrl(path).data;
    lesson_plan_url = publicUrl;
  }

  const { data, error } = await supabase
    .from("companions")
    .insert({ ...companionData, author, lesson_plan_url })
    .select();

  if (error || !data) throw new Error(error?.message || 'Failed to create a companion');

  return data[0];
};


export const getAllCompanions = async ({ limit = 10, page = 1, subject, topic }: GetAllCompanions) => {
    const { userId } = await auth();
    const supabase = createSupabaseClient();

    let query = supabase.from('companions').select();
    if (subject && topic) {
        query = query.ilike('subject', `%${subject}%`)
            .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
    } else if (subject) {
        query = query.ilike('subject', `%${subject}%`);
    } else if (topic) {
        query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
    }
    query = query.range((page - 1) * limit, page * limit - 1);

    const { data: companions, error: compErr } = await query;
    if (compErr) throw new Error(compErr.message);

    const { data: bmRows, error: bmErr } = await supabase
        .from('bookmarks')
        .select('companion_id')
        .eq('user_id', userId);
    if (bmErr) throw new Error(bmErr.message);

    const bookmarkedIds = new Set(bmRows.map(r => r.companion_id));
    return companions.map(c => ({ ...c, bookmarked: bookmarkedIds.has(c.id) }));
};

export const getCompanion = async (id: string) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq('id', id);
    if (error) return console.log(error);
    return data[0];
};

export const addToSessionHistory = async (companionId: string) => {
    const { userId } = await auth();
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('session_history')
        .insert({ companion_id: companionId, user_id: userId });
    if (error) throw new Error(error.message);
    return data;
};

export const getRecentSessions = async (limit = 10) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('session_history')
        .select(`companions:companion_id (*)`)
        .order('created_at', { ascending: false })
        .limit(limit);
    if (error) throw new Error(error.message);
    return data.map(({ companions }) => companions);
};

export const getUserSessions = async (userId: string, limit = 10) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('session_history')
        .select(`companions:companion_id (*)`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
    if (error) throw new Error(error.message);
    return data.map(({ companions }) => companions);
};

export const getUserCompanions = async (userId: string) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq('author', userId);
    if (error) throw new Error(error.message);
    return data;
};

export const newCompanionPermissions = async () => {
    const { userId, has } = await auth();
    const supabase = createSupabaseClient();
    let limit = 0;
    if (has({ plan: 'pro' })) {
        return true;
    } else if (has({ feature: "3_companion_limit" })) {
        limit = 3;
    } else if (has({ feature: "10_companion_limit" })) {
        limit = 10;
    }
    const { data, error } = await supabase
        .from('companions')
        .select('id', { count: 'exact' })
        .eq('author', userId);
    if (error) throw new Error(error.message);
    return (data?.length ?? 0) < limit;
};

export const addBookmark = async (companionId: string, path: string) => {
    const { userId } = await auth();
    if (!userId) return;
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from("bookmarks")
        .insert({ companion_id: companionId, user_id: userId });
    if (error) throw new Error(error.message);
    revalidatePath(path);
    return data;
};

export const removeBookmark = async (companionId: string, path: string) => {
    const { userId } = await auth();
    if (!userId) return;
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("companion_id", companionId)
        .eq("user_id", userId);
    if (error) throw new Error(error.message);
    revalidatePath(path);
    return data;
};

export const getBookmarkedCompanions = async (userId: string) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from("bookmarks")
        .select(`companions:companion_id (*)`)
        .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return data.flatMap(({ companions }) => companions);
};


export const getPopularCompanions = async (limit = 10) => {
  const { userId } = await auth();
  const supabase = createSupabaseClient();

  // fetch all session entries
  const { data: sessions, error: sessErr } = await supabase
    .from('session_history')
    .select('companion_id');
  if (sessErr) throw new Error(sessErr.message);

  //count how many times each companion_id appears
  const counts: Record<string, number> = {};
  sessions?.forEach((s: { companion_id: string }) => {
    counts[s.companion_id] = (counts[s.companion_id] || 0) + 1;
  });

  //sort the ids by descending count, then take the top `limit`
  const sortedIds = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([id]) => id);
  if (sortedIds.length === 0) return [];

  //fetch those companion records + this user’s bookmarks in parallel
  const [{ data: comps, error: compErr }, { data: bmRows, error: bmErr }] =
    await Promise.all([
      supabase.from('companions').select().in('id', sortedIds),
      supabase.from('bookmarks').select('companion_id').eq('user_id', userId),
    ]);
  if (compErr) throw new Error(compErr.message);
  if (bmErr) throw new Error(bmErr.message);

  const bookmarkedIds = new Set(bmRows.map((b: { companion_id: string }) => b.companion_id));

  //re-order by popularity & attach `bookmarked` flag
  return sortedIds
    .map((id) => {
      const c = comps.find((c) => c.id === id);
      return c ? { ...c, bookmarked: bookmarkedIds.has(id) } : null;
    })
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
};



