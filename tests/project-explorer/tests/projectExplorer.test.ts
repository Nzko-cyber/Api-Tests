import {getProjectExplorer} from "../functions/projectExplorer";

let en = {
    project1Id: '50a7eee3-aa4e-4f2d-9570-ea3bb662c6f1',
    invalidID: 'invalid-id',
    nonExistentID: 'z281a5d4-ecf4-47e2-ba45-a76f6ba6ba0z',
    folder1Id: '40ebe757-9ef4-45cd-9c19-a6dbc1651137',
    folder2Id: '29ad719a-92b8-4da1-8060-049fd666e194'
}

let response: any;

describe(' PROJECT EXPLORER::ProjectExplorer', () => {
    describe('1 - Get ProjectExplorer :: Get /project-explorer/api/ProjectExplorer', () => {
        it('1.1 - Retrieves ProjectExplorer with a valid ProjectId', async () => {
            response = await getProjectExplorer(en.project1Id);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('items');
            expect(response.body).toHaveProperty('counts');
        });

        it('1.2 - Fails to retrieve ProjectExplorer with an invalid ProjectId', async () => {
            response = await getProjectExplorer(en.invalidID, en.folder1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors['']).toEqual([`Project not found with id: ${en.invalidID}`]);
        });

        it('1.3 - Fails to retrieve ProjectExplorer with a non-existent ProjectId', async () => {
            response = await getProjectExplorer(en.nonExistentID, en.folder1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors['']).toEqual([`Project not found with id: ${en.nonExistentID}`]);
        });

        it('1.4 - Retrieves ProjectExplorer with a valid Project and Folder', async () => {
            response = await getProjectExplorer(en.project1Id, en.folder1Id);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('items');
            expect(response.body).toHaveProperty('counts');
        });

        it('1.5 - Fails to retrieve ProjectExplorer with an invalid FolderId', async () => {
            response = await getProjectExplorer(en.project1Id, en.invalidID);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors['']).toEqual('Folder not found');
        });

        it('1.6 - Fails to retrieve ProjectExplorer with a non-existent FolderId', async () => {
            response = await getProjectExplorer(en.project1Id, en.nonExistentID);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors['']).toEqual('Folder not found');
        });

        it('1.7 - Retrieves ProjectExplorer without a ProjectId', async () => {
            response = await getProjectExplorer(null);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('items');
            expect(response.body).toHaveProperty('counts');
        });

        it('1.8 - Retrieves ProjectExplorer using a valid search term', async () => {
            response = await getProjectExplorer(en.project1Id, null, 'test');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('items');
            expect(response.body).toHaveProperty('counts');
        });

        it('1.9 - Handles retrieval with an invalid search term gracefully', async () => {
            response = await getProjectExplorer(en.project1Id, null, 'invalidSearchTerm');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('items');
            expect(response.body).toHaveProperty('counts');
        });
    });
});
