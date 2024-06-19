import { supabase } from '../config.js';

export async function signUpNewUser(name, email, password) {
  try {
    // Sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (signUpError) {
      throw signUpError;
    }

    // Get user ID from sign-up data
    const userId = signUpData.user.id;

    // Insert name into user_accounts table
    const { data: insertData, error: insertError } = await supabase
      .from('user_accounts')
      .update({ name: name , email: email, password: password})
      .eq('id', userId);

    if (insertError) {
      throw insertError;
    }

    // Handle success
    console.log("Sign up successful!");
    return { signUpData, insertData };
  } catch (error) {
    // Handle error
    console.error("Sign up error:", error.message);
    throw error;
  }
}


export async function signInWithEmail(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      throw error;
    }
    // Handle success
    console.log("Sign in successful!");
    return data;
  } catch (error) {
    // Handle error
    console.error("Sign in error:", error.message);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    // Handle success
    console.log("Sign out successful!");
  } catch (error) {
    // Handle error
    console.error("Sign out error:", error.message);
    throw error;
  }
}
