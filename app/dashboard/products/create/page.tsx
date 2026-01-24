import { fetchSIMStatuses } from '@/app/lib/data/sim-statuses';
import Form from '@/app/ui/products/create-form-sim';
import Breadcrumbs from '@/app/ui/subscriptions/breadcrumbs';

export default async function Page() {
  // Fetch SIM statuses
  const simStatuses = await fetchSIMStatuses();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Sản phẩm', href: '/dashboard/products' },
          {
            label: 'Tạo sản phẩm',
            href: '/dashboard/products/create',
            active: true,
          },
        ]}
      />
      <Form simStatuses={simStatuses} />
    </main>
  );
}
