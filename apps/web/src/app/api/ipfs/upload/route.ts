import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Read the secret from server env (do NOT prefix with NEXT_PUBLIC_)
    const jwt = process.env.PINATA_JWT || process.env.NEXT_PUBLIC_PINATA_JWT;
    
    if (!jwt) {
      return NextResponse.json({ error: "Server missing IPFS credentials" }, { status: 500 });
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
      return NextResponse.json({ error: `Pinata upload failed: ${response.status} ${text}` }, { status: response.status });
    }

    const json = (await response.json()) as { IpfsHash: string };
    return NextResponse.json({ cid: json.IpfsHash });
  } catch (error) {
    console.error("IPFS Upload Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
