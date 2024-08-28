import { IpcMainInvokeEvent } from 'electron';
import * as lancedb from 'vectordb';
import { Table, Connection, Query } from 'vectordb';

export class VectorDBManager {
    private connected = false;
    private db: Connection;
    private table: Table<number[]>;

    constructor(private dbName: string, private tableName: string) {}

    async createDB(data: Array<Record<string, unknown>>) {
        this.db = await lancedb.connect(this.dbName);
        this.table = await this.db.createTable({
            name: this.tableName,
            data: data
        });
    }

    async connect() {
        this.db = await lancedb.connect(this.dbName);
        
        const tableNames = await this.db.tableNames();

        if (tableNames.includes(this.tableName)) {
            this.table = await this.db.openTable(this.tableName);
        } else {
            this.table = await this.db.createTable({
                name: this.tableName,
                data: []
            });
        }
    }

    async insert(data: Array<Record<string, unknown>>) {
        await this.table.add(data);
    }

    async search(vector: number[], limit?: number, criteria?: string) {
        console.log('DEBUGGER Searching for:', vector);

        let query: Query = this.table.search(vector);

        console.log('DEBUGGER Query:', query);

        if (limit) {
        query = query.limit(limit);
        }

        if (criteria) {
        query = query.where(criteria);
        }

        return await query.execute();
    }

    async update(data: Array<Record<string, unknown>>) {
        await this.table.overwrite(data);
    }

    async delete(filter: string) {
        await this.table.delete(filter);
    }
}

export async function createVectorDB(event: IpcMainInvokeEvent, vectors: Array<Record<string, unknown>>): Promise<void> {
    const vectorDBManager = new VectorDBManager('nt-v2', 'vectors-v1');
    await vectorDBManager.createDB(vectors);
}

export async function readFromDB(event: IpcMainInvokeEvent, vector: number[], limit?: number): Promise<Record<string, unknown>[]> {
    const vectorDBManager = new VectorDBManager('nt-v2', 'vectors-v1');
    //TODO: console.log('DEBUGGER Trying to connect to db');
    await vectorDBManager.connect();
    //TODO:console.log('DEBUGGER Connected to db');
    const results = await vectorDBManager.search(vector, limit);
    //TODO:console.log('DEBUGGER Results:', results);
    return results;
}


// Usage example:
// const vectorDBManager = new VectorDBManager('data/sample-lancedb', 'vectors');
// await vectorDBManager.connect();
// await vectorDBManager.insert([
//   { id: 1, vector: [0.1, 0.2], item: "foo", price: 10 },
//   { id: 2, vector: [1.1, 1.2], item: "bar", price: 50 }
// ]);
// const results = await vectorDBManager.search([0.1, 0.3], 2);
// const rowsByCriteria = await vectorDBManager.search(undefined, undefined, "price >= 10");