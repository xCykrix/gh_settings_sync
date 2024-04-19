import sodium from "https://deno.land/x/sodium@0.2.0/basic.ts";

export async function encrypt(key: string, value: string): Promise<string> {
  await sodium.ready
  // Convert Secret & Base64 key to Uint8Array.
  const binkey = sodium.from_base64(key)
  const binsec = sodium.from_string(value)
  // Encrypt the secret using LibSodium
  const encBytes = sodium.crypto_box_seal(binsec, binkey)
  // Convert encrypted Uint8Array to Base64
  return sodium.to_base64(encBytes)
}