import pgclient from '@/app/lib/pgclient'
import { v7 as uuidv7 } from 'uuid'

export interface UserProps {
  email: string
  password: string
  uuid?: string
  created_at?: string
  updated_at?: string
}

export class UserController {
  private props: UserProps

  constructor(props: UserProps) {
    this.props = {
      ...props,
      email: props.email.trim().toLowerCase(),
    }
  }

  async createUser() {
    this.props.uuid = uuidv7()

    const query = `INSERT INTO users
        (uuid, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, uuid, email, created_at, updated_at`

    try {
      return await pgclient.query(query, [this.props.uuid, this.props.email, this.props.password])
    } catch (error: unknown) {
      throw new Error('Error creating user: ' + (error as Error).message)
    }
  }

  static async listuserById(uuid: string) {
    const query = `SELECT id,
                          uuid,
                          email,
                          created_at,
                          updated_at
                   FROM users
                   WHERE uuid = $1`

    try {
      return await pgclient.query(query, [uuid])
    } catch (error) {
      throw new Error('Error fetching user: ' + (error as Error).message)
    }
  }

  static async deleteUserById(uuid: string) {
    const query = `DELETE FROM users
                   WHERE uuid = $1`

    try {
      return await pgclient.query(query, [uuid])
    } catch (error) {
      throw new Error('Error deleting user: ' + (error as Error).message)
    }
  }
}
