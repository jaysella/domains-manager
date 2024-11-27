"use client";

import { updateSubdomain } from "@/actions/subdomainActions";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Subdomain } from "@/types/subdomain";
import { ExternalLinkIcon } from "lucide-react";
import React from "react";

export function SubdomainsList({ subdomains }: { subdomains: Subdomain[] }) {
  const [data, setData] = React.useState<Subdomain[]>(subdomains);
  const [editingCell, setEditingCell] = React.useState<{
    subdomain: string;
    field: keyof Subdomain;
  } | null>(null);
  const [editValue, setEditValue] = React.useState<string>("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleEdit = (
    subdomain: string,
    field: keyof Subdomain,
    value: string
  ) => {
    const editedFieldData = data.find((item) => item.subdomain === subdomain);
    if (!editedFieldData) {
      throw new Error("Subdomain not found");
    }
    updateSubdomain(
      editedFieldData.subdomain,
      field === "domain" ? value : editedFieldData.domain,
      editedFieldData.owner_id,
      field === "description" ? value : editedFieldData.description,
      field === "host" ? value : editedFieldData.host
    );

    setData((prevData) =>
      prevData.map((item) =>
        item.subdomain === subdomain ? { ...item, [field]: value } : item
      )
    );

    setEditingCell(null);
  };

  const startEditing = (
    subdomain: string,
    field: keyof Subdomain,
    value: string
  ) => {
    setEditingCell({ subdomain, field });
    setEditValue(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && editingCell) {
      handleEdit(editingCell.subdomain, editingCell.field, editValue);
    } else if (e.key === "Escape") {
      setEditingCell(null);
    }
  };

  React.useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

  return (
    <Table className="text-sm text-left border">
      <TableHeader className="text-xs uppercase bg-zinc-50">
        <TableRow>
          <TableHead scope="col"></TableHead>
          <TableHead scope="col" className="w-40">
            Subdomain
          </TableHead>
          <TableHead scope="col" className="w-40">
            Domain
          </TableHead>
          <TableHead scope="col" className="w-40">
            Host
          </TableHead>
          <TableHead scope="col" className="w-full">
            Description
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((subdomain: Subdomain, i: number) => (
            <TableRow key={subdomain.subdomain}>
              <TableCell className="bg-zinc-50 text-zinc-400 font-mono font-bold px-1.5 text-right group-hover:text-zinc-900 border-r">
                {i}
              </TableCell>

              <TableCell className="font-semibold inline-flex items-center">
                {subdomain.subdomain}

                <a
                  href={`https://${subdomain.subdomain}`}
                  target="_blank"
                  className="ml-2"
                >
                  <ExternalLinkIcon className="size-3" />
                </a>
              </TableCell>

              {(["domain", "host", "description"] as const).map((field) => (
                <React.Fragment key={field}>
                  <TableCell>
                    <div
                      className={cn(
                        field === "domain" ? "inline-flex items-center" : ""
                      )}
                    >
                      {editingCell?.subdomain === subdomain.subdomain &&
                      editingCell?.field === field ? (
                        <Input
                          ref={inputRef}
                          className="flex w-full p-0 h-auto border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none rounded-none"
                          value={editValue ?? ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEditValue(e.target.value)
                          }
                          onBlur={() => {
                            handleEdit(
                              editingCell.subdomain,
                              editingCell.field,
                              editValue
                            );
                            setEditingCell(null);
                          }}
                          onKeyDown={handleKeyDown}
                        />
                      ) : (
                        <>
                          <div
                            className="min-w-40 min-h-3 w-full"
                            onClick={() =>
                              startEditing(
                                subdomain.subdomain,
                                field,
                                subdomain[field]!
                              )
                            }
                          >
                            {subdomain[field]}
                          </div>
                        </>
                      )}

                      {field === "domain" && (
                        <a
                          href={`https://${subdomain.domain}`}
                          target="_blank"
                          className="ml-2"
                        >
                          <ExternalLinkIcon className="size-3" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="p-4 text-center font-semibold">
              No subdomains found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
