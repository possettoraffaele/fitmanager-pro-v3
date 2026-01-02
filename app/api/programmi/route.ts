import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Variabili Supabase non configurate');
  }
  return createClient(url, key);
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const clienteId = searchParams.get('cliente_id');
    const stato = searchParams.get('stato');
    const id = searchParams.get('id');

    if (id) {
      const { data, error } = await supabase
        .from('programmi')
        .select(`*, clienti:cliente_id (id, nome, cognome, email)`)
        .eq('id', id)
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }

    let query = supabase
      .from('programmi')
      .select(`*, clienti:cliente_id (id, nome, cognome, email)`)
      .order('created_at', { ascending: false });

    if (clienteId) query = query.eq('cliente_id', clienteId);
    if (stato) query = query.eq('stato', stato);

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Error fetching programmi:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();
    
    const programmaData = {
      cliente_id: body.cliente_id,
      anamnesi_id: body.anamnesi_id || null,
      misurazione_iniziale_id: body.misurazione_iniziale_id || null,
      nome: body.nome,
      tipo: body.tipo || 'base',
      stato: body.stato || 'bozza',
      data_inizio: body.data_inizio || null,
      data_fine: body.data_fine || null,
      contenuto_json: body.contenuto_json || null,
      fase_corrente: body.fase_corrente || null,
      note: body.note || null,
    };

    const { data, error } = await supabase
      .from('programmi')
      .insert([programmaData])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error creating programma:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID programma richiesto' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('programmi')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error updating programma:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID programma richiesto' }, { status: 400 });
    }

    const { error } = await supabase.from('programmi').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting programma:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
