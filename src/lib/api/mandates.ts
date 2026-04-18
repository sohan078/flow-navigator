import { supabase } from "@/integrations/supabase/client";

export interface MandateRecord {
  id: string;
  user_id: string;
  title: string;
  strategy: string | null;
  capabilities: string[];
  partners: string[];
  verticals: string[];
  revenue_geo: string[];
  delivery_geo: string[];
  people_scale: string | null;
  est_revenue: string | null;
  hq: string | null;
  go_to_market: string | null;
  description: string | null;
  matching_companies: number;
  created_at: string;
  updated_at: string;
}

export type MandateActivityType =
  | "created"
  | "criteria_update"
  | "company_added"
  | "company_moved"
  | "note"
  | "meeting"
  | "document"
  | "outreach";

export interface MandateActivityRecord {
  id: string;
  mandate_id: string;
  user_id: string;
  type: MandateActivityType;
  description: string;
  metadata: Record<string, unknown>;
  actor_name: string | null;
  created_at: string;
}

export type MandateInput = Omit<
  MandateRecord,
  "id" | "user_id" | "created_at" | "updated_at" | "matching_companies"
> & { matching_companies?: number };

export async function listMandates() {
  const { data, error } = await supabase
    .from("mandates")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as MandateRecord[];
}

export async function getMandate(id: string) {
  const { data, error } = await supabase.from("mandates").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as unknown as MandateRecord | null;
}

export async function createMandate(input: MandateInput) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("You must be signed in to create a mandate.");

  const payload = { ...input, user_id: userData.user.id };
  const { data, error } = await supabase
    .from("mandates")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as MandateRecord;
}

export async function updateMandate(id: string, patch: Partial<MandateInput>) {
  const { data, error } = await supabase
    .from("mandates")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as MandateRecord;
}

export async function deleteMandate(id: string) {
  const { error } = await supabase.from("mandates").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteMandates(ids: string[]) {
  if (ids.length === 0) return;
  const { error } = await supabase.from("mandates").delete().in("id", ids);
  if (error) throw error;
}

export async function listMandateActivities(mandateId: string) {
  const { data, error } = await supabase
    .from("mandate_activities")
    .select("*")
    .eq("mandate_id", mandateId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as MandateActivityRecord[];
}

export async function logMandateActivity(input: {
  mandate_id: string;
  type: MandateActivityType;
  description: string;
  metadata?: Record<string, unknown>;
  actor_name?: string;
}) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("You must be signed in.");

  const { data, error } = await supabase
    .from("mandate_activities")
    .insert({
      mandate_id: input.mandate_id,
      user_id: userData.user.id,
      type: input.type,
      description: input.description,
      metadata: input.metadata ?? {},
      actor_name: input.actor_name ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as unknown as MandateActivityRecord;
}
