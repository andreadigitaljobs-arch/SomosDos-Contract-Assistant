-- Script de configuración para Contratos SomosDos
-- Ejecuta esto en el SQL Editor de Supabase

-- 1. Crear la tabla de acuerdos
CREATE TABLE IF NOT EXISTS public.agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    html_content JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    client_signed BOOLEAN DEFAULT FALSE
);

-- 2. Habilitar RLS (Seguridad a nivel de fila)
ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;

-- 3. Crear política de acceso público (Lectura y Escritura)
-- Nota: En producción podrías querer restringir esto, pero para esta herramienta es necesario acceso público mediante anon key.
CREATE POLICY "Public Access All" ON public.agreements 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 4. Índices para mejorar la velocidad de búsqueda en la biblioteca
CREATE INDEX IF NOT EXISTS idx_agreements_created_at ON public.agreements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agreements_client_name ON public.agreements(client_name);
