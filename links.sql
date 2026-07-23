-- Tabela pra salvar os links gerados
CREATE TABLE IF NOT EXISTS links_gerados (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  link TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Libera INSERT/SELECT pra anon (já que é seu uso pessoal)
DROP POLICY IF EXISTS "anon_insert_links" ON links_gerados;
CREATE POLICY "anon_insert_links" ON links_gerados
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_links" ON links_gerados;
CREATE POLICY "anon_select_links" ON links_gerados
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "anon_delete_links" ON links_gerados;
CREATE POLICY "anon_delete_links" ON links_gerados
  FOR DELETE TO anon USING (true);