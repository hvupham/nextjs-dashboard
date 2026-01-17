import { fetchCardData } from '@/app/lib/data';
import { Card } from '@/app/ui/dashboard/cards';
import LatestSubscriptions from '@/app/ui/dashboard/latest-subscriptions';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import { lusitana } from '@/app/ui/fonts';
import { unstable_noStore as noStore } from 'next/cache';
export default async function Page() {
    noStore();
    // const revenue = await fetchRevenue();
    // const latestsubscriptions = await fetchLatestsubscriptions();
    const { totalPaidsubscriptions, totalPendingsubscriptions, numberOfsubscriptions, numberOfCustomers } = await fetchCardData();
    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Quản lý
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
                <RevenueChart />
                <LatestSubscriptions />
            </div>
        </main>
    );
}