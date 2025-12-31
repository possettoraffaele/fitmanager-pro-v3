import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const attivo = searchParams.get('attivo')
    
    let query = supabase.from('clienti').select('*').order('cognome', { ascending: true })
    
    if (attivo === 'true') {
      query = query.eq('attivo', true)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Supabase GET error:', error)
      throw error
    }
    
    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error('GET /api/clients error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch clients',
      details: error.message,
      code: error.code 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Log environment variables (solo per debug)
    console.log('ENV CHECK:', {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      urlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20)
    })

    const body = await request.json()
    console.log('POST /api/clients - Body:', body)
    
    const { data, error } = await supabase
      .from('clienti')
      .insert([body])
      .select()
      .single()
    
    if (error) {
      console.error('Supabase INSERT error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      throw error
    }

    console.log('POST /api/clients - Success:', data)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('POST /api/clients - Complete error:', {
      message: error.message,
      code: error.code,
      details: error.details,
      stack: error.stack
    })
    
    return NextResponse.json({ 
      error: 'Failed to create client',
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    }, { status: 500 })
  }
}
