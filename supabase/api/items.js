import { supabase } from '../config.js';

// Fetch all items from the database
export async function fetchAllItems() {
  try {
    const { data, error } = await supabase.from('item_list').select('*');
    if (error) {
      console.error('Error fetching items:', error.message);
      return [];
    }
    return data;
  } catch (error) {
    console.error('Unexpected error fetching items:', error.message);
    return [];
  }
}

// Create a new item in the database
export async function createItem(newItem) {
  try {
    const { data, error } = await supabase.from('item_list').insert([newItem]);
    if (error) {
      console.error('Error creating item:', error.message);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Unexpected error creating item:', error.message);
    return null;
  }
}

// Update an existing item in the database
export async function updateItems (item) {
  const { data, error } = await supabase.from('item_list').update({
    item: item.item,
    credits: item.credits
  }).eq('id', item.id);
  if (error) throw error;
  return data;
};

// Delete an item from the database
export async function deleteItems(itemId) {
  try {
    const { data, error } = await supabase.from('item_list').delete().eq('id', itemId);
    if (error) {
      console.error('Error deleting item:', error.message);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Unexpected error deleting item:', error.message);
    return null;
  }
}
