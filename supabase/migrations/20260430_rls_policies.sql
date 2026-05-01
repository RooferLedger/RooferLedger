-- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE line_items ENABLE ROW LEVEL SECURITY;

-- 2. USERS TABLE POLICIES
-- Users can only read and update their own user record.
CREATE POLICY "Users can view their own record" ON users 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own record" ON users 
  FOR UPDATE USING (auth.uid() = id);

-- 3. ORGANIZATIONS TABLE POLICIES
-- Users can only view and update the organization they belong to.
CREATE POLICY "Users can view their organization" ON organizations 
  FOR SELECT USING (
    id IN (SELECT organization_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their organization" ON organizations 
  FOR UPDATE USING (
    id IN (SELECT organization_id FROM users WHERE id = auth.uid())
  );

-- 4. CLIENTS TABLE POLICIES
-- Users can perform all actions (Select, Insert, Update, Delete) on clients within their organization.
CREATE POLICY "Users can manage their org clients" ON clients 
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid())
  );

-- 5. INVOICES TABLE POLICIES
-- Users can perform all actions on invoices within their organization.
CREATE POLICY "Users can manage their org invoices" ON invoices 
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid())
  );

-- 6. LINE ITEMS TABLE POLICIES
-- Users can manage line items only if they belong to an invoice owned by their organization.
CREATE POLICY "Users can manage line items for their invoices" ON line_items 
  FOR ALL USING (
    invoice_id IN (
      SELECT id FROM invoices WHERE organization_id IN (
        SELECT organization_id FROM users WHERE id = auth.uid()
      )
    )
  );
