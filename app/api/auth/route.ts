import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const correctPassword = process.env.APP_PASSWORD || 'ShakalakaA1.!'
    
    if (password === correctPassword) {
      const response = NextResponse.json({ success: true })
      response.cookies.set('auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 giorni
      })
      return response
    }
    
    return NextResponse.json({ error: 'Password errata' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: 'Errore server' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('auth')
  return response
}
