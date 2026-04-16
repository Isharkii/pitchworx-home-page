import { NextRequest, NextResponse } from "next/server";

export interface GammaGenerateResponse {
  gammaUrl: string;
  gammaId: string;
  embedUrl: string;
  exportUrl?: string;
  title: string;
  generationId: string;
}

const GAMMA_API = "https://public-api.gamma.app/v1.0";
const POLL_INTERVAL_MS = 3_000;
const MAX_POLLS = 60; // 3 min max

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GAMMA_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GAMMA_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  let body: { prompt: string; theme?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { prompt } = body;
  if (!prompt?.trim()) {
    return NextResponse.json({ error: "prompt is required." }, { status: 400 });
  }

  // ── Step 1: kick off generation ──────────────────────────────────────────────
  let createData: { generationId?: string; error?: string };
  try {
    const createRes = await fetch(`${GAMMA_API}/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({
        inputText: prompt.trim(),
        textMode: "generate",
        format: "presentation",
        exportAs: "pptx",
        sharingOptions: { externalAccess: "view" },
      }),
    });

    const raw = await createRes.text();

    if (!createRes.ok) {
      // Truncate potentially huge HTML error pages to a readable message
      const msg = raw.length > 300 ? raw.slice(0, 300) + "…" : raw;
      return NextResponse.json(
        { error: `Gamma rejected the request (${createRes.status}): ${msg}` },
        { status: createRes.status },
      );
    }

    createData = JSON.parse(raw);
  } catch (err) {
    console.error("[gamma] create request failed:", err);
    return NextResponse.json(
      { error: "Could not reach the Gamma API. Check your network or API key." },
      { status: 502 },
    );
  }

  const generationId = createData.generationId;
  if (!generationId) {
    return NextResponse.json(
      { error: "Gamma did not return a generationId." },
      { status: 502 },
    );
  }

  // ── Step 2: poll until complete ───────────────────────────────────────────────
  for (let i = 0; i < MAX_POLLS; i++) {
    await sleep(POLL_INTERVAL_MS);

    let pollData: {
      status?: string;
      gammaId?: string;
      gammaUrl?: string;
      exportUrl?: string;
      title?: string;
      error?: string;
    };

    try {
      const pollRes = await fetch(`${GAMMA_API}/generations/${generationId}`, {
        headers: { "X-API-KEY": apiKey },
      });

      const raw = await pollRes.text();

      if (!pollRes.ok) {
        const msg = raw.length > 300 ? raw.slice(0, 300) + "…" : raw;
        return NextResponse.json(
          { error: `Gamma poll error (${pollRes.status}): ${msg}` },
          { status: pollRes.status },
        );
      }

      pollData = JSON.parse(raw);
    } catch (err) {
      console.error("[gamma] poll request failed:", err);
      return NextResponse.json(
        { error: "Lost connection while waiting for Gamma to finish." },
        { status: 502 },
      );
    }

    if (pollData.status === "completed") {
      const gammaId = pollData.gammaId ?? "";
      const response: GammaGenerateResponse = {
        gammaUrl:  pollData.gammaUrl ?? `https://gamma.app`,
        gammaId,
        embedUrl:  gammaId ? `https://gamma.app/embed/${gammaId}` : (pollData.gammaUrl ?? ""),
        exportUrl: pollData.exportUrl,
        title:     pollData.title ?? prompt.slice(0, 80),
        generationId,
      };
      return NextResponse.json(response);
    }

    if (pollData.status === "failed") {
      return NextResponse.json(
        { error: `Gamma generation failed: ${pollData.error ?? "unknown reason"}` },
        { status: 500 },
      );
    }

    // still pending — keep polling
  }

  return NextResponse.json(
    { error: "Timed out waiting for Gamma to finish (3 min). Check gamma.app for your deck." },
    { status: 504 },
  );
}
