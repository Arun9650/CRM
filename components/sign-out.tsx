import { auth, signOut } from "@/auth";
import Link from "next/link";
import { isRedirectError, redirect } from "next/dist/client/components/redirect";
import { SubmitButton } from "@/components/SubmitButton";

export default async function SignOut() {
  const session = await auth();

  // Function to handle sign-out
  const handleSignOut = async () => {
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
  };

  return (
    <main>
      <section className="">
        {session?.user ? (
          <div>
            <SubmitButton
              pendingText="Signing out..."
              className="p-2 px-4 mt-4 bg-[hsl(191,52%,30%)] hover:bg-[hsl(191,52%,35%)] rounded-sm"
              onClick={handleSignOut} // Call the sign-out function when button is clicked
            >
              Sign Out
            </SubmitButton>
          </div>
        ) : (
          <Link href="/auth/sign-in">Sign In</Link>
        )}
      </section>
    </main>
  );
}
