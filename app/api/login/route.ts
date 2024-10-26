import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const body = await request.json()
  const { user_email, user_password } = body

  try {
    const response = await fetch('https://api.solvor.com.br/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_email, user_password }),
    })

    if (response.ok) {
      const data = await response.json()
      const cookieStore = cookies()
      cookieStore.set('authToken', data.token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      })

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 401 })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}