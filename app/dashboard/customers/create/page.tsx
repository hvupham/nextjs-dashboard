import Breadcrumbs from '@/app/ui/subscriptions/breadcrumbs';
import Form from '@/app/ui/customers/create-form';

export default function Page() {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Khách hàng', href: '/dashboard/customers' },
                    {
                        label: 'Tạo khách hàng',
                        href: '/dashboard/customers/create',
                        active: true,
                    },
                ]}
            />
            <Form />
        </main>
    );
}
