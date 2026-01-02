import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Variabili Supabase non configurate');
  }
  return createClient(url, key);
}

// GET - Lista anamnesi
export async function GET(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const clienteId = searchParams.get('cliente_id');

    if (clienteId) {
      const { data, error } = await supabase
        .from('anamnesi')
        .select('*')
        .eq('cliente_id', clienteId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json(data || []);
    }

    const { data, error } = await supabase
      .from('anamnesi')
      .select(`*, clienti (nome, cognome)`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Errore fetch anamnesi:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Crea nuova anamnesi
export async function POST(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();

    if (!body.cliente_id) {
      return NextResponse.json({ error: 'cliente_id obbligatorio' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('anamnesi')
      .insert([body])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Errore POST anamnesi:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Aggiorna anamnesi
export async function PUT(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID richiesto' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('anamnesi')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Errore PUT anamnesi:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Elimina anamnesi
export async function DELETE(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID richiesto' }, { status: 400 });
    }

    const { error } = await supabase.from('anamnesi').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Errore DELETE anamnesi:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
