export async function chromeLoadVersion() {
  let result = await chrome.storage.local.get('version')
  let version = result.version
  return version
}

export async function chromeSetVersion(version) {
  await chrome.storage.local.set({'version': version})
}

export function chromeManifest() {
  const manifest = chrome.runtime.getManifest()
  return manifest
}
