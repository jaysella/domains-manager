export type NameServer = string[]

export interface GoogleDnsResponse {
  Status: number;                // Query status (e.g., 0 for NOERROR)
  TC: boolean;                   // Truncated response flag
  RD: boolean;                   // Recursion desired
  RA: boolean;                   // Recursion available
  AD: boolean;                   // Authenticated data (DNSSEC)
  CD: boolean;                   // Checking disabled (DNSSEC)
  Question: Question[];          // Query information
  Answer?: Answer[];             // Answer records (optional)
  Authority?: Authority[];       // Authority records (optional)
  Additional?: Additional[];     // Additional records (optional)
}

export interface Question {
  name: string;                  // Queried domain name (e.g., "example.com.")
  type: number;                  // Query type (e.g., 2 for NS)
}

export interface Answer {
  name: string;                  // Answered domain name
  type: number;                  // Record type (e.g., 2 for NS)
  TTL: number;                   // Time-to-live of the record
  data: string;                  // Record data (e.g., "ns1.example.com.")
}

export interface Authority {
  name: string;                  // Authority domain name
  type: number;                  // Record type
  TTL: number;                   // Time-to-live of the record
  data: string;                  // Authority data (e.g., nameserver)
}

export interface Additional {
  name: string;                  // Additional record domain name
  type: number;                  // Record type
  TTL: number;                   // Time-to-live of the record
  data: string;                  // Additional record data
}
