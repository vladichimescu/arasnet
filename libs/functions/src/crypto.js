const algorithm = "AES-GCM"

const masterKey = await crypto.subtle.digest(
  "SHA-256",
  new TextEncoder().encode(process.env.SECRET)
)

const cryptoKey = await crypto.subtle.importKey(
  "raw",
  masterKey,
  { name: algorithm },
  false,
  ["encrypt", "decrypt"]
)

async function encrypt(data) {
  const iv = new Uint8Array(12)
  crypto.getRandomValues(iv)

  const encodedData = new TextEncoder().encode(data)

  const encryptedData = await crypto.subtle.encrypt(
    {
      name: algorithm,
      iv,
    },
    cryptoKey,
    encodedData
  )

  const ivString = btoa(String.fromCharCode(...iv))

  const encryptedDataString = btoa(
    String.fromCharCode(...new Uint8Array(encryptedData))
  )

  return `${ivString}${encryptedDataString}`
}

async function decrypt(data) {
  const ivString = data.slice(0, 16)

  const encryptedDataString = data.slice(16)

  const iv = new Uint8Array(
    atob(ivString)
      .split("")
      .map((c) => c.charCodeAt(0))
  )

  const encryptedData = new Uint8Array(
    atob(encryptedDataString)
      .split("")
      .map((c) => c.charCodeAt(0))
  )

  const encodedData = await crypto.subtle.decrypt(
    {
      name: algorithm,
      iv,
    },
    cryptoKey,
    encryptedData
  )

  return new TextDecoder().decode(encodedData)
}

async function verify(encryptedData, originalData) {
  try {
    return originalData === (await decrypt(encryptedData))
  } catch {
    return false
  }
}

export { encrypt, decrypt, verify }
