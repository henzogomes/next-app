import { UserController } from '@/controllers/UserController'
import { NextResponse } from 'next/server'
import { validate as uuidValidate } from 'uuid'

export async function DELETE(request: Request, { params }: { params: { uuid: string } }) {
  const userId = params.uuid

  if (!userId || !uuidValidate(userId)) {
    return NextResponse.json({ message: 'Please provide a valid uuid' }, { status: 400 })
  }

  const result = await UserController.deleteUserById(userId)

  if (result.rowCount === 0) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ id: userId, message: 'User found' }, { status: 200 })
}
