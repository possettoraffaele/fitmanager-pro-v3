import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    const APP_PASSWORD = process.env.APP_PASSWORD;
    
    if (!APP_PASSWORD) {
      console.error('APP_PASSWORD non configurata');
      return NextResponse.json(
        { error: 'Configurazione server mancante' },
        { status: 500 }
      );
    }
    
    if (password === APP_PASSWORD) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Password non corretta' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Errore auth:', error);
    return NextResponse.json(
      { error: 'Errore durante l\'autenticazione' },
      { status: 500 }
    );
  }
}
