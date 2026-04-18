CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $func$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $func$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo TEXT,
  description TEXT,
  hq TEXT,
  website TEXT,
  people INTEGER,
  revenue TEXT,
  capabilities TEXT[] DEFAULT '{}',
  partners TEXT[] DEFAULT '{}',
  verticals TEXT[] DEFAULT '{}',
  delivery_geo TEXT[] DEFAULT '{}',
  revenue_geo TEXT[] DEFAULT '{}',
  customers TEXT[] DEFAULT '{}',
  investors TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  founded INTEGER,
  status TEXT NOT NULL DEFAULT 'recommended' CHECK (status IN ('pipeline','shortlisted','declined','recommended')),
  ma_score INTEGER DEFAULT 0,
  ma_scores JSONB DEFAULT '{}'::jsonb,
  social_links JSONB DEFAULT '{}'::jsonb,
  management JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "companies_select_all" ON public.companies FOR SELECT USING (true);
CREATE POLICY "companies_insert_auth" ON public.companies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "companies_update_auth" ON public.companies FOR UPDATE TO authenticated USING (true);
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_companies_status ON public.companies(status);
CREATE INDEX idx_companies_ma_score ON public.companies(ma_score DESC);

CREATE TABLE public.mandates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  strategy TEXT,
  capabilities TEXT[] DEFAULT '{}',
  partners TEXT[] DEFAULT '{}',
  verticals TEXT[] DEFAULT '{}',
  revenue_geo TEXT[] DEFAULT '{}',
  delivery_geo TEXT[] DEFAULT '{}',
  people_scale TEXT,
  est_revenue TEXT,
  hq TEXT,
  go_to_market TEXT,
  description TEXT,
  matching_companies INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.mandates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mandates_select_own" ON public.mandates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "mandates_insert_own" ON public.mandates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "mandates_update_own" ON public.mandates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "mandates_delete_own" ON public.mandates FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_mandates_updated_at BEFORE UPDATE ON public.mandates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_mandates_user_id ON public.mandates(user_id);

CREATE TABLE public.mandate_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mandate_id UUID NOT NULL REFERENCES public.mandates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  actor_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.mandate_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activities_select_own" ON public.mandate_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "activities_insert_own" ON public.mandate_activities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_mandate_activities_mandate_id ON public.mandate_activities(mandate_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.log_mandate_created() RETURNS TRIGGER AS $func$ BEGIN INSERT INTO public.mandate_activities (mandate_id, user_id, type, description, metadata) VALUES (NEW.id, NEW.user_id, 'created', 'Mandate created: ' || NEW.title, jsonb_build_object('title', NEW.title, 'strategy', NEW.strategy)); RETURN NEW; END; $func$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
CREATE TRIGGER mandates_log_created AFTER INSERT ON public.mandates FOR EACH ROW EXECUTE FUNCTION public.log_mandate_created();