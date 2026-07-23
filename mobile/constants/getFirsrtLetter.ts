export const getFirstLetter = (name: string): string => {
    if (!name || !name.trim()) return '#'

    const cleanName = name.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const firstChar = cleanName.charAt(0)

    // 1. English A-Z
    if (/^[a-zA-Z]/.test(firstChar)) {
        return firstChar.toUpperCase()
    }

    // 2. Japanese Hiragana / Katakana -> English Romaji initial
    const code = firstChar.charCodeAt(0)
    if ((code >= 0x3041 && code <= 0x3096) || (code >= 0x30A1 && code <= 0x30F6)) {
        const kanaMap: [RegExp, string][] = [
            [/^[あいうえおアイウエオぁぃぅぇぉァィゥェォ]/, 'A'],
            [/^[かきくけこカキクケコがぎぐげごガギグゲゴ]/, 'K'],
            [/^[さしすせそサシスセソざじずぜぞザジズゼゾ]/, 'S'],
            [/^[たちつてとタチツテトだぢづでどダヂヅデド]/, 'T'],
            [/^[なにぬねのナニヌネノ]/, 'N'],
            [/^[はひふへほハヒフヘホばびぶべぼバビブベボぱぴぷぺぽパピプペポ]/, 'H'],
            [/^[まみむめもマミムメモ]/, 'M'],
            [/^[やゆよヤユヨゃゅょャュョ]/, 'Y'],
            [/^[らりるれろラリルレロ]/, 'R'],
            [/^[わをんワヲン]/, 'W'],
        ]
        for (const [regex, letter] of kanaMap) {
            if (regex.test(firstChar)) return letter
        }
    }

    // 3. Chinese Hanzi -> Pinyin initial letter via locale comparison anchors
    if (/[\u4e00-\u9fa5]/.test(firstChar)) {
        const pinyinAnchors = ['吖', '八', '嚓', '哒', '妸', '发', '旮', '哈', '讥', '咔', '垃', '妈', '拏', '噢', '妑', '七', '亽', '仨', '牠', '穵', '夕', '丫', '帀']
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z']

        for (let i = 0; i < pinyinAnchors.length - 1; i++) {
            if (
                firstChar.localeCompare(pinyinAnchors[i], 'zh-Hans-CN') >= 0 &&
                firstChar.localeCompare(pinyinAnchors[i + 1], 'zh-Hans-CN') < 0
            ) {
                return letters[i]
            }
        }
        if (firstChar.localeCompare(pinyinAnchors[pinyinAnchors.length - 1], 'zh-Hans-CN') >= 0) {
            return 'Z'
        }
    }

    // 4. Default fallback for numbers and other symbols
    return '#'
}