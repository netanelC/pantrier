import fs from 'fs';
import path from 'path';

export type PantryItem = { name: string; amount: number };
const pantryFile = path.join(path.dirname(__dirname), 'pantry.json');

export function loadPantry(): PantryItem[] {
    if (fs.existsSync(pantryFile)) {
        try {
            return JSON.parse(fs.readFileSync(pantryFile, 'utf-8'));
        } catch {
            return [];
        }
    }
    return [];
}

export function savePantry(pantry: PantryItem[]) {
    const sortedPantry = pantry.slice().sort((a, b) => a.name.localeCompare(b.name));
    fs.writeFileSync(pantryFile, JSON.stringify(sortedPantry, null, 2), 'utf-8');
}
