'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Domain } from "@/types/domain";
import Link from "next/link";
import { useState } from "react";

interface DomainListProps {
  initialDomains: Domain[];
}

export function DomainList({ initialDomains }: DomainListProps) {
  const [selectedTld, setSelectedTld] = useState<string>("all");
  const uniqueTlds = Array.from(new Set(initialDomains.map(domain => domain.tld))).sort();

  const filteredDomains = selectedTld === "all"
    ? initialDomains
    : initialDomains.filter(domain => domain.tld === selectedTld);

  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold">All Domains</h1>

      <div className="flex items-center gap-4 p-4 border rounded-lg">
        <div className="w-[200px]">
          <Select value={selectedTld} onValueChange={setSelectedTld}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by TLD" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All TLDs</SelectItem>
              {uniqueTlds.map((tld) => (
                <SelectItem key={tld} value={tld}>
                  .{tld}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-zinc-50">
            <tr>
              <th scope="col" className="px-4 py-2"></th>
              <th scope="col" className="px-4 py-2">Domain</th>
              <th scope="col" className="px-4 py-2">Status</th>
              <th scope="col" className="px-4 py-2">TLD</th>
              <th scope="col" className="px-4 py-2">Created</th>
              <th scope="col" className="px-4 py-2">Expires</th>
              <th scope="col" className="px-4 py-2">Security Lock</th>
              <th scope="col" className="px-4 py-2">WHOIS Privacy</th>
              <th scope="col" className="px-4 py-2">Auto Renew</th>
              <th scope="col" className="px-4 py-2">Not Local</th>
              <th scope="col" className="px-4 py-2">Labels</th>
            </tr>
          </thead>
          <tbody>
            {filteredDomains.length > 0 ? (
              filteredDomains.map((domain: Domain, i: number) => (
                <tr key={domain.domain} className="bg-white border-b hover:bg-zinc-50 group">
                  <td className="bg-zinc-50 text-zinc-400 font-mono font-bold px-1.5 text-right group-hover:text-zinc-900">{i}</td>
                  <td className="px-4 py-2 font-semibold"><Link href={`/${domain.domain}`}>{domain.domain}</Link></td>
                  <td className="px-4 py-2">{domain.status}</td>
                  <td className="px-4 py-2">{domain.tld}</td>
                  <td className="px-4 py-2">{new Date(domain.createDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{new Date(domain.expireDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{domain.securityLock === "1" ? 'Enabled' : 'Disabled'}</td>
                  <td className="px-4 py-2">{domain.whoisPrivacy === "1" ? 'Enabled' : 'Disabled'}</td>
                  <td className="px-4 py-2">{domain.autoRenew === 1 ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2">{domain.notLocal === 1 ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2">
                    {domain.labels && domain.labels.length > 0
                      ? domain.labels.map(label => label.title).join(', ')
                      : '-'
                    }
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="px-4 py-2 text-center">No domains found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
