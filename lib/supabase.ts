import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials mancanti!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions per le operazioni CRUD

// Clienti
export async function getClienti() {
  const { data, error } = await supabase
    .from('clienti')
    .select('*')
    .order('cognome', { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function getCliente(id: string) {
  const { data, error } = await supabase
    .from('clienti')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createCliente(cliente: {
  nome: string;
  cognome: string;
  email: string;
  telefono?: string;
  data_nascita?: string;
  sesso?: string;
  note?: string;
}) {
  const { data, error } = await supabase
    .from('clienti')
    .insert([cliente])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateCliente(id: string, updates: Partial<{
  nome: string;
  cognome: string;
  email: string;
  telefono?: string;
  data_nascita?: string;
  sesso?: string;
  note?: string;
}>) {
  const { data, error } = await supabase
    .from('clienti')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteCliente(id: string) {
  const { error } = await supabase
    .from('clienti')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

// Anamnesi
export async function getAnamnesiByCliente(clienteId: string) {
  const { data, error } = await supabase
    .from('anamnesi')
    .select('*')
    .eq('cliente_id', clienteId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getAnamnesi(id: string) {
  const { data, error } = await supabase
    .from('anamnesi')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createAnamnesi(anamnesi: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('anamnesi')
    .insert([anamnesi])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getLatestAnamnesi(clienteId: string) {
  const { data, error } = await supabase
    .from('anamnesi')
    .select('*')
    .eq('cliente_id', clienteId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// Misurazioni
export async function getMisurazioniByCliente(clienteId: string) {
  const { data, error } = await supabase
    .from('misurazioni')
    .select('*')
    .eq('cliente_id', clienteId)
    .order('data_misurazione', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function createMisurazione(misurazione: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('misurazioni')
    .insert([misurazione])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Programmi
export async function getProgrammiByCliente(clienteId: string) {
  const { data, error } = await supabase
    .from('programmi')
    .select('*')
    .eq('cliente_id', clienteId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getProgramma(id: string) {
  const { data, error } = await supabase
    .from('programmi')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createProgramma(programma: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('programmi')
    .insert([programma])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateProgramma(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('programmi')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
