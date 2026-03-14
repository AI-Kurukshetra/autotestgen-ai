const { createClient } = require("@supabase/supabase-js");

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  console.error("Usage: node scripts/delete-user.js user@example.com");
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function findUserByEmail(targetEmail) {
  let page = 1;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });

    if (error) {
      throw error;
    }

    const users = data?.users || [];
    const match = users.find((user) => user.email?.toLowerCase() === targetEmail);

    if (match || users.length < 1000) {
      return match || null;
    }

    page += 1;
  }
}

async function main() {
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      console.log(`No user found for email ${email}`);
      return;
    }

    const { error } = await supabase.auth.admin.deleteUser(user.id);
    if (error) {
      throw error;
    }

    console.log(`User ${email} deleted (id: ${user.id}).`);
  } catch (err) {
    console.error("Failed to delete user:", err.message || err);
    process.exit(1);
  }
}

main();
