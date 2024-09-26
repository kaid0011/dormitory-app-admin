import { supabase } from '../config.js';

export async function fetchAllInvoices() {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('date_time', { ascending: false })  // Adjust the column name based on your schema
      .limit(1000);
    
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error fetching invoices:', error.message);
  }
}


export async function fetchCouponById(couponId) {
  try {
    let { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('id', couponId)
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching coupon:', error);
    throw error;
  }
}

export async function fetchItemList() {
  try {
    let { data, error } = await supabase
      .from('item_list')
      .select('*');
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching item list:', error);
    throw error;
  }
}

export async function fetchInvoiceDetails(invoiceNo) {
  try {
    let { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('invoice_no', invoiceNo)
      .single(); // Use single to get a single record

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error(`No invoice found with invoice_no: ${invoiceNo}`);
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching invoice details:', error.message);
    throw error;
  }
}

export async function fetchTransactionsByInvoiceId(invoiceId) {
  try {
    // Fetch transactions based on the invoice_id
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('invoice_id', invoiceId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    throw error;
  }
}

export async function fetchTransactionsByInvoiceNo(invoiceNo) {
  try {
    // Fetch the invoice details first to get its id
    const { data: invoice } = await supabase
      .from('invoices')
      .select('id')
      .eq('invoice_no', invoiceNo)
      .single();

    if (!invoice) {
      throw new Error(`Invoice with invoice_no ${invoiceNo} not found`);
    }

    // Now fetch transactions using the invoice id
    return await fetchTransactionsByInvoiceId(invoice.id);
  } catch (error) {
    console.error('Error fetching transactions by invoice no:', error);
    throw error;
  }
}

export async function updateStatus(invoice) {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .update({ status: invoice.status })
      .eq('invoice_no', invoice.invoice_no);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error updating invoice status:', error);
    throw error;
  }
}