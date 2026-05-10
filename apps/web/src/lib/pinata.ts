const PINATA_UPLOAD_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";

export async function uploadFileToIpfs(file: File) {
  const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;
  if (!jwt) throw new Error("NEXT_PUBLIC_PINATA_JWT is required for IPFS upload.");

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(PINATA_UPLOAD_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${jwt}` },
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Pinata upload failed: ${response.status} ${text}`);
  }

  const json = (await response.json()) as { IpfsHash: string };
  return { cid: json.IpfsHash };
}
