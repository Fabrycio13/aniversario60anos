-- Cria coluna nome_normalizado (gerada automaticamente)
ALTER TABLE confirmacoes ADD COLUMN IF NOT EXISTS nome_normalizado TEXT
  GENERATED ALWAYS AS (lower(btrim(nome))) STORED;

-- Cria índice único (evita duplicatas por nome normalizado)
CREATE UNIQUE INDEX IF NOT EXISTS confirmacoes_nome_norm_unique
  ON confirmacoes (nome_normalizado);

-- Libera INSERT/SELECT/UPDATE pra anon
DROP POLICY IF EXISTS "anon_insert" ON confirmacoes;
DROP POLICY IF EXISTS "anon_select" ON confirmacoes;
DROP POLICY IF EXISTS "anon_update" ON confirmacoes;

CREATE POLICY "anon_insert" ON confirmacoes
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select" ON confirmacoes
  FOR SELECT TO anon USING (true);
CREATE POLICY "anon_update" ON confirmacoes
  FOR UPDATE TO anon USING (true) WITH CHECK (true);