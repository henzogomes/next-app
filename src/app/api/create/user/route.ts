import { userController } from '@/controllers/userController'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const user = new userController({
      email,
      password,
    })

    const result = await user.createUser()

    //remove password from result
    delete result.rows[0].password

    console.log(result)

    return NextResponse.json({ success: true, user: result.rows[0] })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}
