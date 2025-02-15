// src/components/Header.tsx
import Link from 'next/link'

const Header = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/dashboard/list-users" className="hover:text-blue-200">
                List Users
              </Link>
            </li>
            <li>
              <Link href="/users/create" className="hover:text-blue-200">
                Create User
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
