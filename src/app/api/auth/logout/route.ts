import { NextResponse } from 'next/server'
import { SessionController } from '@/controllers/SessionController'

export async function DELETE() {
  try {
    SessionController.deleteSession()

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
