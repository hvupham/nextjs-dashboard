import CardWrapper, { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import Latestsubscriptions from '@/app/ui/dashboard/latest-subscriptions';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';
import { Suspense } from 'react';
import { auth } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import {
    RevenueChartSkeleton,
    LatestsubscriptionsSkeleton,
    CardsSkeleton,
} from '@/app/ui/skeletons';

export default async function Page() {
    const session = await auth();
    
    // Only admin can access dashboard overview - users redirect to subscriptions
    if (!session?.user || session.user.role !== 'admin') {
        redirect('/dashboard/subscriptions');
    }
    
    const {
        numberOfsubscriptions,
        numberOfCustomers,
        totalPaidsubscriptions,
        totalPendingsubscriptions,
    } = await fetchCardData();

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Bảng điều khiển
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card title="Collected" value={totalPaidsubscriptions} type="collected" />
                <Card title="Pending" value={totalPendingsubscriptions} type="pending" />
                <Card title="Total subscriptions" value={numberOfsubscriptions} type="subscriptions" />
                <Card
                    title="Total Customers"
                    value={numberOfCustomers}
                    type="customers"
                />
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<CardsSkeleton />}>
                    <CardWrapper />
                </Suspense>
            </div>
        </main>
    );
}