import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");
  if (!username || !/^[a-zA-Z0-9-]+$/.test(username)) {
    return NextResponse.json({ error: "Invalid username" }, { status: 400 });
  }

  const res = await fetch(`https://github.com/users/${username}/contributions`, {
    headers: {
      "x-requested-with": "XMLHttpRequest",
    },
    next: { revalidate: 3600 }, // cache for 1 hour
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch contributions" },
      { status: res.status }
    );
  }

  const html = await res.text();
  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}
