import type { Profile } from "@/types/database";

export function PortfolioFooter({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-foreground/10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 py-6 text-sm sm:grid-cols-4">
        <div>
          <p className="font-semibold">Your name</p>
          <p className="text-foreground/60">{profile.full_name}</p>
        </div>
        <div>
          <p className="font-semibold">{profile.student_status}</p>
          {profile.current_semester && (
            <p className="text-foreground/60">{profile.current_semester}</p>
          )}
        </div>
        <div>
          <p className="font-semibold">Your contact information</p>
          <div className="text-foreground/60">
            {profile.phone && <p>{profile.phone}</p>}
            {profile.email && <p>{profile.email}</p>}
            {profile.professional_link && (
              <a
                href={profile.professional_link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Professional Profile
              </a>
            )}
          </div>
        </div>
        <div>
          <p className="font-semibold">{profile.submission_title}</p>
          <p className="font-bold">{profile.submission_cohort}</p>
        </div>
      </div>
    </footer>
  );
}
