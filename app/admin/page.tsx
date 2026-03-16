import { ShieldCheck, Users } from "lucide-react";

import { AdminTabs } from "@/components/admin-tabs";
import { createAdminClient, requireAdminUser } from "@/lib/supabase/admin";
import type { AdminUserView, ContactMessage, TestGeneration, UserRoleRecord } from "@/lib/types";

export default async function AdminPage() {
  const currentUser = await requireAdminUser();
  const supabase = createAdminClient();

  const [
    { data: usersData, error: usersError },
    { data: roleRows },
    { data: suitesData },
    { data: contactRows, error: contactError }
  ] = await Promise.all([
    supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    }),
    supabase.from("user_roles").select("*"),
    supabase.from("test_generations").select("*").order("created_at", { ascending: false }),
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false })
  ]);

  if (usersError) {
    throw new Error(usersError.message);
  }

  if (contactError) {
    throw new Error(contactError.message);
  }

  const roleMap = new Map(
    ((roleRows as UserRoleRecord[] | null) || []).map((row) => [row.user_id, row.role])
  );
  const suitesByUser = new Map<string, TestGeneration[]>();

  ((suitesData as TestGeneration[] | null) || []).forEach((suite) => {
    const current = suitesByUser.get(suite.user_id) || [];
    current.push(suite);
    suitesByUser.set(suite.user_id, current);
  });

  const users: AdminUserView[] = (usersData?.users || []).map((user) => ({
    id: user.id,
    email: user.email || "Unknown user",
    role: roleMap.get(user.id) || "user",
    created_at: user.created_at,
    email_confirmed_at: user.email_confirmed_at,
    last_sign_in_at: user.last_sign_in_at,
    banned_until: user.banned_until,
    suite_count: suitesByUser.get(user.id)?.length || 0,
    suites: suitesByUser.get(user.id) || []
  }));

  const contactMessages: ContactMessage[] = (contactRows as ContactMessage[] | null) || [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-14">
      <div className="space-y-8">
        <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="panel p-6">
            <span className="eyebrow">Admin console</span>
            <h1 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl lg:text-5xl">
              Control users, access, and generated suite history.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">
              This view is restricted to admin-role accounts. You can review every user,
              inspect their test generation activity, disable access, and trigger password
              recovery emails directly from here.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="panel p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-950 text-white">
                <Users className="h-5 w-5" />
              </div>
              <p className="mt-5 font-display text-2xl">User oversight</p>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                All auth accounts and their current product usage in one place.
              </p>
            </div>
            <div className="panel p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <p className="mt-5 font-display text-2xl">Restricted route</p>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                `/admin` is available only when the signed-in account has an admin role.
              </p>
            </div>
          </div>
        </section>

        <AdminTabs
          users={users}
          currentUserId={currentUser.id}
          contactMessages={contactMessages}
        />
      </div>
    </main>
  );
}
