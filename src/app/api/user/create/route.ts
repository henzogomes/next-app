import { UserController } from '@/controllers/UserController'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const user = new UserController({
      email,
      password,
    })

    const result = await user.createUser()

    return NextResponse.json({ success: true, user: result }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}
