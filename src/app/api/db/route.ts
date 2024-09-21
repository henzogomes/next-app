import { NextResponse } from 'next/server'
import { query } from '../../lib/db' // Adjust the import path as needed

// Test the database connection
export async function GET() {
  try {
    const result = await query('SELECT NOW()') // A simple query to test the connection
    return NextResponse.json({ success: true, time: result })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: 'Database connection failed' },
      { status: 500 }
    )
  }
}
