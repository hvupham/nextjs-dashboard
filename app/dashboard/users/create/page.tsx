import Breadcrumbs from '@/app/ui/subscriptions/breadcrumbs';
import Form from '@/app/ui/users/create-form';

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Người dùng', href: '/dashboard/users' },
          {
            label: 'Tạo người dùng',
            href: '/dashboard/users/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
