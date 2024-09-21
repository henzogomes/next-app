import pgclient from '@/app/lib/pgclient'
import { v7 as uuidv7 } from 'uuid'

export interface userProps {
  email: string
  password: string
  uuid?: string
  created_at?: string
  updated_at?: string
}

export class userController {
  private props: userProps

  constructor(props: userProps) {
    this.props = props
  }

  async createUser() {
    this.props.uuid = uuidv7()

    const query =
      'INSERT INTO users (uuid, email, password) VALUES ($1, $2, $3) RETURNING *'

    const result = await pgclient.query(query, [
      this.props.uuid,
      this.props.email,
      this.props.password,
    ])

    return result
  }
}
