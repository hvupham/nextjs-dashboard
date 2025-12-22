import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import Form from '@/app/ui/customers/edit-form';
import { fetchCustomerById } from '@/app/lib/data/customers';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const customer = await fetchCustomerById(id);

    if (!customer) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Khách hàng', href: '/dashboard/customers' },
                    {
                        label: 'Chỉnh sửa khách hàng',
                        href: `/dashboard/customers/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form customer={customer} />
        </main>
    );
}
