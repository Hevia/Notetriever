// import { IpcMainInvokeEvent } from 'electron';
// import lunr from 'lunr';

// let index: lunr.Index;

// export function createLunrIndex(event: IpcMainInvokeEvent, documents: { filepath: string, text: string }[]){
//     index = lunr(function () {
//         this.ref('filepath');
//         this.field('text');

//         documents.forEach(function (doc) {
//             this.add(doc);
//         }, this);
//     });
// }

// export function searchIndex(event: IpcMainInvokeEvent, query: string): string[] {
//     const results = index.search(query);
//     const filePaths: string[] = [];

//     results.forEach(function (result) {
//         filePaths.push(result.ref);
//     });

//     return filePaths;
// }