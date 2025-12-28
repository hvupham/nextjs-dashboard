export const dynamic = 'force-dynamic';

import { fetchCustomers } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/subscriptions/breadcrumbs';
import Form from '@/app/ui/subscriptions/create-form';

export default async function Page() {
    const customers = await fetchCustomers();

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Đăng ký', href: '/dashboard/subscriptions' },
                    {
                        label: 'Tạo mới',
                        href: '/dashboard/subscriptions/create',
                        active: true,
                    },
                ]}
            />
            <Form customers={customers} />
        </main>
    );
}
