// app/api/users/list/route.ts
import { NextResponse } from 'next/server'
import { UserController } from '@/controllers/UserController'

export async function GET(request: Request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10) // Default to page 1
    const limit = parseInt(searchParams.get('limit') || '10', 10) // Default to 10 users per page

    // Validate page and limit
    if (isNaN(page)) {
      return NextResponse.json({ message: 'Invalid page number' }, { status: 400 })
    }
    if (isNaN(limit)) {
      return NextResponse.json({ message: 'Invalid limit value' }, { status: 400 })
    }

    // Fetch paginated users
    const { users, pagination } = await UserController.listUsersPaginated(page, limit)

    return NextResponse.json(
      {
        message: 'Users retrieved',
        users,
        pagination,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ message: 'An error occurred while fetching users' }, { status: 500 })
  }
}
