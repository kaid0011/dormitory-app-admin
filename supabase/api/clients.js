import { supabase } from '../config.js';

export async function fetchAllClients() {
  try {
    const { data, error } = await supabase.from('clients').select('*');
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error fetching clients:', error.message);
  }
}

export async function fetchAllCoupons() {
  try {
    const { data, error } = await supabase.from('coupons').select('*');
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error fetching coupons:', error.message);
  }
}

export async function createClient(newClient) {
  try {
    const { data, error } = await supabase.from('clients').insert(newClient);
    if (error) {
      throw error;
    }
    return { data };
  } catch (error) {
    console.error('Error adding client:', error.message);
    return { error };
  }
}

export async function fetchCouponsByClientId(clientId) {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('client_id', clientId);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error fetching coupons by client ID:', error.message);
  }
}

export async function addCouponToDatabase(newCoupon) {
  try {
    const { data, error } = await supabase.from('coupons').insert(newCoupon).select();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error adding coupon:', error.message);
  }
}

export async function updateCouponInDatabase(couponId, updatedFields) {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .update(updatedFields)
      .eq('id', couponId);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error updating coupon:', error.message);
  }
}
