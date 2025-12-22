'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronUpDownIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface SortButtonProps {
    field: string;
    label: string;
    currentSortBy?: string;
    currentSortOrder?: string;
    baseUrl: string;
}

export function SortButton({
    field,
    label,
    currentSortBy,
    currentSortOrder,
    baseUrl,
}: SortButtonProps) {
    const searchParams = useSearchParams();
    const isActive = currentSortBy === field;
    const isAscending = currentSortOrder === 'ASC';

    // Determine next sort order
    const nextSortOrder = isActive && isAscending ? 'DESC' : 'ASC';

    // Build new URL with sort parameters
    const params = new URLSearchParams(searchParams);
    params.set('sortBy', field);
    params.set('sortOrder', nextSortOrder);

    const href = `${baseUrl}?${params.toString()}`;

    return (
        <Link
            href={href}
            className="inline-flex items-center gap-1 hover:text-blue-600 transition-colors"
        >
            <span>{label}</span>
            {isActive ? (
                isAscending ? (
                    <ChevronUpIcon className="w-4 h-4" />
                ) : (
                    <ChevronDownIcon className="w-4 h-4" />
                )
            ) : (
                <ChevronUpDownIcon className="w-4 h-4 text-gray-400" />
            )}
        </Link>
    );
}
