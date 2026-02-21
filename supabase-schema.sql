-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  video_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('residential', 'commercial', 'hospitality', 'luxury')),
  display_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_title TEXT NOT NULL,
  company TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  project_type TEXT NOT NULL CHECK (project_type IN ('residential', 'commercial', 'hospitality', 'luxury')),
  display_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_visible ON projects(visible);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_testimonials_visible ON testimonials(visible);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view visible projects"
  ON projects FOR SELECT
  USING (visible = true);

CREATE POLICY "Public can view visible testimonials"
  ON testimonials FOR SELECT
  USING (visible = true);

-- Create policies for authenticated admin access (you'll need to set up authentication)
-- For now, we'll allow all operations (you should restrict this in production)
CREATE POLICY "Allow all operations on projects"
  ON projects FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on testimonials"
  ON testimonials FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert sample data for projects
INSERT INTO projects (title, location, description, image_url, video_url, category, visible) VALUES
('Royal Palace Entrance', 'Dubai, UAE', 'Exquisite Calacatta marble installation with gold inlay detailing.', 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?q=80&w=2053&auto=format&fit=crop', '', 'luxury', true),
('Luxury Hotel Lobby', 'London, UK', 'Floor-to-ceiling Statuario marble with custom lighting integration.', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop', '', 'hospitality', true),
('Private Residence', 'New York, USA', 'Bespoke kitchen countertops in rare Emperador marble.', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070&auto=format&fit=crop', '', 'residential', true),
('Corporate Headquarters', 'Singapore', 'Modern minimalist design with Nero Marquina and white Carrara.', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop', '', 'commercial', true);

-- Insert sample data for testimonials
INSERT INTO testimonials (client_name, client_title, company, content, rating, project_type, visible) VALUES
('James Anderson', 'CEO', 'Anderson Luxury Homes', 'Working with Marbrest Stone was an absolute pleasure. Their attention to detail and commitment to quality is unmatched. The marble installation in our flagship property exceeded all expectations.', 5, 'luxury', true),
('Sarah Mitchell', 'Project Manager', 'Four Seasons Hotels', 'The team at Marbrest Stone delivered exceptional craftsmanship for our hotel lobby renovation. Their expertise in handling rare marble varieties and meeting tight deadlines was impressive.', 5, 'hospitality', true),
('David Chen', 'Interior Designer', 'Chen Design Studio', 'I have worked with many stone suppliers, but Marbrest Stone stands out for their professionalism and quality. They transformed our client''s vision into reality with stunning marble work.', 5, 'residential', true);

-- Create products_categories table (replaces stone_types)
CREATE TABLE IF NOT EXISTS products_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create price_type enum
CREATE TYPE price_type AS ENUM ('fixed', 'range', 'quote');

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  product_category_id UUID REFERENCES products_categories(id) ON DELETE SET NULL,
  origin TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  customizable BOOLEAN DEFAULT true,
  price_type price_type DEFAULT 'quote',
  base_price DECIMAL(10, 2),
  min_price DECIMAL(10, 2),
  max_price DECIMAL(10, 2),
  price_unit TEXT DEFAULT 'per sq ft',
  whatsapp_link TEXT,
  display_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for products
CREATE INDEX IF NOT EXISTS idx_products_visible ON products(visible);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(product_category_id);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_category_visible ON products_categories(visible);
CREATE INDEX IF NOT EXISTS idx_products_category_slug ON products_categories(slug);

-- Enable Row Level Security (RLS) for products
ALTER TABLE products_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view visible product categories"
  ON products_categories FOR SELECT
  USING (visible = true);

CREATE POLICY "Public can view visible products"
  ON products FOR SELECT
  USING (visible = true);

-- Create policies for admin access
CREATE POLICY "Allow all operations on products_categories"
  ON products_categories FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on products"
  ON products FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert sample product categories
INSERT INTO products_categories (name, slug, description, display_order, visible) VALUES
('Fountains', 'fountains', 'Elegant marble fountains for gardens and courtyards', 1, true),
('Home Temples', 'home-temples', 'Sacred marble temples for home worship', 2, true),
('Flooring', 'flooring', 'Premium marble flooring tiles and slabs', 3, true),
('Mosque Work', 'mosque-work', 'Traditional Islamic marble artistry and installations', 4, true),
('Coffee Tables', 'coffee-tables', 'Luxury marble coffee tables', 5, true),
('Dining Tables', 'dining-tables', 'Elegant marble dining tables', 6, true),
('Wash Basin', 'wash-basin', 'Designer marble wash basins and vanities', 7, true),
('Bottle Stands', 'bottle-stands', 'Decorative marble bottle stands', 8, true),
('Home Decor', 'home-decor', 'Marble home decor items and accessories', 9, true),
('Other', 'other', 'Other marble products and custom work', 10, true);

-- Insert sample products
INSERT INTO products (name, description, image_url, product_category_id, origin, features, customizable, visible) VALUES
(
  'Marble Garden Fountain',
  'Elegant hand-carved marble fountain perfect for gardens and courtyards. Features intricate detailing.',
  'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2070&auto=format&fit=crop',
  (SELECT id FROM products_categories WHERE slug = 'fountains'),
  'Makrana, Rajasthan',
  ARRAY['Hand Carved', 'Weather Resistant', 'Custom Sizes', 'Traditional Design'],
  true,
  true
),
(
  'Traditional Home Temple',
  'Sacred marble temple for home worship with intricate carvings and traditional architecture.',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop',
  (SELECT id FROM products_categories WHERE slug = 'home-temples'),
  'India',
  ARRAY['Handcrafted', 'Sacred Design', 'Multiple Sizes', 'Custom Engravings'],
  true,
  true
),
(
  'Premium Marble Flooring',
  'Luxurious marble flooring tiles in various sizes and finishes. Perfect for residential and commercial spaces.',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop',
  (SELECT id FROM products_categories WHERE slug = 'flooring'),
  'Multiple Origins',
  ARRAY['Multiple Sizes', 'Various Finishes', 'Easy Installation', 'Bulk Available'],
  true,
  true
),
(
  'Mosque Marble Installation',
  'Traditional Islamic marble artistry for mosques including mihrab, minbar, and decorative panels.',
  'https://images.unsplash.com/photo-1600607687644-c7171b42498b?q=80&w=2053&auto=format&fit=crop',
  (SELECT id FROM products_categories WHERE slug = 'mosque-work'),
  'Makrana, Rajasthan',
  ARRAY['Islamic Patterns', 'Calligraphy Work', 'Custom Design', 'Heritage Craft'],
  true,
  true
),
(
  'Luxury Marble Coffee Table',
  'Stunning marble coffee table with elegant design. Perfect centerpiece for living rooms.',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
  (SELECT id FROM products_categories WHERE slug = 'coffee-tables'),
  'Italy',
  ARRAY['Modern Design', 'Durable', 'Custom Sizes', 'Premium Finish'],
  true,
  true
),
(
  'Marble Dining Table',
  'Elegant marble dining table with custom base options. Available in various marble types.',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2070&auto=format&fit=crop',
  (SELECT id FROM products_categories WHERE slug = 'dining-tables'),
  'India',
  ARRAY['Custom Sizes', 'Multiple Marble Options', 'Luxury Finish', 'Durable'],
  true,
  true
),
(
  'Designer Marble Wash Basin',
  'Handcrafted marble wash basin with modern design. Perfect for luxury bathrooms.',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop',
  (SELECT id FROM products_categories WHERE slug = 'wash-basin'),
  'Makrana, Rajasthan',
  ARRAY['Handcrafted', 'Water Resistant', 'Custom Design', 'Premium Quality'],
  true,
  true
),
(
  'Decorative Bottle Stand',
  'Elegant marble bottle stand for wine or decorative bottles. Adds sophistication to any space.',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070&auto=format&fit=crop',
  (SELECT id FROM products_categories WHERE slug = 'bottle-stands'),
  'India',
  ARRAY['Decorative', 'Compact Design', 'Multiple Styles', 'Gift Ready'],
  true,
  true
);

-- Create settings table for general site configuration
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS for settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public can read settings
CREATE POLICY "Public can view settings"
  ON settings FOR SELECT
  USING (true);

-- Admin can do everything with settings
CREATE POLICY "Allow all operations on settings"
  ON settings FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
('show_product_categories', 'true', 'Show/hide product category filters on the products page'),
('show_portfolio_categories', 'true', 'Show/hide portfolio category filters on the portfolio page'),
('site_name', '"Marbrest Stone"', 'Website name'),
('contact_email', '"info@marbreststone.com"', 'Contact email address');

-- Create contact inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  project_type TEXT,
  budget TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'deal_done')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON contact_inquiries(created_at DESC);

-- Enable RLS for contact_inquiries
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Admin can do everything with inquiries
CREATE POLICY "Allow all operations on contact_inquiries"
  ON contact_inquiries FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create quote requests table
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  requirements TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'quoted', 'converted')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for quote_requests
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_product ON quote_requests(product_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created ON quote_requests(created_at DESC);

-- Enable RLS for quote_requests
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Public can insert quote requests
CREATE POLICY "Public can insert quote requests"
  ON quote_requests FOR INSERT
  WITH CHECK (true);

-- Admin can do everything with quote requests
CREATE POLICY "Allow all operations on quote_requests"
  ON quote_requests FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- MIGRATION: Run this if tables already exist
-- ============================================
-- ALTER TABLE projects ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
-- ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Create price_type enum if it doesn't exist
-- DO $$ BEGIN
--   CREATE TYPE price_type AS ENUM ('fixed', 'range', 'quote');
-- EXCEPTION
--   WHEN duplicate_object THEN null;
-- END $$;

-- Add pricing columns to products table
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS price_type price_type DEFAULT 'quote';
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS base_price DECIMAL(10, 2);
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS min_price DECIMAL(10, 2);
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS max_price DECIMAL(10, 2);
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS price_unit TEXT DEFAULT 'per sq ft';
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS whatsapp_link TEXT;

-- Add images array column to products table (supports up to 5 images)
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- ============================================
-- MIGRATION: From stone_types to products_category
-- ============================================
-- Run these commands if you're migrating from the old stone_types structure

-- Step 1: Create products_categories table if migrating
-- (Already created above in main schema)

-- Step 2: Migrate data from stone_types to products_categories (if stone_types exists)
-- INSERT INTO products_categories (id, name, slug, description, display_order, visible, created_at, updated_at)
-- SELECT id, name, slug, description, display_order, visible, created_at, updated_at
-- FROM stone_types
-- ON CONFLICT (id) DO NOTHING;

-- Step 3: Add product_category_id column to products table
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS product_category_id UUID REFERENCES products_categories(id) ON DELETE SET NULL;

-- Step 4: Copy data from stone_type_id to product_category_id
-- UPDATE products SET product_category_id = stone_type_id WHERE stone_type_id IS NOT NULL;

-- Step 5: Remove stone_type_id column (after verifying data migration)
-- ALTER TABLE products DROP COLUMN IF EXISTS stone_type_id;

-- Step 6: Drop stone_types table (after verifying everything works)
-- DROP TABLE IF EXISTS stone_types CASCADE;

-- ============================================
-- CRAFTSMANSHIP / BEHIND THE SCENES TABLE
-- ============================================

-- Create craftsmanship_items table
CREATE TABLE IF NOT EXISTS craftsmanship_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  video_url TEXT,
  product_category TEXT,
  stone_type TEXT,
  site_location TEXT,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for craftsmanship_items
CREATE INDEX IF NOT EXISTS idx_craftsmanship_visible ON craftsmanship_items(visible);
CREATE INDEX IF NOT EXISTS idx_craftsmanship_product_category ON craftsmanship_items(product_category);
CREATE INDEX IF NOT EXISTS idx_craftsmanship_stone_type ON craftsmanship_items(stone_type);
CREATE INDEX IF NOT EXISTS idx_craftsmanship_site_location ON craftsmanship_items(site_location);
CREATE INDEX IF NOT EXISTS idx_craftsmanship_created_at ON craftsmanship_items(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE craftsmanship_items ENABLE ROW LEVEL SECURITY;

-- Create policies for craftsmanship_items
CREATE POLICY "Public can view visible craftsmanship items"
  ON craftsmanship_items FOR SELECT
  USING (visible = true);

CREATE POLICY "Allow all operations on craftsmanship_items"
  ON craftsmanship_items FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert sample craftsmanship items
INSERT INTO craftsmanship_items (image_url, video_url, product_category, stone_type, site_location, visible) VALUES
(
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070',
  NULL,
  'Temple',
  'White Marble',
  'Jaipur',
  true
),
(
  'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2070',
  NULL,
  'Flooring',
  'Italian Marble',
  'Delhi',
  true
),
(
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=2070',
  NULL,
  'Temple',
  'Makrana Marble',
  'Agra',
  true
),
(
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070',
  NULL,
  'Statue',
  'White Marble',
  'Mumbai',
  true
),
(
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070',
  NULL,
  'Fountain',
  'Granite',
  'Bangalore',
  true
),
(
  'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2070',
  NULL,
  'Flooring',
  'Marble',
  'Chennai',
  true
);
