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

export const updateCouponBalances = async (accountNo, newBalance) => {
  try {
    // Fetch the client based on account_no
    const { data: clients, error: clientError } = await supabase
      .from('clients')
      .select('id')
      .eq('account_no', accountNo)
      .single();
    
    if (clientError) throw clientError;

    const clientId = clients.id;

    // Update all coupons under the fetched client_id
    const { data, error } = await supabase
      .from('coupons')
      .update({ balance: newBalance })
      .eq('client_id', clientId);

    if (error) throw error;

    return { data };
  } catch (error) {
    return { error };
  }
};