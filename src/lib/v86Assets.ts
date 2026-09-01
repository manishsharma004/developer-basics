import { base as viteBase } from './assetBase.ts'

const CDN = 'https://i.copy.sh'

/** Pre-built lab image published with GitHub Pages (same repo deploy). */
export const V86_PREBUILT_MANIFEST_URL =
  import.meta.env.VITE_V86_LAB_MANIFEST_URL ??
  'https://manishsharma004.github.io/developer-basics/v86/lab-rootfs/manifest.json'

export type V86LabManifest = {
  version: number
  profile: string
  rootfsBytes: number
  chunkSize: number
  baseurl: string
  memoryMb: number
  cmdline: string
}

function asset(path: string): string {
  const base = viteBase.endsWith('/') ? viteBase : `${viteBase}/`
  return `${base}${path.replace(/^\//, '')}`
}

export const V86_BIOS = {
  bios: asset('v86/bios/seabios.bin'),
  vga_bios: asset('v86/bios/vgabios.bin'),
}

export const V86_MANIFEST_URL = asset('v86/lab-rootfs/manifest.json')

/** Buildroot kernel used only when checking BIOS download; full podman lab uses 9p rootfs. */
export const V86_BUILDROOT_BZIMAGE = `${CDN}/buildroot-bzimage68.bin`

export const V86_LAB_UNAVAILABLE_HINT =
  'The pre-built Podman VM is not available yet. It is bundled automatically on deploy; for local dev run: bun run v86:fetch-lab-image'

function manifestCandidates(): string[] {
  const extra = import.meta.env.VITE_V86_LAB_MANIFEST_URL
  return [
    V86_MANIFEST_URL,
    ...(extra && extra !== V86_PREBUILT_MANIFEST_URL ? [extra] : []),
    V86_PREBUILT_MANIFEST_URL,
  ]
}

/** Resolve relative manifest URLs to an absolute directory URL. */
function manifestDirFromUrl(manifestUrl: string): string {
  const resolved = /^https?:\/\//i.test(manifestUrl)
    ? manifestUrl
    : new URL(
        manifestUrl,
        typeof window !== 'undefined' ? window.location.origin : 'http://localhost',
      ).href
  return resolved.replace(/\/[^/]*$/, '')
}

/** Resolve relative manifest baseurl against the manifest file URL. */
export function resolveManifestBaseUrl(manifest: V86LabManifest, manifestUrl: string): V86LabManifest {
  const raw = manifest.baseurl.replace(/\/$/, '')
  if (/^https?:\/\//i.test(raw)) return manifest

  const manifestDir = manifestDirFromUrl(manifestUrl)
  if (raw === '.' || raw === '') {
    return { ...manifest, baseurl: manifestDir }
  }

  if (raw.startsWith('/')) {
    // Legacy manifests used site-root paths; co-locate with the manifest file.
    return { ...manifest, baseurl: manifestDir }
  }

  return { ...manifest, baseurl: new URL(raw, `${manifestDir}/`).href.replace(/\/$/, '') }
}

function labAssetUrl(root: string, ...parts: string[]): string {
  const suffix = parts.filter(Boolean).join('/')
  if (/^https?:\/\//i.test(root)) {
    return `${root.replace(/\/$/, '')}/${suffix}`
  }
  return asset(`${root.replace(/^\//, '')}/${suffix}`)
}

export async function fetchLabManifest(): Promise<V86LabManifest | null> {
  for (const url of manifestCandidates()) {
    try {
      const res = await fetch(url, { cache: 'no-cache' })
      if (!res.ok) continue
      const manifest = (await res.json()) as V86LabManifest
      if (manifest.profile !== 'alpine-podman-lab') continue
      return resolveManifestBaseUrl(manifest, res.url)
    } catch {
      /* try next source */
    }
  }
  return null
}

export function labRootfsFilesystem(manifest: V86LabManifest) {
  const root = manifest.baseurl.replace(/\/$/, '')
  return {
    baseurl: labAssetUrl(root, 'flat') + '/',
    basefs: labAssetUrl(root, 'fs.json'),
  }
}
