-- Create enum for house damage types
CREATE TYPE public.damage_type AS ENUM ('minor', 'partial', 'severe', 'total_loss');

-- Create enum for support types
CREATE TYPE public.support_type AS ENUM ('materials', 'money', 'labour');

-- Create enum for volunteer skills
CREATE TYPE public.volunteer_skill AS ENUM ('carpentry', 'electrical', 'plumbing', 'masonry', 'general');

-- Victims table
CREATE TABLE public.victims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  district TEXT NOT NULL,
  ds_division TEXT NOT NULL,
  gn_division TEXT NOT NULL,
  damage_type damage_type NOT NULL,
  family_members INTEGER NOT NULL DEFAULT 1,
  essential_needs TEXT[],
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Donors table
CREATE TABLE public.donors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  support_type support_type NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Volunteers table
CREATE TABLE public.volunteers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  skills volunteer_skill[] NOT NULL,
  availability_start DATE,
  availability_end DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.victims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;

-- Public insert policies (anyone can register)
CREATE POLICY "Anyone can register as victim" ON public.victims FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can register as donor" ON public.donors FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can register as volunteer" ON public.volunteers FOR INSERT WITH CHECK (true);

-- Public read policies (for admin viewing - will be secured later)
CREATE POLICY "Anyone can view victims" ON public.victims FOR SELECT USING (true);
CREATE POLICY "Anyone can view donors" ON public.donors FOR SELECT USING (true);
CREATE POLICY "Anyone can view volunteers" ON public.volunteers FOR SELECT USING (true);

-- Create storage bucket for victim photos
INSERT INTO storage.buckets (id, name, public) VALUES ('victim-photos', 'victim-photos', true);

-- Storage policy for uploads
CREATE POLICY "Anyone can upload victim photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'victim-photos');
CREATE POLICY "Anyone can view victim photos" ON storage.objects FOR SELECT USING (bucket_id = 'victim-photos');