import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Lista anamnesi o singola anamnesi
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const clienteId = searchParams.get('cliente_id');

    if (id) {
      // Singola anamnesi
      const { data, error } = await supabase
        .from('anamnesi')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }

    if (clienteId) {
      // Anamnesi di un cliente
      const { data, error } = await supabase
        .from('anamnesi')
        .select('*')
        .eq('cliente_id', clienteId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json(data || []);
    }

    // Tutte le anamnesi
    const { data, error } = await supabase
      .from('anamnesi')
      .select(`
        *,
        clienti (nome, cognome, email)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Errore fetch anamnesi:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// POST - Crea nuova anamnesi
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.cliente_id) {
      return NextResponse.json(
        { error: 'cliente_id obbligatorio' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('anamnesi')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error('Errore creazione anamnesi:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Errore API POST anamnesi:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// PUT - Aggiorna anamnesi
export async function PUT(request: Request) {
  try {
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
  } catch (error) {
    console.error('Errore PUT anamnesi:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// DELETE - Elimina anamnesi
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID richiesto' }, { status: 400 });
    }

    const { error } = await supabase
      .from('anamnesi')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore DELETE anamnesi:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}
