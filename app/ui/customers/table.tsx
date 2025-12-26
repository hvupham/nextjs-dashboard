import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import {
  CustomersTableType,
  FormattedCustomersTable,
} from '@/app/lib/definitions';
import { SortButton } from '@/app/ui/sort-button';
import { UpdateCustomer, DeleteCustomer } from '@/app/ui/customers/buttons';

export default async function CustomersTable({
  customers,
  sortBy = 'name',
  sortOrder = 'ASC',
}: {
  customers: FormattedCustomersTable[];
  sortBy?: string;
  sortOrder?: string;
}) {
  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {customers?.map((customer) => (
                  <div
                    key={customer.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            
                            <p>{customer.name}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {customer.email}
                        </p>
                        <p className="text-sm text-gray-500">
                          {customer.phone_number || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between pt-4">
                      <div className="flex gap-2">
                        <UpdateCustomer id={customer.id} />
                        <DeleteCustomer id={customer.id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      <SortButton
                        field="name"
                        label="Tên"
                        currentSortBy={sortBy}
                        currentSortOrder={sortOrder}
                        baseUrl="/dashboard/customers"
                      />
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      <SortButton
                        field="email"
                        label="Email"
                        currentSortBy={sortBy}
                        currentSortOrder={sortOrder}
                        baseUrl="/dashboard/customers"
                      />
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">Số điện thoại</th>
                    <th scope="col" className="px-3 py-5 font-medium">Hành động</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          
                          <p>{customer.name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {customer.email}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {customer.phone_number || '-'}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                        <div className="flex gap-2">
                          <UpdateCustomer id={customer.id} />
                          <DeleteCustomer id={customer.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
