import "server-only";

import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { Lead } from "@/types";

export type CreateLeadInput = {
  name: string;
  phone: string;
  course?: string | null;
  contactTime?: string | null;
};

export async function createLead(input: CreateLeadInput) {
  return prisma.lead.create({
    data: {
      name: input.name.trim(),
      phone: input.phone.trim(),
      course:
        input.course != null && String(input.course).trim() !== ""
          ? String(input.course).trim()
          : null,
      contactTime:
        input.contactTime != null && String(input.contactTime).trim() !== ""
          ? String(input.contactTime).trim()
          : null,
    },
  });
}

export type ListLeadsParams = {
  q?: string;
  course?: string;
  take?: number;
};

export async function getLeads(params: ListLeadsParams = {}) {
  const take = params.take ?? 500;
  const where: Prisma.LeadWhereInput = {};

  const q = params.q?.trim();
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
      { course: { contains: q, mode: "insensitive" } },
    ];
  }

  const course = params.course?.trim();
  if (course) {
    where.course = { contains: course, mode: "insensitive" };
  }

  return prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take,
  });
}

export function mapLeadToViewModel(row: {
  id: string;
  name: string;
  phone: string;
  course: string | null;
  contactTime: string | null;
  createdAt: Date;
}): Lead {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    course: row.course ?? "",
    contactTime: row.contactTime ?? "",
    createdAt: row.createdAt.toISOString(),
  };
}

export async function searchLeads(q: string, courseFilter?: string) {
  return getLeads({ q, course: courseFilter });
}
