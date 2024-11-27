"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Domain } from "@/types/domain";
import Link from "next/link";
import { useState } from "react";

interface DomainListProps {
  initialDomains: Domain[];
}

export function DomainList({ initialDomains }: DomainListProps) {
  const [selectedTld, setSelectedTld] = useState<string>("all");
  const uniqueTlds = Array.from(
    new Set(initialDomains.map((domain) => domain.tld))
  ).sort();

  const filteredDomains =
    selectedTld === "all"
      ? initialDomains
      : initialDomains.filter((domain) => domain.tld === selectedTld);

  return (
    <>
      <div className="mb-4 flex items-center gap-4">
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col"></TableHead>
              <TableHead scope="col" className="w-40">
                Domain
              </TableHead>
              <TableHead scope="col">Status</TableHead>
              <TableHead scope="col">TLD</TableHead>
              <TableHead scope="col">Created</TableHead>
              <TableHead scope="col">Expires</TableHead>
              <TableHead scope="col">Security Lock</TableHead>
              <TableHead scope="col">WHOIS Privacy</TableHead>
              <TableHead scope="col">Auto Renew</TableHead>
              <TableHead scope="col">Not Local</TableHead>
              <TableHead scope="col">Labels</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDomains.length > 0 ? (
              filteredDomains.map((domain: Domain, i: number) => (
                <TableRow key={domain.domain} className="group">
                  <TableCell className="bg-zinc-50 text-zinc-400 font-mono font-bold px-1.5 text-right group-hover:text-zinc-900 border-r transition-colors">
                    {i}
                  </TableCell>
                  <TableCell className="font-semibold">
                    <Link href={`/d/${domain.domain}`}>{domain.domain}</Link>
                  </TableCell>
                  <TableCell>{domain.status}</TableCell>
                  <TableCell>{domain.tld}</TableCell>
                  <TableCell>
                    {new Date(domain.createDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(domain.expireDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {domain.securityLock === "1" ? "Enabled" : "Disabled"}
                  </TableCell>
                  <TableCell>
                    {domain.whoisPrivacy === "1" ? "Enabled" : "Disabled"}
                  </TableCell>
                  <TableCell>{domain.autoRenew === 1 ? "Yes" : "No"}</TableCell>
                  <TableCell>{domain.notLocal === 1 ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {domain.labels && domain.labels.length > 0
                      ? domain.labels.map((label) => label.title).join(", ")
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="p-4 text-center font-semibold"
                >
                  No domains found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
