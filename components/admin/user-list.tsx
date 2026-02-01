'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users as UsersIcon } from 'lucide-react';
import { formatDate } from '@/utils/format';
import { User } from '@/types/user';

type UserListProps = {
  users: User[];
};

export function UserList({ users }: UserListProps) {
  return (

      <div className=''>
        {users.length === 0 ? (
          <div className="text-center py-10">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <UsersIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No users found</h3>
            <p className="text-muted-foreground">Users will appear here once they register</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="text-right">User ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>

                    <TableCell>
                      <Badge>{user.role}</Badge>
                    </TableCell>

                    <TableCell>{formatDate(user.created_at || '')}</TableCell>

                    <TableCell className="text-right font-mono text-sm text-muted-foreground">{user.id.slice(0, 8)}...</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {users.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Showing {users.length} user{users.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
  );
}
