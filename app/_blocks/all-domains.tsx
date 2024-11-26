import { Domain } from "@/types/domain";
import { DomainList } from "./domain-list";

export default async function AllDomains() {
  /**
   * Get all domains
   * @returns {Promise<Domain[]>}
   */
  async function getDomains(): Promise<Domain[]> {
    try {
      const response = await fetch(`${process.env.PORKBUN_API_BASE_URL}/domain/listAll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apikey: process.env.PORKBUN_API_KEY,
          secretapikey: process.env.PORKBUN_SECRET_KEY
        }),
        cache: 'force-cache'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch domains');
      }

      const data = await response.json();
      return data.domains.sort((a: Domain, b: Domain) => a.domain.localeCompare(b.domain)) || [];
    } catch (error) {
      console.error('Error fetching domains:', error);
      return [];
    }
  }

  const domains = await getDomains();

  return <DomainList initialDomains={domains} />;
}
