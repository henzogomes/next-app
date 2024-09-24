import pgclient from '@/app/lib/pgclient'
import { v7 as uuidv7 } from 'uuid'
import bcrypt from 'bcrypt'

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

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(this.props.password, saltRounds)

    const query = `INSERT INTO users
                    (uuid, email, password)
                   VALUES ($1, $2, $3)
                   RETURNING id, uuid, email, created_at, updated_at`

    try {
      return await pgclient.query(query, [this.props.uuid, this.props.email, hashedPassword])
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

  static async authenticateUser(email: string, password: string) {
    const query = `SELECT uuid, email, password FROM users WHERE email = $1`
    const result = await pgclient.query(query, [email.toLowerCase().trim()])

    if (result.rowCount === 0) {
      return { success: false, message: 'Invalid email or password' }
    }

    const user = result.rows[0]

    const isPasswordValid = await this.comparePasswords(password, user.password)

    if (!isPasswordValid) {
      return { success: false, message: 'Invalid email or password' }
    }

    return { success: true, user: { uuid: user.uuid, email: user.email } }
  }

  private static async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }
}
