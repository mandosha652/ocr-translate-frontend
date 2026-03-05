'use client';

import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAdminUsers } from '@/hooks';

import { CreateUserDialog } from './_components/CreateUserDialog';
import { UserFilters } from './_components/UserFilters';
import { UserListContent } from './_components/UserListContent';
import { UserPagination } from './_components/UserPagination';

const PAGE_SIZE = 20;

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [tier, setTier] = useState('all');
  const [status, setStatus] = useState('all');
  const [offset, setOffset] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);

  const [debouncedSearch] = useDebounce(search, 300);

  const params = {
    search: debouncedSearch || undefined,
    tier: tier !== 'all' ? tier : undefined,
    is_active:
      status === 'active' ? true : status === 'suspended' ? false : undefined,
    limit: PAGE_SIZE,
    offset,
  };

  const { data, isLoading, error } = useAdminUsers(params);

  const handleSearch = (value: string) => {
    setSearch(value);
    setOffset(0);
  };

  const handleFilterChange = () => {
    setOffset(0);
  };

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  return (
    <div>
      <CreateUserDialog open={createOpen} onOpenChange={setCreateOpen} />
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {data?.total !== null && data?.total !== undefined
              ? `${data.total.toLocaleString()} total users`
              : 'All platform users'}
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => setCreateOpen(true)}
        >
          <UserPlus className="h-3.5 w-3.5" />
          Create Team User
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <UserFilters
            search={search}
            tier={tier}
            status={status}
            onSearchChange={handleSearch}
            onTierChange={v => {
              setTier(v);
              handleFilterChange();
            }}
            onStatusChange={v => {
              setStatus(v);
              handleFilterChange();
            }}
          />
        </CardHeader>
        <CardContent className="pt-0">
          <UserListContent
            isLoading={isLoading}
            error={error}
            users={data?.items}
          />

          <UserPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalUsers={data?.total}
            onPreviousPage={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
            onNextPage={() => setOffset(offset + PAGE_SIZE)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
