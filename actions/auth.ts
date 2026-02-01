'use server';

import { createClient } from "@/app/lib/supabase/server";

export async function loginClient(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  if (!data.session) {
    return { error: 'Authentication failed. Please try again.' };
  }

  return {
    error: null,
    session: data.session,
    user: data.user,
  };
}

export async function signupClient(email: string, password: string, fullName: string) {
  const supabase =  createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return {
      error: error.message,
      requiresEmailConfirm: false,
    };
  }

  return {
    error: null,
    session: data.session,
    user: data.user,
    requiresEmailConfirm: Boolean(data.user && !data.session),
  };
}

export async function checkAdminAccess() {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { isAdmin: false, error: 'Not authenticated' };
  }

  const { data: profile, error: profileError } = await supabase.from('profiles').select('role').eq('id', user.id).single();

  if (profileError || profile?.role !== 'admin') {
    return { isAdmin: false, error: 'Unauthorized' };
  }

  return { isAdmin: true, error: null };
}

export async function logoutClient() {
  const supabase = createClient();
  await supabase.auth.signOut();
}
