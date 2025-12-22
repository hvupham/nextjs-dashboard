'use client';

import { UserState, updateUser } from '@/app/lib/actions/users';
import { UsersTable } from '@/app/lib/definitions';
import { Button } from '@/app/ui/button';
import {
  EnvelopeIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useActionState } from 'react';

export default function EditUserForm({ user }: { user: UsersTable }) {
  const initialState: UserState = { message: '', errors: {} };
  const updateUserWithId = updateUser.bind(null, user.id);
  const [state, formAction] = useActionState(updateUserWithId, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* User Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={user.name}
              placeholder="Enter user name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="name-error"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* User Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={user.email}
              placeholder="Enter email address"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="email-error"
            />
            <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email &&
              state.errors.email.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* User Role */}
        <fieldset className="mb-4">
          <legend className="mb-2 block text-sm font-medium">
            Select Role
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="user"
                  name="role"
                  type="radio"
                  value="user"
                  defaultChecked={user.role === 'user'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="role-error"
                />
                <label
                  htmlFor="user"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  User
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="admin"
                  name="role"
                  type="radio"
                  value="admin"
                  defaultChecked={user.role === 'admin'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="admin"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-600"
                >
                  Admin
                </label>
              </div>
            </div>
          </div>
          <div id="role-error" aria-live="polite" aria-atomic="true">
            {state.errors?.role &&
              state.errors.role.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </fieldset>

        {state.message && (
          <div className="mb-4" aria-live="polite" aria-atomic="true">
            <p className="text-sm text-red-500">{state.message}</p>
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/users"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Hủy bỏ
        </Link>
        <Button type="submit">Chỉnh sửa người dùng</Button>
      </div>
    </form>
  );
}
