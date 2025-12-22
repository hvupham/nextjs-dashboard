import Image from 'next/image';
import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredInvoices, fetchUserById } from '@/app/lib/data/index';
import { SortButton } from '@/app/ui/sort-button';
import { fetchUsersByIds } from '@/app/lib/actions/users';

export default async function InvoicesTable({
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
  const rawInvoices = await fetchFilteredInvoices(query, currentPage, sortBy, sortOrder as 'ASC' | 'DESC');
  const employeeIds = Array.from(
    new Set(
      rawInvoices
        .map(i => i.employee_id)
        .filter((id): id is string => Boolean(id))
    )
  );

  console.log('Customer IDs:', employeeIds);
  const users = await fetchUsersByIds(employeeIds);

  const userMap = Object.fromEntries(
    users.map(u => [u.id, u])
  );


  const invoices = rawInvoices.map(invoice => {
    const employeeId = invoice.employee_id;

    return {
      ...invoice,
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
            {invoices?.map((invoice) => (
              <div
                key={invoice.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={invoice.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      />
                      <p>{invoice.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{invoice.email}</p>
                  </div>
                  <InvoiceStatus status={invoice.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="w-full">
                    <p className="font-medium">{invoice.name}</p>
                    {invoice.product_type && (
                      <p className="text-sm text-gray-500">Sản phẩm: {invoice.product_type}</p>
                    )}
                    {invoice.data_type && (
                      <p className="text-sm text-gray-500">Dữ liệu: {invoice.data_type}</p>
                    )}
                    {invoice.export_date && (
                      <p className="text-sm text-gray-500">Xuất: {formatDateToLocal(invoice.export_date)}</p>
                    )}
                    {invoice.tracking_number && (
                      <p className="text-sm text-gray-500">Mã: {invoice.tracking_number}</p>
                    )}
                    {invoice.notes && (
                      <p className="text-sm text-gray-500">Ghi chú: {invoice.notes}</p>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateInvoice id={invoice.id} />
                    <DeleteInvoice id={invoice.id} />
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
                    baseUrl="/dashboard/invoices"
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
              {invoices?.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={invoice.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      />
                      <p>{invoice.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.product_type || '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.data_type || '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.date ? formatDateToLocal(invoice.date) : '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.employeeName || '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.export_date ? formatDateToLocal(invoice.export_date) : '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.tracking_number || '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.package_months || '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.notes || '-'}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateInvoice id={invoice.id} />
                      <DeleteInvoice id={invoice.id} />
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
