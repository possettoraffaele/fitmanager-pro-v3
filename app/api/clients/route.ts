import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client with validation
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error('Variabili Supabase non configurate. Controlla NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY su Vercel');
  }
  
  return createClient(url, key);
}

// GET - Lista tutti i clienti
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('clienti')
      .select('*')
      .order('cognome', { ascending: true });

    if (error) {
      console.error('Errore fetch clienti:', error);
      return NextResponse.json({ 
        error: error.message,
        code: error.code,
        hint: error.hint || 'Verifica che la tabella clienti esista in Supabase'
      }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Errore API clienti:', error);
    return NextResponse.json({ 
      error: error.message || 'Errore server',
      type: 'configuration_error'
    }, { status: 500 });
  }
}

// POST - Crea nuovo cliente
export async function POST(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();
    
    const { nome, cognome, email, telefono, data_nascita, sesso, note } = body;

    if (!nome || !cognome || !email) {
      return NextResponse.json(
        { error: 'Nome, cognome e email sono obbligatori' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('clienti')
      .insert([{
        nome,
        cognome,
        email,
        telefono: telefono || null,
        data_nascita: data_nascita || null,
        sesso: sesso || null,
        note: note || null
      }])
      .select()
      .single();

    if (error) {
      console.error('Errore creazione cliente:', error);
      return NextResponse.json({ 
        error: error.message,
        code: error.code
      }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Errore API POST clienti:', error);
    return NextResponse.json({ 
      error: error.message || 'Errore server' 
    }, { status: 500 });
  }
}

// PUT - Aggiorna cliente
export async function PUT(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID richiesto' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('clienti')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Errore aggiornamento cliente:', error);
      return NextResponse.json({ 
        error: error.message,
        code: error.code
      }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Errore API PUT clienti:', error);
    return NextResponse.json({ 
      error: error.message || 'Errore server' 
    }, { status: 500 });
  }
}

// DELETE - Elimina cliente
export async function DELETE(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID richiesto' }, { status: 400 });
    }

    const { error } = await supabase
      .from('clienti')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Errore eliminazione cliente:', error);
      return NextResponse.json({ 
        error: error.message,
        code: error.code
      }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Errore API DELETE clienti:', error);
    return NextResponse.json({ 
      error: error.message || 'Errore server' 
    }, { status: 500 });
  }
}
