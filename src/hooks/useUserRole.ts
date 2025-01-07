import { useEffect, useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "@/integrations/supabase/types";

type Role = "admin" | "user";

export const useUserRole = () => {
  const session = useSession();
  const supabase = useSupabaseClient<Database>();
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!session?.user) {
        setRole(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        setRole(null);
      } else {
        setRole(data.role as Role);
      }
      setLoading(false);
    };

    fetchUserRole();
  }, [session, supabase]);

  return { role, loading };
};