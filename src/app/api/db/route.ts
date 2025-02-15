import { NextResponse } from 'next/server'
import pgclient from '@/lib/pgclient'

// Test the database connection
export async function GET() {
  try {
    const result = await pgclient.query('SELECT NOW()')
    return NextResponse.json({ success: true, time: result.rows[0] })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: 'Database connection failed' },
      { status: 500 }
    )
  }
}
