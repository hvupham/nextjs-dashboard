import { fetchUsers } from '@/app/lib/data';
import { CreateUser } from '@/app/ui/users/buttons';
import UsersTableComponent from '@/app/ui/users/table';
import { Suspense } from 'react';

export default async function Page(props: {
  searchParams?: Promise<{
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const sortBy = searchParams?.sortBy || 'name';
  const sortOrder = (searchParams?.sortOrder || 'ASC') as 'ASC' | 'DESC';

  const users = await fetchUsers(sortBy, sortOrder);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Users</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <CreateUser />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <UsersTableComponent users={users} sortBy={sortBy} sortOrder={sortOrder} />
      </Suspense>
    </div>
  );
}
