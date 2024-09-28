import { auth, signOut } from "@/auth";
import Link from "next/link";
import {
  isRedirectError,
  redirect,
} from "next/dist/client/components/redirect";
import { SubmitButton } from "@/components/SubmitButton";

export default async function Home() {
  const session = await auth();
  return (
    <main>
      <section className="main-container">
        <h1 className="header-text">NextJS MongoDB Prisma Auth</h1>
        <p>Current User : {session?.user?.name || "None"}</p>
        {session?.user ? (
          <form
            action={async () => {
              "use server";
              try {
                await signOut({ redirect: false });
              } catch (err) {
                if (isRedirectError(err)) {
                  console.error(err);
                  throw err;
                }
              } finally {
                redirect("/");
              }
            }}
          >
            <SubmitButton
              pendingText="Signing out..."
              className="p-2 px-4 mt-4 bg-[hsl(191,52%,30%)] hover:bg-[hsl(191,52%,35%)] rounded-sm"
            >
              Sign Out
            </SubmitButton>
          </form>
        ) : (
          <Link href="/auth/sign-in">Sign In</Link>
        )}
        <Link href="/dashboard">Protected Page 🛡️</Link>
      </section>
    </main>
  );
}
