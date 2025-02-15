export const SESSION_COOKIE = 'session'

//middleware
export const PROTECTED_PAGE_ROUTES = ['/dashboard']
export const PUBLIC_PAGE_ROUTES = ['/login', '/signup', '/']
export const API_ROUTE = '/api'
export const AUTH_API_ROUTE = `${API_ROUTE}/auth`
export const PUBLIC_API_ROUTES = [`${API_ROUTE}/db`, `${API_ROUTE}/status`]
