// src/components/UserTable.tsx
import { User } from '@/types' // Import the User interface

interface UserTableProps {
  users: User[]
}

export default function UserTable({ users }: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">ID</th>
            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">UUID</th>
            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Email</th>
            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Created At</th>
            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Updated At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user.id}
              className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
            >
              <td className="py-4 px-6 text-sm text-gray-700">{user.id}</td>
              <td className="py-4 px-6 text-sm text-gray-700 font-mono">{user.uuid}</td>
              <td className="py-4 px-6 text-sm text-gray-700">{user.email}</td>
              <td className="py-4 px-6 text-sm text-gray-700">
                {new Date(user.created_at).toLocaleString()}
              </td>
              <td className="py-4 px-6 text-sm text-gray-700">
                {new Date(user.updated_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
