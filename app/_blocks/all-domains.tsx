import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { Subdomains } from "@/db/schema";
import { Domain } from "@/types/domain";
import { Subdomain } from "@/types/subdomain";
import { auth } from "@clerk/nextjs/server";
import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { DomainList } from "./domain-list";
import { SubdomainsList } from "./subdomains-list";

export default async function AllDomains() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const subdomains: Subdomain[] = await db.query.Subdomains.findMany({
    where: eq(Subdomains.owner_id, userId),
    orderBy: [asc(Subdomains.subdomain)],
  });

  /**
   * Get all domains
   * @returns {Promise<Domain[]>}
   */
  async function getDomains(): Promise<Domain[]> {
    try {
      const response = await fetch(
        `${process.env.PORKBUN_API_BASE_URL}/domain/listAll`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            apikey: process.env.PORKBUN_API_KEY,
            secretapikey: process.env.PORKBUN_SECRET_KEY,
            includeLabels: "yes",
          }),
          cache: "force-cache",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch domains");
      }

      const data = await response.json();
      return (
        data.domains.sort((a: Domain, b: Domain) =>
          a.domain.localeCompare(b.domain)
        ) || []
      );
    } catch (error) {
      console.error("Error fetching domains:", error);
      return [];
    }
  }

  const domains = await getDomains();

  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold">All Domains</h1>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Subdomains</h2>
          <Button asChild>
            <Link href="/s/new">New</Link>
          </Button>
        </div>
        <SubdomainsList subdomains={subdomains} />
      </section>

      <section>
        <h2 className="mb-2 text-2xl font-bold">Domains</h2>
        <DomainList initialDomains={domains} />
      </section>
    </div>
  );
}
