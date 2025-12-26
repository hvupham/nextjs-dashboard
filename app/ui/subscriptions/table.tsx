import Link from 'next/link';
import { Updatesubscription, Deletesubscription } from '@/app/ui/subscriptions/buttons';
import SubscriptionStatus from '@/app/ui/subscriptions/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredSubscriptions, fetchUserById } from '@/app/lib/data/index';
import { SortButton } from '@/app/ui/sort-button';
import { fetchUsersByIds } from '@/app/lib/actions/users';
import { EyeIcon } from '@heroicons/react/24/outline';

export default async function subscriptionsTable({
  query,
  currentPage,
  sortBy = 'date',
  sortOrder = 'DESC',
}: {
  query: string;
  currentPage: number;
  sortBy?: string;
  sortOrder?: string;
}) {
  const rawsubscriptions = await fetchFilteredSubscriptions(query, currentPage, sortBy, sortOrder as 'ASC' | 'DESC');
  const employeeIds = Array.from(
    new Set(
      rawsubscriptions
        .map(i => i.employee_id)
        .filter((id): id is string => Boolean(id))
    )
  );

  console.log('Customer IDs:', employeeIds);
  const users = await fetchUsersByIds(employeeIds);

  const userMap = Object.fromEntries(
    users.map(u => [u.id, u])
  );


  const subscriptions = rawsubscriptions.map(subscription => {
    const employeeId = subscription.employee_id;

    return {
      ...subscription,
      employeeName: employeeId
        ? userMap[employeeId]?.name ?? 'Unassigned'
        : 'Unassigned',
    };
  });



  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {subscriptions?.map((subscription) => (
              <div
                key={subscription.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{subscription.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{subscription.email}</p>
                  </div>
                  <SubscriptionStatus status={subscription.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="w-full">
                    <p className="font-medium">{subscription.name}</p>
                    {subscription.product_type && (
                      <p className="text-sm text-gray-500">Sản phẩm: {subscription.product_type}</p>
                    )}
                    {subscription.data_type && (
                      <p className="text-sm text-gray-500">Dữ liệu: {subscription.data_type}</p>
                    )}
                    {subscription.export_date && (
                      <p className="text-sm text-gray-500">Xuất: {formatDateToLocal(subscription.export_date)}</p>
                    )}
                    {subscription.tracking_number && (
                      <p className="text-sm text-gray-500">Mã: {subscription.tracking_number}</p>
                    )}
                    {subscription.notes && (
                      <p className="text-sm text-gray-500">Ghi chú: {subscription.notes}</p>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/dashboard/subscriptions/${subscription.id}/detail`}
                      className="rounded-md border p-2 hover:bg-gray-100"
                      title="Chi tiết"
                    >
                      <EyeIcon className="w-5" />
                    </Link>
                    <Updatesubscription id={subscription.id} />
                    <Deletesubscription id={subscription.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  <SortButton
                    field="name"
                    label="Khách hàng"
                    currentSortBy={sortBy}
                    currentSortOrder={sortOrder}
                    baseUrl="/dashboard/subscriptions"
                  />
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Loại sản phẩm
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Loại dữ liệu
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Ngày nhận SIM
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Nhân viên chốt
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Ngày xuất SIM
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Mã gửi đơn
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Cước tháng
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Ghi chú
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Chỉnh sửa</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {subscriptions?.map((subscription) => (
                <tr
                  key={subscription.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{subscription.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {subscription.product_type || '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {subscription.data_type || '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {subscription.date ? formatDateToLocal(subscription.date) : '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {subscription.employeeName || '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {subscription.export_date ? formatDateToLocal(subscription.export_date) : '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {subscription.tracking_number || '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {subscription.package_months || '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {subscription.notes || '-'}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/dashboard/subscriptions/${subscription.id}/detail`}
                        className="rounded-md border p-2 hover:bg-gray-100"
                        title="Chi tiết"
                      >
                        <EyeIcon className="w-5" />
                      </Link>
                      <Updatesubscription id={subscription.id} />
                      <Deletesubscription id={subscription.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
