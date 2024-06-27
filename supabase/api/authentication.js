import { supabase } from '../config.js';

export async function signUpNewUser(name, email, password, accessAreas) {
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
      .update({ name: name, email: email, password: password })
      .eq('id', userId);

    if (insertError) {
      throw insertError;
    }

    // Assign access areas to the new user
    for (const areaId of accessAreas) {
      const { data, error } = await supabase
        .from('user_access_areas')
        .insert([{ user_id: userId, access_area_id: areaId }]);

      if (error) {
        console.error(`Error assigning access area ${areaId}:`, error);
      }
    }

    // Handle success
    console.log("Sign up successful and access areas assigned!");
    return { signUpData, insertData };
  } catch (error) {
    // Handle error
    console.error("Sign up error:", error.message);
    throw error;
  }
}

export async function fetchAccessAreas() {
  try {
    const { data, error } = await supabase.from('access_areas').select('*');
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error fetching access areas:', error.message);
    throw error;
  }
}

// export async function signInWithEmail(email, password) {
//   try {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email: email,
//       password: password,
//     });
//     if (error) {
//       throw error;
//     }
//     // Handle success
//     console.log("Sign in successful!");
//     return data;
//   } catch (error) {
//     // Handle error
//     console.error("Sign in error:", error.message);
//     throw error;
//   }
// }

export async function signInWithEmail(email, password) {
  try {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (signInError) {
      throw signInError;
    }

    // Fetch user's access areas
    const userId = signInData.user.id;
    const { data: accessAreas, error: accessError } = await supabase
      .from('user_access_areas')
      .select('access_areas(name)')
      .eq('user_id', userId);

    if (accessError) {
      throw accessError;
    }

    // Store access areas in local storage
    localStorage.setItem('accessAreas', JSON.stringify(accessAreas.map(area => area.access_areas.name)));
    localStorage.setItem('session', JSON.stringify(signInData)); // Ensure session persistence

    // Handle success
    console.log("Sign in successful!");
    return { signInData, accessAreas };
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
