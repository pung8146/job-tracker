"use server";

import { revalidatePath } from "next/cache";

import { toggleFavoriteJob } from "@/lib/jobRepository";

export async function toggleFavoriteJobAction(formData: FormData) {
  const jobId = formData.get("jobId");

  if (typeof jobId !== "string" || !jobId) {
    return;
  }

  toggleFavoriteJob(jobId);
  revalidatePath("/");
}
