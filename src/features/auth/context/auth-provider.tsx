import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import type {
  AuthContextType,
  LoginData,
  SignupData,
  UpdateUserData,
  User,
} from "../types";
import { AuthContext } from "./auth-context";

const mapUser = (su: SupabaseUser): User => {
  const firstName = su.user_metadata?.first_name ?? "";
  const lastName = su.user_metadata?.last_name ?? "";
  const email = su.email ?? "";

  const name =
    [firstName, lastName].filter(Boolean).join(" ") || email || "User";

  return {
    id: su.id,
    name,
    email,
    firstName,
    lastName,
  };
};

const parseName = (fullName: string) => {
  const parts = fullName.trim().split(" ");
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      if (error) {
        console.error("Auth session error:", error.message);
        supabase.auth.signOut();
      }
      setUser(session?.user ? mapUser(session.user) : null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ? mapUser(session.user) : null);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (data: LoginData) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) throw new Error("auth.login.invalidCredentials");
    toast.success("Logged in successfully!");
  };

  const signup = async (data: SignupData) => {
    const { firstName, lastName } = parseName(data.name);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { first_name: firstName, last_name: lastName } },
    });

    if (error) {
      throw new Error(
        error.message.toLowerCase().includes("already")
          ? "auth.signup.alreadyExists"
          : error.message,
      );
    }

    toast.success("Account created successfully!");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

  const updateUser = async (data: UpdateUserData) => {
    const updatePayload: {
      data?: { first_name: string; last_name: string };
      email?: string;
      password?: string;
    } = {};

    if (data.name && user) {
      const { firstName, lastName } = parseName(data.name);
      updatePayload.data = { first_name: firstName, last_name: lastName };

      try {
        await supabase
          .from("profiles")
          .upsert(
            { id: user.id, first_name: firstName, last_name: lastName },
            { onConflict: "id" },
          );
      } catch {
        console.warn("Could not sync profile to table due to RLS, continuing...");
      }
    }

    if (data.email) updatePayload.email = data.email;
    if (data.password) updatePayload.password = data.password;

    const { error } = await supabase.auth.updateUser(updatePayload);
    if (error) throw error;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
