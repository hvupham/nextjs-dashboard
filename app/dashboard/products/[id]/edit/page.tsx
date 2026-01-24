import { auth } from '@/app/lib/auth';
import { fetchProductById } from '@/app/lib/data/products';
import { fetchSIMStatuses } from '@/app/lib/data/sim-statuses';
import EditForm from '@/app/ui/products/edit-form-sim';
import Breadcrumbs from '@/app/ui/subscriptions/breadcrumbs';
import { notFound, redirect } from 'next/navigation';

export default async function Page(props: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  // Verify user is authenticated
  if (!session?.user) {
    redirect('/login');
  }

  const params = await props.params;
  const { id } = params;

  let product;
  try {
    product = await fetchProductById(id);
  } catch (error) {
    notFound();
  }

  if (!product) {
    notFound();
  }

  // Fetch SIM statuses
  const simStatuses = await fetchSIMStatuses();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Sản phẩm', href: '/dashboard/products' },
          {
            label: `Chỉnh sửa SIM Card`,
            href: `/dashboard/products/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditForm product={product} simStatuses={simStatuses} />
    </main>
  );
}
