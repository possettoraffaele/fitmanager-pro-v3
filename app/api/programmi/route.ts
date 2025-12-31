import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const clienteId = searchParams.get('cliente_id')
    const stato = searchParams.get('stato')

    let query = supabase
      .from('programmi')
      .select('*')
      .order('created_at', { ascending: false })

    if (clienteId) {
      query = query.eq('cliente_id', clienteId)
    }

    if (stato) {
      query = query.eq('stato', stato)
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
      .from('programmi')
      .insert([{
        cliente_id: body.cliente_id,
        anamnesi_id: body.anamnesi_id || null,
        misurazione_iniziale_id: body.misurazione_iniziale_id || null,
        tipo: body.tipo,
        stato: body.stato || 'BOZZA',
        prompt_generato: body.prompt_generato || null,
        risposta_ai: body.risposta_ai || null,
        richieste_modifica: body.richieste_modifica || [],
        struttura: body.struttura || null,
        data_inizio: body.data_inizio || null,
        data_fine: body.data_fine || null
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase INSERT error:', error)
      return NextResponse.json({ 
        error: 'Failed to create programma',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
