// src/controllers/UserController.ts
import pgclient from '@/lib/pgclient'
import { v7 as uuidv7 } from 'uuid'
import bcrypt from 'bcrypt'
import { User, Pagination } from '@/types'

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

  async createUser(): Promise<User> {
    this.props.uuid = uuidv7()

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(this.props.password, saltRounds)

    const query = `
      INSERT INTO users (uuid, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, uuid, email, created_at, updated_at
    `

    try {
      const result = await pgclient.query(query, [
        this.props.uuid,
        this.props.email,
        hashedPassword,
      ])
      return result.rows[0] as User
    } catch (error) {
      throw new Error('Error creating user: ' + (error as Error).message)
    }
  }

  static async listuserById(uuid: string): Promise<User | null> {
    const query = `
      SELECT id, uuid, email, created_at, updated_at
      FROM users
      WHERE uuid = $1
    `

    try {
      const result = await pgclient.query(query, [uuid])
      if (result.rowCount === 0) {
        return null
      }
      return result.rows[0] as User
    } catch (error) {
      throw new Error('Error fetching user: ' + (error as Error).message)
    }
  }

  static async listAllUsers(): Promise<User[]> {
    const query = `
      SELECT id, uuid, email, created_at, updated_at
      FROM users
    `

    try {
      const result = await pgclient.query(query)
      return result.rows as User[]
    } catch (error) {
      throw new Error('Error fetching users: ' + (error as Error).message)
    }
  }

  static async listUsersPaginated(
    page: number = 1,
    limit: number = 10
  ): Promise<{ users: User[]; pagination: Pagination }> {
    const offset = (page - 1) * limit

    const usersQuery = `
      SELECT id, uuid, email, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `

    const countQuery = `
      SELECT COUNT(*) as total
      FROM users
    `

    try {
      const [usersResult, countResult] = await Promise.all([
        pgclient.query(usersQuery, [limit, offset]),
        pgclient.query(countQuery),
      ])

      const users = usersResult.rows as User[]
      const total = parseInt(countResult.rows[0].total, 10)
      const totalPages = Math.ceil(total / limit)

      return {
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      }
    } catch (error) {
      throw new Error('Error fetching paginated users: ' + (error as Error).message)
    }
  }

  static async deleteUserById(uuid: string): Promise<{ rowCount: number }> {
    const query = `
      DELETE FROM users
      WHERE uuid = $1
    `

    try {
      const result = await pgclient.query(query, [uuid])
      return { rowCount: result.rowCount ?? 0 }
    } catch (error) {
      throw new Error('Error deleting user: ' + (error as Error).message)
    }
  }

  static async authenticateUser(
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string; user?: User }> {
    const query = `
      SELECT uuid, email, password
      FROM users
      WHERE email = $1
    `

    try {
      const result = await pgclient.query(query, [email.toLowerCase().trim()])
      if (result.rowCount === 0) {
        return { success: false, message: 'Invalid email or password' }
      }

      const user = result.rows[0]
      const isPasswordValid = await this.comparePasswords(password, user.password)

      if (!isPasswordValid) {
        return { success: false, message: 'Invalid email or password' }
      }

      return {
        success: true,
        user: {
          uuid: user.uuid,
          email: user.email,
        } as User,
      }
    } catch (error) {
      throw new Error('Error authenticating user: ' + (error as Error).message)
    }
  }

  private static async comparePasswords(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }
}
