/**
 * Regenerates the optimised portrait assets in public/images from the source photo.
 *
 *   node scripts/optimize-images.mjs [path/to/source.jpg]
 *
 * Produces matching JPEG + WebP pairs at exact widths so the `srcset`
 * descriptors in the markup are accurate (a 800w candidate must really be 800px).
 */
import { mkdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'public', 'images')

const SOURCE_CANDIDATES = [
  process.argv[2],
  path.join(root, 'assets', 'vinay-source.jpg'),
  'C:/Users/Admin/Downloads/vinay image.jpeg',
].filter(Boolean)

const WIDTHS = [480, 800]

async function main() {
  const source = SOURCE_CANDIDATES.find((p) => existsSync(p))
  if (!source) {
    console.error('No source image found. Usage: node scripts/optimize-images.mjs <source>')
    process.exit(1)
  }

  await mkdir(outDir, { recursive: true })

  const input = sharp(source).rotate() // honour EXIF orientation
  const meta = await input.metadata()
  console.log(`source: ${source}`)
  console.log(`       ${meta.width}x${meta.height} ${meta.format}`)

  for (const width of WIDTHS) {
    // Height keeps the source aspect ratio, rounded to whole pixels.
    const height = Math.round((meta.height / meta.width) * width)
    const base = path.join(outDir, `vinay-${width}`)

    const jpg = path.join(outDir, `vinay-${width}.jpg`)
    const webp = path.join(outDir, `vinay-${width}.webp`)

    const resized = sharp(source).rotate().resize({ width, height, fit: 'cover', position: 'top' })

    await resized.clone().jpeg({ quality: 82, mozjpeg: true, progressive: true }).toFile(jpg)
    await resized.clone().webp({ quality: 78, effort: 6 }).toFile(webp)

    const jpgSize = (await stat(jpg)).size
    const webpSize = (await stat(webp)).size
    console.log(
      `  vinay-${width}  ${width}x${height}  jpg ${(jpgSize / 1024).toFixed(1)}kB  webp ${(webpSize / 1024).toFixed(1)}kB`,
    )
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
