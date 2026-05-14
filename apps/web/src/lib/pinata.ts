export async function uploadFileToIpfs(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/ipfs/upload", {
    method: "POST",
    headers: {
      "x-trustify-key": process.env.NEXT_PUBLIC_INTERNAL_API_KEY || "",
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorData.error || `Upload failed: ${response.status}`);
  }

  const json = (await response.json()) as { cid: string };
  return { cid: json.cid };
}
