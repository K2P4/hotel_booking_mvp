import { getAllUsers } from '@/actions/users';
import { UserList } from '@/components/admin/user-list';
import { toast } from 'sonner';

export default async function AdminUsersPage() {
  const { users, error } = await getAllUsers();

  if (error) {
    toast.error(error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">View all registered users and their details</p>
      </div>

      {users?.length == 0 ? (
        <div className="text-center py-12 border rounded-lg bg-white">
          <p className="text-muted-foreground">No users found</p>
        </div>
      ) : (
        <UserList users={users || []} />
      )}
    </div>
  );
}
