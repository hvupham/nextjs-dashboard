import Form from '@/app/ui/subscriptions/edit-form';
import Breadcrumbs from '@/app/ui/subscriptions/breadcrumbs';
import { fetchCustomers, fetchsubscriptionById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;

    const [subscription, customers] = await Promise.all([
        fetchsubscriptionById(id),
        fetchCustomers(),
    ]);
    if (!subscription) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'subscriptions', href: '/dashboard/subscriptions' },
                    {
                        label: 'Edit subscription',
                        href: `/dashboard/subscriptions/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form subscription={subscription} customers={customers} />
        </main>
    );
}