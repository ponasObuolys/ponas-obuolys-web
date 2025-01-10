import { useEffect, useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "@/integrations/supabase/types";

type Role = Database["public"]["Enums"]["app_role"];

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

      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id);

        if (error) {
          console.error("Error fetching user roles:", error);
          setRole(null);
        } else if (data && data.length > 0) {
          // If user has admin role in any of their roles, consider them admin
          const hasAdminRole = data.some(r => r.role === "admin");
          setRole(hasAdminRole ? "admin" : "user");
        } else {
          setRole(null);
        }
      } catch (error) {
        console.error("Error in fetchUserRole:", error);
        setRole(null);
      }
      
      setLoading(false);
    };

    fetchUserRole();
  }, [session, supabase]);

  return { role, loading };
};