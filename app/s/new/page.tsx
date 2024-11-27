import { auth } from "@clerk/nextjs/server";
import AddSubdomainForm from "./form";

export default async function AddSubdomainPage() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  return (
    <div className="p-4">
      <AddSubdomainForm userId={userId} />
    </div>
  );
}
