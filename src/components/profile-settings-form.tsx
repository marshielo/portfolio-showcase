"use client";

import { useActionState, useState } from "react";
import { updateProfile } from "@/app/(admin)/admin/settings/actions";
import type { Profile, StudentStatus } from "@/types/database";

const STUDENT_STATUS_OPTIONS: StudentStatus[] = [
  "UC Students",
  "BINUS Students",
  "UC Alumni",
  "BINUS Alumni",
  "Public (non UC or BINUS)",
];

export function ProfileSettingsForm({
  profile,
}: {
  profile: Profile | null;
}) {
  const [studentStatus, setStudentStatus] = useState(
    profile?.student_status ?? "Public (non UC or BINUS)"
  );

  const showSemester = studentStatus.includes("Students");

  const action = async (_prevState: unknown, formData: FormData) => {
    try {
      await updateProfile(formData);
      return { success: "Profile updated successfully" };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Something went wrong",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {state?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-600 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
          {state.success}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="full_name" className="block text-sm font-medium">
          Full Name *
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          defaultValue={profile?.full_name}
          className="w-full rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 focus:ring-1 focus:ring-foreground/20"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={profile?.email ?? ""}
            className="w-full rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 focus:ring-1 focus:ring-foreground/20"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={profile?.phone ?? ""}
            className="w-full rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 focus:ring-1 focus:ring-foreground/20"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="professional_link"
          className="block text-sm font-medium"
        >
          Professional Link (LinkedIn, etc.)
        </label>
        <input
          id="professional_link"
          name="professional_link"
          type="url"
          defaultValue={profile?.professional_link ?? ""}
          className="w-full rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 focus:ring-1 focus:ring-foreground/20"
          placeholder="https://linkedin.com/in/..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="student_status"
            className="block text-sm font-medium"
          >
            Student Status *
          </label>
          <select
            id="student_status"
            name="student_status"
            required
            value={studentStatus}
            onChange={(e) => setStudentStatus(e.target.value as StudentStatus)}
            className="w-full rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 focus:ring-1 focus:ring-foreground/20"
          >
            {STUDENT_STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {showSemester && (
          <div className="space-y-2">
            <label
              htmlFor="current_semester"
              className="block text-sm font-medium"
            >
              Current Semester
            </label>
            <input
              id="current_semester"
              name="current_semester"
              type="text"
              defaultValue={profile?.current_semester ?? ""}
              className="w-full rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 focus:ring-1 focus:ring-foreground/20"
              placeholder="e.g. Semester 5"
            />
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="submission_title"
            className="block text-sm font-medium"
          >
            Submission Title
          </label>
          <input
            id="submission_title"
            name="submission_title"
            type="text"
            defaultValue={
              profile?.submission_title ??
              "Portfolio Submission for Apple Developer Academy"
            }
            className="w-full rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 focus:ring-1 focus:ring-foreground/20"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="submission_cohort"
            className="block text-sm font-medium"
          >
            Submission Cohort
          </label>
          <input
            id="submission_cohort"
            name="submission_cohort"
            type="text"
            defaultValue={profile?.submission_cohort ?? "Cohort 2024"}
            className="w-full rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 focus:ring-1 focus:ring-foreground/20"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-foreground px-6 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
