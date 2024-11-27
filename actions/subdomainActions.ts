"use server";

import { db } from "@/db";
import { Subdomains, UserDomains } from "@/db/schema";
import { and, eq } from "drizzle-orm";

/**
 * Add a subdomain, create the domain if it doesn't exist
 * @param {string} subdomain - The subdomain to add
 * @param {string} domain - The domain to add the subdomain to
 * @param {string} owner_id - The owner ID of the subdomain
 * @param {string | null} description - The description of the subdomain
 * @param {string | null} host - The host of the subdomain
 */
export const addSubdomain = async (subdomain: string, domain: string, owner_id: string, description: string | null, host: string | null) => {
  await db.insert(UserDomains).values({
    domain: domain,
    owner_id: owner_id,
  }).onConflictDoNothing();

  await db.insert(Subdomains).values({
    subdomain: subdomain,
    domain: domain,
    owner_id: owner_id,
    description: description,
    host: host,
  });
};

/**
 * Update a subdomain
 * @param {string} subdomain - The subdomain to update
 * @param {string} domain - The domain to update the subdomain to
 * @param {string} owner_id - The owner ID of the subdomain
 * @param {string | null} description - The description of the subdomain
 * @param {string | null} host - The host of the subdomain
 */
export const updateSubdomain = async (subdomain: string, domain: string, owner_id: string, description: string | null, host: string | null) => {
  await db.update(Subdomains).set({
    domain: domain,
    description: description,
    host: host,
  }).where(and(eq(Subdomains.subdomain, subdomain), eq(Subdomains.domain, domain)));
};

/**
 * Delete a subdomain
 * @param {string} subdomain - The subdomain to delete
 * @param {string} domain - The domain to delete the subdomain from
 * @param {string} owner_id - The owner ID of the subdomain
 */
export const deleteSubdomain = async (subdomain: string, domain: string, owner_id: string) => {
  await db.delete(Subdomains).where(and(eq(Subdomains.subdomain, subdomain), eq(Subdomains.domain, domain)));
};
