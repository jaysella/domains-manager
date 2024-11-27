import { DNSRecord } from "@/types/dns-record";
import { NameServer } from "@/types/name-server";

export default async function DomainPage({
  params,
}: {
  params: Promise<{ domain: string }>
}) {
  const domain = (await params).domain

  async function getNameServers(): Promise<NameServer[]> {
    try {
      const response = await fetch(
        `${process.env.PORKBUN_API_BASE_URL}/domain/getNs/${domain}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            apikey: process.env.PORKBUN_API_KEY,
            secretapikey: process.env.PORKBUN_SECRET_KEY,
          }),
          cache: 'force-cache'
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch DNS records");
      }

      const data = await response.json();
      return data.ns || [];
    } catch (error) {
      console.error("Error fetching domains:", error);
      return [];
    }
  }

  async function getRecords(): Promise<DNSRecord[]> {
    try {
      const response = await fetch(
        `${process.env.PORKBUN_API_BASE_URL}/dns/retrieve/${domain}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            apikey: process.env.PORKBUN_API_KEY,
            secretapikey: process.env.PORKBUN_SECRET_KEY,
          }),
          cache: 'force-cache'
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch DNS records");
      }

      const data = await response.json();
      return data.records || [];
    } catch (error) {
      console.error("Error fetching domains:", error);
      return [];
    }
  }

  const nameServers = await getNameServers();
  const records = nameServers.length > 0 ? await getRecords() : [];

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-4xl font-bold">NS and DNS Records for {domain}</h1>

      <h2 className="text-2xl font-bold">Name Servers</h2>
      <div>
        {nameServers.length > 0 ? <pre className="text-xs bg-zinc-100 p-4 rounded-lg">
          {JSON.stringify(nameServers, null, 2)}
        </pre> : "No name servers found"}
      </div>

      <h2 className="text-2xl font-bold">DNS Records</h2>
      <div className="relative overflow-x-auto">
        {records.length > 0 ? (
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-2">Name</th>
                <th scope="col" className="px-4 py-2">Type</th>
                <th scope="col" className="px-4 py-2">Content</th>
                <th scope="col" className="px-4 py-2">TTL</th>
                <th scope="col" className="px-4 py-2">Priority</th>
                <th scope="col" className="px-4 py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record: DNSRecord) => (
                <tr key={record.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{record.name}</td>
                  <td className="px-4 py-2">{record.type}</td>
                  <td className="px-4 py-2 font-mono">{record.content}</td>
                  <td className="px-4 py-2">{record.ttl}</td>
                  <td className="px-4 py-2">{record.prio || '-'}</td>
                  <td className="px-4 py-2">{record.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-4">No DNS records found</div>
        )}
      </div>
    </div>
  );
}
