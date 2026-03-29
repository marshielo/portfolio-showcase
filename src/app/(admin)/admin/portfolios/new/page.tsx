import { PortfolioForm } from "@/components/portfolio-form";

export default function NewPortfolioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Portfolio</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Add a new project to your portfolio
        </p>
      </div>
      <PortfolioForm />
    </div>
  );
}
