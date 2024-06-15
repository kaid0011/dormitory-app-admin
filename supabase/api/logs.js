import { supabase } from '../config.js'; // Adjust import path as needed

export async function fetchLogs() {
  try {
    const { data, error } = await supabase
      .from('change_logs')
      .select('*')
      .order('changed_at', { ascending: false });

    if (error) {
      console.error('Error fetching logs:', error.message);
      return []; // Return an empty array on error
    }

    return data || []; // Ensure data is returned or return an empty array
  } catch (error) {
    console.error('Error fetching logs:', error.message);
    return []; // Catch and log any exceptions, return an empty array
  }
}
