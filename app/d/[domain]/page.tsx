import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DNSRecord } from "@/types/dns-record";
import { GoogleDnsResponse } from "@/types/name-server";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default async function DomainPage({ params }: { params: Promise<{ domain: string }> }) {
  const domain = (await params).domain;

  async function getNameServers(): Promise<GoogleDnsResponse | null> {
    try {
      const response = await fetch(
        `https://dns.google/resolve?name=${domain}&type=NS`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "force-cache",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch NS records");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching domains:", error);
      return null;
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
          cache: "force-cache",
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

  let host = "";
  if (nameServers && nameServers?.Answer && nameServers?.Answer?.length > 0) {
    const ns = nameServers.Answer.map((n) => n.data!).join(", ");
    if (ns.includes("nsone.net")) {
      host = "Netlify";
    } else if (ns.includes("registrar-servers.com")) {
      host = "Namecheap";
    } else if (ns.includes("vercel-dns.com")) {
      host = "Vercel";
    } else if (ns.includes("cloudflare.com")) {
      host = "Cloudflare";
    } else {
      host = "?";
    }
  } else {
    host = "Unknown";
  }

  const records =
    nameServers && nameServers?.Answer && nameServers?.Answer?.length > 0
      ? await getRecords()
      : [];

  return (
    <div className="space-y-4 p-4">
      <Button asChild variant="outline">
        <Link href="/" className="inline-flex gap-2 items-center">
          <ArrowLeftIcon className="size-4" /> Back to Domains
        </Link>
      </Button>
      <h1 className="text-4xl font-bold">NS and DNS Records for {domain}</h1>
      Host: {host}
      <div className="flex flex-row gap-2">
        <Button asChild>
          <a
            href={`https://vercel.com/account/domains/${domain}`}
            target="_blank"
          >
            Manage in Vercel
          </a>
        </Button>
        <Button asChild>
          <a
            href={`https://app.netlify.com/teams/${process.env.NETLIFY_USERNAME}/dns/${domain}`}
            target="_blank"
          >
            Manage in Netlify
          </a>
        </Button>
        <Button asChild>
          <a
            href={`https://ap.www.namecheap.com/Domains/DomainControlPanel/${domain}/advancedns`}
            target="_blank"
          >
            Manage in Namecheap
          </a>
        </Button>
        <Button asChild>
          <a
            href={`https://dash.cloudflare.com/${process.env.CLOUDFLARE_TENANT_ID}/${domain}/dns/records`}
            target="_blank"
          >
            Manage in Cloudflare
          </a>
        </Button>
      </div>
      <section>
        <h2 className="mb-2 text-2xl font-bold">Name Servers</h2>
        <div>
          {nameServers &&
          nameServers?.Answer &&
          nameServers?.Answer?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>TTL</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nameServers.Answer.map((ns, i) => (
                  <TableRow key={i}>
                    <TableCell>{ns.name}</TableCell>
                    <TableCell>{ns.type}</TableCell>
                    <TableCell>{ns.TTL}</TableCell>
                    <TableCell className="font-mono">{ns.data}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            "No name servers found"
          )}
        </div>
      </section>
      <section>
        <h2 className="mb-2 text-2xl font-bold">DNS Records</h2>
        <div className="relative overflow-x-auto">
          {records.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">Name</TableHead>
                  <TableHead scope="col">Type</TableHead>
                  <TableHead scope="col">Content</TableHead>
                  <TableHead scope="col">TTL</TableHead>
                  <TableHead scope="col">Priority</TableHead>
                  <TableHead scope="col">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record: DNSRecord) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.type}</TableCell>
                    <TableCell className="px-4 py-2 font-mono">
                      {record.content}
                    </TableCell>
                    <TableCell>{record.ttl}</TableCell>
                    <TableCell>{record.prio || "-"}</TableCell>
                    <TableCell>{record.notes || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4">No DNS records found</div>
          )}
        </div>
      </section>
    </div>
  );
}
