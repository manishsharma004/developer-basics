import { base as viteBase } from './assetBase.ts'

const CDN = 'https://i.copy.sh'

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
export const V86_FS_BASEURL = asset('v86/lab-rootfs')

/** Buildroot kernel used only when checking BIOS download; full podman lab uses 9p rootfs. */
export const V86_BUILDROOT_BZIMAGE = `${CDN}/buildroot-bzimage68.bin`

export async function fetchLabManifest(): Promise<V86LabManifest | null> {
  try {
    const res = await fetch(V86_MANIFEST_URL, { cache: 'no-cache' })
    if (!res.ok) return null
    return (await res.json()) as V86LabManifest
  } catch {
    return null
  }
}

export function labRootfsFilesystem(manifest: V86LabManifest) {
  return { baseurl: asset(`${manifest.baseurl.replace(/^\//, '')}/fs.json`) }
}
