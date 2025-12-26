export const dynamic = 'force-dynamic';

import Form from '@/app/ui/subscriptions/create-form';
import Breadcrumbs from '@/app/ui/subscriptions/breadcrumbs';
import { fetchCustomers, fetchsubscriptionById } from '@/app/lib/data';

export default async function Page() {
    const customers = await fetchCustomers();

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Hóa đơn', href: '/dashboard/subscriptions' },
                    {
                        label: 'Tạo hóa đơn',
                        href: '/dashboard/subscriptions/create',
                        active: true,
                    },
                ]}
            />
            <Form customers={customers} />
        </main>
    );
}
