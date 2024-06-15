import { supabase } from '../config.js';

export async function fetchAllUsers() {
  try {
    const { data, error } = await supabase.from('user_accounts').select('*');
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error fetching clients:', error.message);
  }
}


export async function updateAuthUserPassword(userId, newPassword) {
  try {
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword,
    });
    if (error) {
      throw error;
    }
    console.log("Password updated successfully for user:", data);
    return data;
  } catch (error) {
    console.error("Error updating password:", error.message);
    throw error;
  }
}