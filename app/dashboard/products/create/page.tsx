import Breadcrumbs from '@/app/ui/subscriptions/breadcrumbs';
import Form from '@/app/ui/products/create-form';

export default async function Page() {
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
      <Form />
    </main>
  );
}
