import fs from 'fs';

const scriptPath = 'c:/Users/User/Saved Games/CS2/2history/script.js';
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Helper to extract by markers (simplified for this specific file)
function extractObject(content, startMarker, endMarker) {
    const startIndex = content.indexOf(startMarker);
    if (startIndex === -1) return null;
    const fromStart = content.substring(startIndex + startMarker.length);
    const endIndex = fromStart.indexOf(endMarker);
    if (endIndex === -1) return null;
    return fromStart.substring(0, endIndex + endMarker.length - (endMarker.endsWith(',') ? 1 : 0)).trim();
}

// 1. Questions
// Start: questions:\n        [
// End: ],\n\n    // Переводы
const questionsMatch = scriptContent.match(/questions:\s*\[([\s\S]*?)\]\s*,\s*\n\s*\n\s*\/\/ Переводы/);
if (questionsMatch) {
    const questionsText = '[' + questionsMatch[1].trim() + ']';
    // Remove trailing commas before closing bracket/brace for valid JSON
    const cleanQuestions = questionsText.replace(/,(\s*[\]\}])/g, '$1');
    fs.writeFileSync('c:/Users/User/Saved Games/CS2/2history/assets/data/questions.json', cleanQuestions);
    console.log('Extracted questions.json');
} else {
    console.log('Failed to extract questions');
}

// 2. eraTerritories
const eraMatch = scriptContent.match(/eraTerritories:\s*\{([\s\S]*?)\}\s*,\s*\n\s*\}/);
if (eraMatch) {
    const eraText = '{' + eraMatch[1].trim() + '}';
    const cleanEra = eraText.replace(/,(\s*[\]\}])/g, '$1');
    fs.writeFileSync('c:/Users/User/Saved Games/CS2/2history/assets/data/eras.json', cleanEra);
    console.log('Extracted eras.json');
}

// 3. countryData
const countryMatch = scriptContent.match(/countryData:\s*\{([\s\S]*?)\}\s*,\s*\n\s*\/\/ Настройка/);
if (countryMatch) {
    const countryText = '{' + countryMatch[1].trim() + '}';
    const cleanCountry = countryText.replace(/,(\s*[\]\}])/g, '$1');
    fs.writeFileSync('c:/Users/User/Saved Games/CS2/2history/assets/data/countries.json', cleanCountry);
    console.log('Extracted countries.json');
}

// 4. presetColors
const colorsMatch = scriptContent.match(/const presetColors = \{([\s\S]*?)\};/);
if (colorsMatch) {
    const colorsText = '{' + colorsMatch[1].trim() + '}';
    const cleanColors = colorsText.replace(/,(\s*[\]\}])/g, '$1');
    fs.writeFileSync('c:/Users/User/Saved Games/CS2/2history/assets/data/colors.json', cleanColors);
    console.log('Extracted colors.json');
}
