import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {}
  };

  // Check 1: Environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const appPassword = process.env.APP_PASSWORD;

  diagnostics.checks = {
    NEXT_PUBLIC_SUPABASE_URL: {
      configured: !!supabaseUrl,
      value: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING',
      valid: supabaseUrl?.includes('supabase.co') || false
    },
    NEXT_PUBLIC_SUPABASE_ANON_KEY: {
      configured: !!supabaseKey,
      value: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'MISSING',
      valid: supabaseKey?.startsWith('eyJ') || false
    },
    ANTHROPIC_API_KEY: {
      configured: !!anthropicKey,
      value: anthropicKey ? 'SET (hidden)' : 'MISSING'
    },
    APP_PASSWORD: {
      configured: !!appPassword,
      value: appPassword ? 'SET (hidden)' : 'MISSING'
    }
  };

  // Check 2: Database connection
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Test connection with a simple query
      const { data: clienti, error: clientiError } = await supabase
        .from('clienti')
        .select('id')
        .limit(1);

      diagnostics.database = {
        connection: clientiError ? 'FAILED' : 'OK',
        error: clientiError?.message || null,
        errorCode: clientiError?.code || null,
        errorHint: clientiError?.hint || null
      };

      // Check all tables
      const tables = ['clienti', 'anamnesi', 'misurazioni', 'programmi', 'sessioni_allenamento'];
      diagnostics.tables = {};

      for (const table of tables) {
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .limit(1);
        
        (diagnostics.tables as Record<string, unknown>)[table] = {
          exists: !error,
          error: error?.message || null,
          code: error?.code || null
        };
      }

    } catch (e: any) {
      diagnostics.database = {
        connection: 'ERROR',
        error: e.message
      };
    }
  } else {
    diagnostics.database = {
      connection: 'SKIPPED',
      reason: 'Missing Supabase credentials'
    };
  }

  // Overall status
  const allChecks = diagnostics.checks as Record<string, { configured: boolean; valid?: boolean }>;
  const configOk = allChecks.NEXT_PUBLIC_SUPABASE_URL?.valid && 
                   allChecks.NEXT_PUBLIC_SUPABASE_ANON_KEY?.valid;
  
  const dbOk = (diagnostics.database as any)?.connection === 'OK';

  diagnostics.status = {
    configuration: configOk ? '✅ OK' : '❌ PROBLEMI',
    database: dbOk ? '✅ OK' : '❌ PROBLEMI',
    overall: configOk && dbOk ? '✅ TUTTO OK' : '❌ RICHIEDE ATTENZIONE'
  };

  // Recommendations
  diagnostics.recommendations = [];
  
  if (!allChecks.NEXT_PUBLIC_SUPABASE_URL?.configured) {
    (diagnostics.recommendations as string[]).push('Configura NEXT_PUBLIC_SUPABASE_URL nelle variabili d\'ambiente di Vercel');
  }
  if (!allChecks.NEXT_PUBLIC_SUPABASE_ANON_KEY?.configured) {
    (diagnostics.recommendations as string[]).push('Configura NEXT_PUBLIC_SUPABASE_ANON_KEY nelle variabili d\'ambiente di Vercel');
  }
  if (configOk && !dbOk) {
    (diagnostics.recommendations as string[]).push('Esegui lo script database-fix.sql in Supabase SQL Editor');
  }

  return NextResponse.json(diagnostics, { 
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
