import fs from 'fs';
import path from 'path';

export type PantryItem = { name: string; amount: number };
const pantryFile = path.join(__dirname, 'pantry.json');

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
    fs.writeFileSync(pantryFile, JSON.stringify(pantry, null, 2), 'utf-8');
}
