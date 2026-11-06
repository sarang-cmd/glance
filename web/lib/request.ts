export class RequestBodyError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export async function readJson(
  request: Request,
  maxBytes: number,
): Promise<unknown> {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > maxBytes)
    throw new RequestBodyError(413, "The request is too large.");
  if (!request.body)
    throw new RequestBodyError(400, "The request could not be read.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new RequestBodyError(413, "The request is too large.");
    }
    chunks.push(value);
  }
  const buffer = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.length;
  }
  try {
    return JSON.parse(new TextDecoder().decode(buffer));
  } catch {
    throw new RequestBodyError(400, "The request could not be read.");
  }
}
