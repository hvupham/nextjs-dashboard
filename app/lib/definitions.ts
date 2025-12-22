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
  image_url: string;
};

export type Invoice = {
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

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
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

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  image_url: string;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  image_url: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
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
  name: string;
  type: 'sim' | 'pocket-wifi';
  monthly_price: number;
  description: string;
  stock: number;
  status: 'available' | 'out-of-stock';
};

export type ProductsTable = {
  id: string;
  name: string;
  type: 'sim' | 'pocket-wifi';
  monthly_price: number;
  description: string;
  stock: number;
  status: 'available' | 'out-of-stock';
};

export type ProductForm = {
  id: string;
  name: string;
  type: 'sim' | 'pocket-wifi';
  monthly_price: number;
  description: string;
  stock: number;
  status: 'available' | 'out-of-stock';
};
