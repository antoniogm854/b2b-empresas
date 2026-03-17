-- Database Schema for b2bempresas.com (Industrial B2B SaaS)

-- 1. Profiles (Linked to Auth/Firebase)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT CHECK (role IN ('admin', 'supplier', 'buyer')) DEFAULT 'buyer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Companies (SaaS Tenants)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL, -- For URL: b2bempresas.com/catalogo/slug
    description TEXT,
    logo_url TEXT,
    website TEXT,
    phone_whatsapp TEXT,
    industry TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    tax_id TEXT UNIQUE, -- RUC
    verification_data JSONB, -- Datos de SUNAT/API
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Visual Configuration (PWA Customization)
CREATE TABLE company_designs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    template_id INTEGER DEFAULT 1, -- 1: Industrial, 2: Corporate, 3: Tech
    primary_color TEXT DEFAULT '#0f172a',
    accent_color TEXT DEFAULT '#eab308',
    banner_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Catalog Maestro (Global Database)
CREATE TABLE global_catalog_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    brand TEXT,
    model TEXT,
    technical_specs JSONB,
    category TEXT,
    base_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Products (Company Specific)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    gcm_id UUID REFERENCES global_catalog_master(id), -- Optional link to Master Catalog
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(12,2),
    stock_status TEXT DEFAULT 'available',
    image_url TEXT,
    category TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    ad_expires_at TIMESTAMP WITH TIME ZONE,
    priority_score DECIMAL DEFAULT 0,
    ad_status TEXT DEFAULT 'none' CHECK (ad_status IN ('none', 'pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Leads (Quote Requests)
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    message TEXT,
    quote_items JSONB, -- List of products requested
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')),
    source TEXT DEFAULT 'direct', -- 'direct' or 'marketplace'
    parent_rfq_id UUID, -- For grouping mass RFQs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Row Level Security (RLS) - Basic Example
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Suppliers can manage their own company" ON companies
    FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Public can view verified companies" ON companies
    FOR SELECT USING (is_verified = TRUE);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Suppliers can manage their own products" ON products
    FOR ALL USING (
        company_id IN (SELECT id FROM companies WHERE owner_id = auth.uid())
    );

CREATE POLICY "Public can view active products" ON products
    FOR SELECT USING (is_active = TRUE);

-- 7. Conversations
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    last_message TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(company_id, buyer_id)
);

-- 8. Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Real-time setup
ALTER TABLE messages REPLICA IDENTITY FULL;

-- Policies for Conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own conversations" ON conversations
    FOR SELECT USING (
        auth.uid() = buyer_id OR 
        auth.uid() IN (SELECT owner_id FROM companies WHERE id = company_id)
    );

-- Policies for Messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages from their conversations" ON messages
    FOR SELECT USING (
        conversation_id IN (
            SELECT id FROM conversations WHERE 
            buyer_id = auth.uid() OR 
            company_id IN (SELECT id FROM companies WHERE owner_id = auth.uid())
        )
    );

CREATE POLICY "Users can insert messages in their conversations" ON messages
    FOR INSERT WITH CHECK (
        conversation_id IN (
            SELECT id FROM conversations WHERE 
            buyer_id = auth.uid() OR 
            company_id IN (SELECT id FROM companies WHERE owner_id = auth.uid())
        )
    );

-- Tabla para Analíticas Industriales
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL, -- 'view', 'click_quote', 'chat_start'
    company_id UUID REFERENCES companies(id),
    resource_id TEXT, -- ID del producto, lead o sesión
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Políticas RLS para Analíticas
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies can view their own analytics" 
    ON analytics_events FOR SELECT 
    USING (company_id IN (
        SELECT id FROM companies WHERE id = company_id
    ));

CREATE POLICY "Enable insert for analytics tracking" 
    ON analytics_events FOR INSERT 
    WITH CHECK (true);
-- 10. Push Notifications Subscriptions
CREATE TABLE push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own subscriptions" ON push_subscriptions
    FOR ALL USING (auth.uid() = profile_id);

-- 9. Índices de Optimización
CREATE INDEX IF NOT EXISTS idx_analytics_company_type ON analytics_events(company_id, event_type);
CREATE INDEX IF NOT EXISTS idx_products_company_status ON products(company_id, is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured, ad_status) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_push_profile ON push_subscriptions(profile_id);
