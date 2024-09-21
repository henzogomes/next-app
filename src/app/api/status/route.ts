import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const msg = searchParams.get('msg')

  if (msg) {
    return NextResponse.json({ status: 200, message: msg })
  } else {
    return NextResponse.json({ status: 400, message: 'message not found' })
  }
}

// Handle POST request
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { msg } = body

    if (msg && msg === 'ok') {
      return NextResponse.json({ status: 200, message: msg })
    } else {
      return NextResponse.json({ status: 400, message: 'not ok' })
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Invalid JSON ${error}` },
      { status: 400 }
    )
  }
}
