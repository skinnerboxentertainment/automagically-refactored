/**
 * Procedural SFX generation via jsfxr.
 *
 * CLI:
 *   tsx src/sfxr.ts pickupCoin --output path/to/output.wav
 *
 * API:
 *   import { generateSFX } from "./sfxr"
 *   const buffer = generateSFX("pickupCoin")
 */

import { sfxr } from "jsfxr"
import fs from "node:fs"

const presetNames = [
  "pickupCoin",
  "laserShoot",
  "explosion",
  "powerUp",
  "hitHurt",
  "jump",
  "blip",
  "random",
] as const

export type SfxrPreset = (typeof presetNames)[number]

export function generateSFX(preset: SfxrPreset | string): Buffer {
  const params = sfxr.generate(preset)
  const riff = sfxr.toWave(params)
  return Buffer.from(riff.wav as ArrayBuffer)
}

export { presetNames }

// CLI
const args = process.argv.slice(2)
const presetName = args.find((a) => !a.startsWith("--"))
const outputFlag = args.indexOf("--output")
const outputPath = outputFlag !== -1 ? args[outputFlag + 1] : undefined

if (presetName) {
  try {
    const buffer = generateSFX(presetName)
    if (outputPath) {
      fs.writeFileSync(outputPath, buffer)
      console.log(`Generated "${presetName}" → ${outputPath} (${buffer.length} bytes)`)
    } else {
      process.stdout.write(buffer)
    }
  } catch (err) {
    console.error(`Error generating "${presetName}":`, (err as Error).message)
    console.error(`Available presets: ${presetNames.join(", ")}`)
    process.exit(1)
  }
}
