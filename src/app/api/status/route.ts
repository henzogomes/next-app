import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const msg = searchParams.get('msg')

  if (msg) {
    return NextResponse.json({ message: msg }, { status: 200 })
  } else {
    return NextResponse.json({ message: 'message not found' }, { status: 400 })
  }
}

// Handle POST request
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { msg } = body

    if (msg && msg === 'ok') {
      return NextResponse.json({ message: msg }, { status: 200 })
    } else {
      return NextResponse.json({ message: 'not ok' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: `Invalid JSON ${error}` }, { status: 400 })
  }
}
