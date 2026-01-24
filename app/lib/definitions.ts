// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
};

export type Payment = {
  id: string;
  product_id: string;
  customer_id: string;
  billing_month: string; // DATE format
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  payment_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

export type PaymentsTable = {
  id: string;
  product_id: string;
  customer_id: string;
  billing_month: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  payment_date?: string;
  notes?: string;
  // For display
  msn?: string;
  customer_name?: string;
  customer_email?: string;
};

export type Subscription = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  status: 'pending' | 'paid';
  product_type?: string;
  data_type?: string;
  sim_status?: 'xuat' | 'chua_xuat';
  employee_id?: string;
  export_date?: string;
  tracking_number?: string;
  package_months?: number;
  notes?: string;
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestSubscription = {
  id: string;
  name: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestSubscriptionRaw = Omit<LatestSubscription, 'amount'> & {
  amount: number;
};

export type SubscriptionsTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
  product_type?: string;
  data_type?: string;
  sim_status?: string;
  employee_id?: string;
  employee_name?: string;
  export_date?: string;
  tracking_number?: string;
  package_months?: number;
  notes?: string;
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type SubscriptionForm = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  status: 'pending' | 'paid';
  product_type?: string;
  data_type?: string;
  sim_status?: string;
  employee_id?: string;
  export_date?: string;
  tracking_number?: string;
  package_months?: number;
  notes?: string;
};

export type UsersTable = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
};

export type Product = {
  id: string;
  monthly_price: number;
  description: string;
  stock: number;
  status: 'available' | 'out-of-stock';
  customer_id?: string;
  // SIM Card specific fields
  msn?: string;
  imsi?: string;
  carrier?: string;
  imei?: string;
  iccid?: string;
  device_type?: string;
  sim_type?: 'physical' | 'multi' | 'esim';
  capacity?: string;
  shipping_date?: string;
  expiration_date?: string;
  activation_date?: string;
  options?: string;
  sim_status_id?: number;
  sim_status?: 'active' | 'not-activated' | 'resetting' | 'in-stock' | 'suspended';
  // Data usage tracking
  current_month_usage?: string;
  previous_month_usage?: string;
};

export type ProductsTable = {
  id: string;
  monthly_price: number;
  description: string;
  stock: number;
  status: 'available' | 'out-of-stock';
  customer_id?: string;
  msn?: string;
  carrier?: string;
  capacity?: string;
  iccid?: string;
  sim_status_id?: number;
  sim_status?: 'active' | 'not-activated' | 'resetting' | 'in-stock' | 'suspended';
  shipping_date?: string;
  activation_date?: string;
  current_month_usage?: string;
  previous_month_usage?: string;
};

export type ProductForm = {
  id: string;
  monthly_price: number;
  description: string;
  stock: number;
  status: 'available' | 'out-of-stock';
  customer_id?: string;
  msn?: string;
  imsi?: string;
  carrier?: string;
  imei?: string;
  iccid?: string;
  device_type?: string;
  sim_type?: 'physical' | 'multi' | 'esim';
  capacity?: string;
  shipping_date?: string;
  expiration_date?: string;
  activation_date?: string;
  options?: string;
  sim_status_id?: number;
  sim_status?: 'active' | 'not-activated' | 'resetting' | 'in-stock' | 'suspended';
  current_month_usage?: string;
  previous_month_usage?: string;
};
