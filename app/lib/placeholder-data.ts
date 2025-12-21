// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@nextmail.com',
    password: '123456',
    role: 'admin' as const,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: '123456',
    role: 'user' as const,
  },
  {
    id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: '123456',
    role: 'user' as const,
  },
  {
    id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    password: '123456',
    role: 'admin' as const,
  },
  {
    id: '8f14e45f-ceea-467a-9538-1c9d8c8b4c2a',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    password: '123456',
    role: 'user' as const,
  },
  {
    id: '9b5c2b1d-5e8a-4c3d-b7a8-1f2d3e4a5b6c',
    name: 'David Brown',
    email: 'david.brown@example.com',
    password: '123456',
    role: 'user' as const,
  },
];

const customers = [
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: '/customers/evil-rabbit.png',
  },
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/customers/delba-de-oliveira.png',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    name: 'Lee Robinson',
    email: 'lee@robinson.com',
    image_url: '/customers/lee-robinson.png',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
    name: 'Michael Novotny',
    email: 'michael@novotny.com',
    image_url: '/customers/michael-novotny.png',
  },
  {
    id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
    name: 'Amy Burns',
    email: 'amy@burns.com',
    image_url: '/customers/amy-burns.png',
  },
  {
    id: '13D07535-C59E-4157-A011-F8D2EF4E0CBB',
    name: 'Balazs Orban',
    email: 'balazs@orban.com',
    image_url: '/customers/balazs-orban.png',
  },
];

const invoices = [
  {
    customer_id: customers[0].id,
    amount: 15795,
    status: 'pending',
    date: '2022-12-06',
  },
  {
    customer_id: customers[1].id,
    amount: 20348,
    status: 'pending',
    date: '2022-11-14',
  },
  {
    customer_id: customers[4].id,
    amount: 3040,
    status: 'paid',
    date: '2022-10-29',
  },
  {
    customer_id: customers[3].id,
    amount: 44800,
    status: 'paid',
    date: '2023-09-10',
  },
  {
    customer_id: customers[5].id,
    amount: 34577,
    status: 'pending',
    date: '2023-08-05',
  },
  {
    customer_id: customers[2].id,
    amount: 54246,
    status: 'pending',
    date: '2023-07-16',
  },
  {
    customer_id: customers[0].id,
    amount: 666,
    status: 'pending',
    date: '2023-06-27',
  },
  {
    customer_id: customers[3].id,
    amount: 32545,
    status: 'paid',
    date: '2023-06-09',
  },
  {
    customer_id: customers[4].id,
    amount: 1250,
    status: 'paid',
    date: '2023-06-17',
  },
  {
    customer_id: customers[5].id,
    amount: 8546,
    status: 'paid',
    date: '2023-06-07',
  },
  {
    customer_id: customers[1].id,
    amount: 500,
    status: 'paid',
    date: '2023-08-19',
  },
  {
    customer_id: customers[5].id,
    amount: 8945,
    status: 'paid',
    date: '2023-06-03',
  },
  {
    customer_id: customers[2].id,
    amount: 1000,
    status: 'paid',
    date: '2022-06-05',
  },
];

const revenue = [
  { month: 'Jan', revenue: 2000 },
  { month: 'Feb', revenue: 1800 },
  { month: 'Mar', revenue: 2200 },
  { month: 'Apr', revenue: 2500 },
  { month: 'May', revenue: 2300 },
  { month: 'Jun', revenue: 3200 },
  { month: 'Jul', revenue: 3500 },
  { month: 'Aug', revenue: 3700 },
  { month: 'Sep', revenue: 2500 },
  { month: 'Oct', revenue: 2800 },
  { month: 'Nov', revenue: 3000 },
  { month: 'Dec', revenue: 4800 },
];

const products = [
  {
    id: 'a1b2c3d4-e5f6-4789-a1b2-c3d4e5f67890',
    name: 'Japan Travel SIM - 30 Days',
    type: 'sim' as const,
    monthly_price: 2500,
    description: 'Unlimited data SIM card for 30 days in Japan',
    stock: 50,
    status: 'available' as const,
  },
  {
    id: 'b2c3d4e5-f6a7-4890-b2c3-d4e5f6a78901',
    name: 'Japan Pocket WiFi - Premium',
    type: 'pocket-wifi' as const,
    monthly_price: 5000,
    description: 'High-speed pocket WiFi, up to 5 devices, unlimited data',
    stock: 30,
    status: 'available' as const,
  },
  {
    id: 'c3d4e5f6-a7b8-4901-c3d4-e5f6a7b89012',
    name: 'Asia Travel SIM - 30 Days',
    type: 'sim' as const,
    monthly_price: 3000,
    description: 'Multi-country SIM for Asia (Japan, Korea, Thailand, etc.)',
    stock: 40,
    status: 'available' as const,
  },
  {
    id: 'd4e5f6a7-b8c9-4012-d4e5-f6a7b8c90123',
    name: 'Japan Pocket WiFi - Standard',
    type: 'pocket-wifi' as const,
    monthly_price: 3500,
    description: 'Standard pocket WiFi, up to 3 devices, 10GB/day',
    stock: 0,
    status: 'out-of-stock' as const,
  },
  {
    id: 'e5f6a7b8-c9d0-4123-e5f6-a7b8c9d01234',
    name: 'Europe Travel SIM - 30 Days',
    type: 'sim' as const,
    monthly_price: 3500,
    description: 'Unlimited data SIM for 30+ European countries',
    stock: 25,
    status: 'available' as const,
  },
  {
    id: 'f6a7b8c9-d0e1-4234-f6a7-b8c9d0e12345',
    name: 'Global Pocket WiFi',
    type: 'pocket-wifi' as const,
    monthly_price: 8000,
    description: 'Works in 100+ countries, unlimited data, up to 5 devices',
    stock: 15,
    status: 'available' as const,
  },
];

export { customers, invoices, products, revenue, users };

