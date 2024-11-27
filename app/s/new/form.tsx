"use client";

import { addSubdomain } from "@/actions/subdomainActions";
import { Button } from "@/components/ui/button";
import React from "react";

export default function AddSubdomainForm({ userId }: { userId: string }) {
  const [subdomain, setSubdomain] = React.useState("");
  const [domain, setDomain] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [host, setHost] = React.useState("");

  const handleAdd = async () => {
    addSubdomain(subdomain, domain, userId, description, host);
    setSubdomain("");
    setDomain("");
    setDescription("");
    setHost("");
  };

  return (
    <div className="w-full flex gap-1 mt-2">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-1">
          <label htmlFor="subdomain" className="text-sm font-medium">
            Subdomain
          </label>
          <input
            id="subdomain"
            type="text"
            className="w-full px-2 py-1 border border-gray-200 rounded outline-none"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSubdomain(e.target.value)
            }
            value={subdomain}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="domain" className="text-sm font-medium">
            Domain
          </label>
          <input
            id="domain"
            type="text"
            className="w-full px-2 py-1 border border-gray-200 rounded outline-none"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDomain(e.target.value)
            }
            value={domain}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <input
            id="description"
            type="text"
            className="w-full px-2 py-1 border border-gray-200 rounded outline-none"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDescription(e.target.value)
            }
            value={description}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="host" className="text-sm font-medium">
            Host
          </label>
          <input
            id="host"
            type="text"
            className="w-full px-2 py-1 border border-gray-200 rounded outline-none"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setHost(e.target.value)
            }
            value={host}
          />
        </div>

        <Button onClick={handleAdd} type="submit">
          Add
        </Button>
      </div>
    </div>
  );
}
