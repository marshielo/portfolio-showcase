import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { PortfolioPDF } from "@/lib/pdf/portfolio-pdf";
import type { PortfolioWithImages } from "@/types/database";
import React from "react";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Allow both authenticated and public access
    // If authenticated, get their portfolios; otherwise get first user's
    let profileQuery = supabase.from("profiles").select("*");
    let portfolioQuery = supabase
      .from("portfolios")
      .select("*, portfolio_images(*)")
      .eq("is_featured", true)
      .order("sort_order", { ascending: true })
      .limit(5);

    if (user) {
      profileQuery = profileQuery.eq("id", user.id);
      portfolioQuery = portfolioQuery.eq("user_id", user.id);
    }

    const { data: profile } = await profileQuery.limit(1).single();
    const { data: portfolios } = await portfolioQuery;

    if (!profile || !portfolios || portfolios.length === 0) {
      return NextResponse.json(
        { error: "No profile or portfolios found" },
        { status: 404 }
      );
    }

    // Fetch images and convert to base64 for embedding
    const imageDataMap: Record<string, string> = {};
    for (const portfolio of portfolios as PortfolioWithImages[]) {
      const coverImage = portfolio.portfolio_images?.find(
        (img) => img.is_cover
      );
      const firstImage = coverImage ?? portfolio.portfolio_images?.[0];
      if (firstImage) {
        try {
          const response = await fetch(firstImage.image_url);
          const arrayBuffer = await response.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString("base64");
          const mimeType =
            response.headers.get("content-type") || "image/jpeg";
          imageDataMap[firstImage.id] = `data:${mimeType};base64,${base64}`;
        } catch {
          // Skip images that fail to fetch
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfElement = React.createElement(PortfolioPDF as any, {
      profile,
      portfolios: portfolios as PortfolioWithImages[],
      imageDataMap,
    });

    const buffer = await renderToBuffer(pdfElement as any);

    const filename = `${profile.full_name.replace(/\s+/g, "")}_Portfolio_Academy.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
