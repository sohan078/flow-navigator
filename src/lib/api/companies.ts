import { supabase } from "@/integrations/supabase/client";

export interface CompanyRecord {
  id: string;
  name: string;
  logo: string | null;
  description: string | null;
  hq: string | null;
  website: string | null;
  people: number | null;
  revenue: string | null;
  capabilities: string[];
  partners: string[];
  verticals: string[];
  delivery_geo: string[];
  revenue_geo: string[];
  customers: string[];
  investors: string[];
  skills: string[];
  founded: number | null;
  status: "pipeline" | "shortlisted" | "declined" | "recommended";
  ma_score: number;
  ma_scores: {
    founderLiquidity?: number;
    stagnation?: number;
    activity?: number;
    partnerAcquisition?: number;
  };
  social_links: { linkedin?: string; twitter?: string };
  management: { name: string; title: string; linkedin?: string }[];
  created_at: string;
  updated_at: string;
}

export async function listCompanies(filters?: {
  status?: CompanyRecord["status"];
  search?: string;
}) {
  let query = supabase.from("companies").select("*").order("ma_score", { ascending: false });
  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.search) query = query.ilike("name", `%${filters.search}%`);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as CompanyRecord[];
}

export async function getCompany(id: string) {
  const { data, error } = await supabase.from("companies").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as unknown as CompanyRecord | null;
}

/**
 * Compute matching companies for a mandate's criteria (client-side filter on
 * the catalog for now — this will move to a Postgres function / edge function
 * once scoring weights stabilize).
 */
export function matchCompanies(
  companies: CompanyRecord[],
  criteria: {
    capabilities?: string[];
    partners?: string[];
    verticals?: string[];
    revenue_geo?: string[];
    delivery_geo?: string[];
  }
) {
  return companies.filter((c) => {
    const matchAny = (a: string[], b: string[] = []) =>
      b.length === 0 || a.some((x) => b.includes(x));
    return (
      matchAny(c.capabilities, criteria.capabilities) &&
      matchAny(c.partners, criteria.partners) &&
      matchAny(c.verticals, criteria.verticals) &&
      matchAny(c.revenue_geo, criteria.revenue_geo) &&
      matchAny(c.delivery_geo, criteria.delivery_geo)
    );
  });
}
