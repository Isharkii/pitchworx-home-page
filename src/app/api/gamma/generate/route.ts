import { NextRequest, NextResponse } from "next/server";

export interface GammaSlide {
  id: string;
  title: string;
  body: string;
  speakerNotes?: string;
  imageUrl?: string;
  layout?: string;
}

export interface GammaGenerateResponse {
  slides: GammaSlide[];
  presentationId: string;
  presentationUrl: string;
  title: string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GAMMA_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GAMMA_API_KEY is not configured" },
      { status: 500 },
    );
  }

  let body: { prompt: string; theme?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { prompt, theme = "default" } = body;
  if (!prompt?.trim()) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  try {
    // Step 1 — create an outline / deck via Gamma's generation API
    const gammaRes = await fetch("https://gamma.app/api/v1/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text: prompt.trim(),
        mode: "text",
        theme,
      }),
    });

    if (!gammaRes.ok) {
      const errorText = await gammaRes.text().catch(() => "unknown error");
      return NextResponse.json(
        { error: `Gamma API error ${gammaRes.status}: ${errorText}` },
        { status: gammaRes.status },
      );
    }

    const data = await gammaRes.json();

    // Normalise the Gamma response — their API returns `data.deck.cards`
    // Each card has: id, title, blocks (array of content blocks)
    const deck = data?.data?.deck ?? data?.deck ?? data;
    const rawCards: Array<Record<string, unknown>> = deck?.cards ?? deck?.slides ?? [];

    const slides: GammaSlide[] = rawCards.map(
      (card: Record<string, unknown>, i: number) => {
        // Flatten block content into readable body text
        const blocks = Array.isArray(card.blocks) ? card.blocks as Array<Record<string, unknown>> : [];
        const body = blocks
          .map((b: Record<string, unknown>) => {
            if (typeof b.text === "string") return b.text;
            if (typeof b.content === "string") return b.content;
            if (Array.isArray(b.children))
              return (b.children as Array<Record<string, unknown>>)
                .map((c: Record<string, unknown>) => c.text ?? "")
                .join(" ");
            return "";
          })
          .filter(Boolean)
          .join("\n\n");

        return {
          id: (card.id as string) ?? String(i),
          title: (card.title as string) ?? (card.heading as string) ?? `Slide ${i + 1}`,
          body,
          speakerNotes: (card.speakerNotes as string) ?? (card.notes as string) ?? undefined,
          imageUrl: (card.imageUrl as string) ?? (card.image as string) ?? undefined,
          layout: (card.layout as string) ?? undefined,
        };
      },
    );

    const response: GammaGenerateResponse = {
      slides,
      presentationId: (deck?.id as string) ?? "",
      presentationUrl: (deck?.url as string) ?? `https://gamma.app/deck/${deck?.id ?? ""}`,
      title: (deck?.title as string) ?? prompt.slice(0, 80),
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("[gamma/generate] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
