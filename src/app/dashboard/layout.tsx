// src/app/dashboard/layout.tsx
import LoggedInLayout from '../LoggedInLayout'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <LoggedInLayout>{children}</LoggedInLayout>
}
