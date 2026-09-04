-- Tabela para a equipe de organizacao
CREATE TABLE IF NOT EXISTS organizacao (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  funcao TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Libera INSERT/SELECT/UPDATE/DELETE pra anon
DROP POLICY IF EXISTS "anon_insert_org" ON organizacao;
CREATE POLICY "anon_insert_org" ON organizacao
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_org" ON organizacao;
CREATE POLICY "anon_select_org" ON organizacao
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "anon_update_org" ON organizacao;
CREATE POLICY "anon_update_org" ON organizacao
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_org" ON organizacao;
CREATE POLICY "anon_delete_org" ON organizacao
  FOR DELETE TO anon USING (true);
