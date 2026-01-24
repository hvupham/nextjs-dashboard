import { auth } from '@/app/lib/auth';
import { fetchCustomers } from '@/app/lib/data';
import { fetchPaymentById } from '@/app/lib/data/payments';
import { fetchProducts } from '@/app/lib/data/products';
import { PaymentForm } from '@/app/ui/payments/payment-form';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

export default async function Page(props: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const params = await props.params;
  const { id } = params;

  const payment = await fetchPaymentById(id);
  if (!payment) {
    notFound();
  }

  const products = await fetchProducts();
  const customers = await fetchCustomers();

  return (
    <div className="w-full space-y-6">
      <div>
        <Link
          href="/dashboard/payments"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
        >
          ← Quay lại danh sách
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa thanh toán</h1>
      </div>

      <PaymentForm payment={payment as any} products={products} customers={customers} isEdit={true} />
    </div>
  );
}
