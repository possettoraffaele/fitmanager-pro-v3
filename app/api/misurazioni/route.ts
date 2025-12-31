import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const clienteId = searchParams.get('cliente_id')

    let query = supabase
      .from('misurazioni')
      .select('*')
      .order('data_misurazione', { ascending: false })

    if (clienteId) {
      query = query.eq('cliente_id', clienteId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from('misurazioni')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('Supabase INSERT error:', error)
      return NextResponse.json({ 
        error: 'Failed to create misurazione',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
