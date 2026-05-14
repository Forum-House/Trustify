import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB Limit

export async function POST(request: Request) {
  try {
    // 1. Authentication: Check for internal API Key
    const internalKey = request.headers.get("x-trustify-key");
    const expectedKey = process.env.TRUSTIFY_INTERNAL_SECRET;

    if (!expectedKey || internalKey !== expectedKey) {
      return NextResponse.json({ error: "Unauthorized: Missing or invalid internal key" }, { status: 401 });
    }

    const origin = request.headers.get("origin");

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 2. Validate File Size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 413 });
    }

    // 3. Secure Secret Management: Use PRIVATE env var only
    const jwt = process.env.PINATA_JWT;
    
    if (!jwt) {
      console.error("CRITICAL: IPFS credentials missing in environment variables.");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const pinataData = new FormData();
    pinataData.append("file", file);

    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: { Authorization: `Bearer ${jwt}` },
      body: pinataData,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`Pinata Error (${response.status}):`, text);
      return NextResponse.json({ error: "IPFS storage provider error" }, { status: 502 });
    }

    const json = (await response.json()) as { IpfsHash: string };
    return NextResponse.json({ cid: json.IpfsHash });
  } catch (error) {
    console.error("IPFS Upload Route Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
