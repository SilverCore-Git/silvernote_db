import fs from "fs";
const fsp = fs.promises;
import path from "path";
import { File } from "./dbTypes";


const DB_FILE = path.join(__dirname, '../../', 'db.json');

if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify([]), 'utf-8');


class db 
{
    
    private async getDB(): Promise<File[]>
    {

        let db: File[];

        if (!fs.existsSync(DB_FILE)) db = [];
        db = JSON.parse(await fsp.readFile(DB_FILE, 'utf-8'));

        return db;

    }

    private async saveDB(db: File[]): Promise<void>
    {
        await fsp.writeFile(DB_FILE, JSON.stringify(db), 'utf-8');
    }


    public async push(tr: File): Promise<void>
    {
        const db = await this.getDB();

        db.push(tr);

        await this.saveDB(db);
    }

    public async get(uuid: string): Promise<File | undefined>
    {

        const db = await this.getDB();

        const File: File | undefined = db.find(File => File.UUID === uuid);

        return File;

    }

    public async update(section: File)
    {

        await this.delete(section.UUID);

        await this.push(section);

    }

    public async delete(uuid: string): Promise<void>
    {

        const db = await this.getDB();

        const newDb = db.filter(tr => tr.UUID !== uuid);

        await this.saveDB(newDb);

    }


    public async resetDB(): Promise<void>
    {
        await this.saveDB([]);
    }

}


export default new db();