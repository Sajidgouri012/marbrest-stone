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

-- Create stone_types table (categories for products)
CREATE TABLE IF NOT EXISTS stone_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  stone_type_id UUID REFERENCES stone_types(id) ON DELETE SET NULL,
  origin TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  customizable BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for products
CREATE INDEX IF NOT EXISTS idx_products_visible ON products(visible);
CREATE INDEX IF NOT EXISTS idx_products_stone_type ON products(stone_type_id);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stone_types_visible ON stone_types(visible);
CREATE INDEX IF NOT EXISTS idx_stone_types_slug ON stone_types(slug);

-- Enable Row Level Security (RLS) for products
ALTER TABLE stone_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view visible stone types"
  ON stone_types FOR SELECT
  USING (visible = true);

CREATE POLICY "Public can view visible products"
  ON products FOR SELECT
  USING (visible = true);

-- Create policies for admin access
CREATE POLICY "Allow all operations on stone_types"
  ON stone_types FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on products"
  ON products FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert sample stone types
INSERT INTO stone_types (name, slug, description, display_order, visible) VALUES
('White Marble', 'white-marble', 'Premium white marble varieties including Makrana and Italian Statuario', 1, true),
('Colored Marble', 'colored-marble', 'Elegant colored marble including Emperador, Verde, and more', 2, true),
('Granite', 'granite', 'Durable granite in various colors and patterns', 3, true),
('Onyx', 'onyx', 'Translucent onyx perfect for backlit installations', 4, true),
('Custom Work', 'custom', 'Bespoke inlay work, tiles, and custom designs', 5, true);

-- Insert sample products
INSERT INTO products (name, description, image_url, stone_type_id, origin, features, customizable, visible) VALUES
(
  'Makrana White Marble',
  'The same pristine white marble used in the Taj Mahal. Known for its exceptional purity and luminous quality.',
  'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2070&auto=format&fit=crop',
  (SELECT id FROM stone_types WHERE slug = 'white-marble'),
  'Makrana, Rajasthan',
  ARRAY['Taj Mahal Quality', 'Pure White', 'High Durability', 'Polished Finish'],
  true,
  true
),
(
  'Italian Statuario Marble',
  'Premium white marble with distinctive grey veining. Perfect for luxury countertops and feature walls.',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop',
  (SELECT id FROM stone_types WHERE slug = 'white-marble'),
  'Carrara, Italy',
  ARRAY['Grey Veining', 'Luxury Grade', 'Versatile Use', 'Custom Sizes'],
  true,
  true
),
(
  'Emperador Brown Marble',
  'Rich brown marble with intricate white veining. Adds warmth and sophistication to any space.',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop',
  (SELECT id FROM stone_types WHERE slug = 'colored-marble'),
  'Spain',
  ARRAY['Rich Brown Tone', 'White Veining', 'Elegant Finish', 'Heat Resistant'],
  true,
  true
),
(
  'Calacatta Gold Marble',
  'Luxurious white marble with bold gold and grey veining. The epitome of elegance and prestige.',
  'https://images.unsplash.com/photo-1600607687644-c7171b42498b?q=80&w=2053&auto=format&fit=crop',
  (SELECT id FROM stone_types WHERE slug = 'white-marble'),
  'Italy',
  ARRAY['Gold Veining', 'Premium Quality', 'Statement Piece', 'Bespoke Cuts'],
  true,
  true
),
(
  'Black Galaxy Granite',
  'Stunning black granite with golden speckles resembling a starry night sky. Extremely durable.',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
  (SELECT id FROM stone_types WHERE slug = 'granite'),
  'India',
  ARRAY['Golden Speckles', 'Ultra Durable', 'Low Maintenance', 'Scratch Resistant'],
  true,
  true
),
(
  'Green Onyx Slabs',
  'Translucent green onyx with natural patterns. Perfect for backlit features and luxury installations.',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2070&auto=format&fit=crop',
  (SELECT id FROM stone_types WHERE slug = 'onyx'),
  'Pakistan',
  ARRAY['Translucent', 'Backlit Compatible', 'Unique Patterns', 'Luxury Appeal'],
  true,
  true
),
(
  'Custom Inlay Work',
  'Bespoke marble inlay designs with semi-precious stones. Traditional craftsmanship meets modern design.',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop',
  (SELECT id FROM stone_types WHERE slug = 'custom'),
  'Makrana, Rajasthan',
  ARRAY['Handcrafted', 'Semi-Precious Stones', 'Custom Designs', 'Heritage Technique'],
  true,
  true
),
(
  'Marble Flooring Tiles',
  'Premium marble tiles in various sizes and finishes. Perfect for residential and commercial flooring.',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070&auto=format&fit=crop',
  (SELECT id FROM stone_types WHERE slug = 'custom'),
  'Multiple Origins',
  ARRAY['Multiple Sizes', 'Various Finishes', 'Easy Installation', 'Bulk Available'],
  true,
  true
);

-- ============================================
-- MIGRATION: Run this if tables already exist
-- Adds display_order column to existing tables
-- ============================================
-- ALTER TABLE projects ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
-- ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
