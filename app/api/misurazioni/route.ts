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

// GET - Lista misurazioni
export async function GET(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const clienteId = searchParams.get('cliente_id');

    if (clienteId) {
      const { data, error } = await supabase
        .from('misurazioni')
        .select('*')
        .eq('cliente_id', clienteId)
        .order('data_misurazione', { ascending: false });

      if (error) throw error;
      return NextResponse.json(data || []);
    }

    const { data, error } = await supabase
      .from('misurazioni')
      .select(`*, clienti (nome, cognome)`)
      .order('data_misurazione', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Errore fetch misurazioni:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Crea nuova misurazione
export async function POST(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();

    if (!body.cliente_id || !body.peso_kg) {
      return NextResponse.json(
        { error: 'cliente_id e peso_kg obbligatori' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('misurazioni')
      .insert([{
        ...body,
        data_misurazione: body.data_misurazione || new Date().toISOString().split('T')[0]
      }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Errore POST misurazioni:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Elimina misurazione
export async function DELETE(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID richiesto' }, { status: 400 });
    }

    const { error } = await supabase.from('misurazioni').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Errore DELETE misurazioni:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
