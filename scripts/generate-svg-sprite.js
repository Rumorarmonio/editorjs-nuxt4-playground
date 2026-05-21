import fs from 'fs-extra'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { glob } from 'glob'
import svgstoreImport from 'svgstore'

const svgstore = svgstoreImport?.default ?? svgstoreImport

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function normalizePathSeparators(value) {
  return value.replaceAll('\\', '/')
}

function removeSvgExtension(value) {
  return value.replace(/\.svg$/i, '')
}

function createIconNameFromFilePath(filePathRelativeToIconsDir) {
  const normalized = normalizePathSeparators(filePathRelativeToIconsDir)
  return removeSvgExtension(normalized)
}

function createSymbolId(iconName) {
  return `icon/${iconName}`
}

function ensureSvgNamespace(spriteMarkup) {
  const hasXmlns = /\sxmlns=/.test(spriteMarkup)

  if (hasXmlns) {
    return spriteMarkup
  }

  return spriteMarkup.replace(
    /^<svg\b([^>]*)>/,
    '<svg$1 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
  )
}

async function generateSprite() {
  const iconsDir = path.resolve(__dirname, '../resources/assets/icons')
  const spriteOutputPath = path.resolve(__dirname, '../public/sprite.svg')
  const typesOutputPath = path.resolve(__dirname, '../resources/js/types/IconName.d.ts')

  const svgFiles = (await glob('**/*.svg', { cwd: iconsDir })).sort()

  if (svgFiles.length === 0) {
    console.warn('⚠️ SVG files not found:', iconsDir)
    return
  }

  const sprite = svgstore({ inline: true })
  const iconNames = []

  for (const svgFile of svgFiles) {
    const absolutePath = path.join(iconsDir, svgFile)
    const svgContent = await fs.readFile(absolutePath, 'utf8')

    const iconName = createIconNameFromFilePath(svgFile)
    const symbolId = createSymbolId(iconName)

    console.log(`✔️ Добавляю: ${symbolId} (${svgFile})`)

    sprite.add(symbolId, svgContent)
    iconNames.push(iconName)
  }

  const rawSpriteMarkup = sprite.toString({ inline: true })
  const spriteMarkup = ensureSvgNamespace(rawSpriteMarkup)

  await fs.outputFile(spriteOutputPath, spriteMarkup)
  console.log(`✅ Спрайт сгенерирован: ${svgFiles.length} иконок -> public/sprite.svg`)

  const typeFileContent =
    `// Этот файл генерируется автоматически в scripts/generate-svg-sprite.js\n` +
    `export type IconName =\n  ${iconNames.map((name) => `'${name}'`).join(' |\n  ')};\n`

  await fs.outputFile(typesOutputPath, typeFileContent)
  console.log(`✅ Тип IconName сгенерирован (${iconNames.length}) -> src/types/IconName.d.ts`)
}

generateSprite().catch((error) => {
  console.error('❌ Ошибка генерации SVG-спрайта:', error)
  process.exitCode = 1
})
