// src/app/LoggedInLayout.tsx
'use client'

import { useAuth } from '@/context/AuthContext'
import Header from '@/components/Header'

interface LoggedInLayoutProps {
  children: React.ReactNode
}

export default function LoggedInLayout({ children }: LoggedInLayoutProps) {
  const { isLoggedIn } = useAuth()

  return (
    <>
      {isLoggedIn && <Header />}
      <main>{children}</main>
    </>
  )
}
