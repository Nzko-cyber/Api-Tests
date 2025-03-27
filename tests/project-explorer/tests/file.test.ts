import { createFile, deleteFile, getFile, uploadFile } from "../functions/file";

interface TestData {
    nonExistentID: string;
    invalidID: string;
    project1Id: string;
    project2Id: string;
    folder1Id: string;
    fileSource: string;
    file1Id?: string;
    file1Name?: string;
    file2Id?: string;
}

let en: TestData = {
    nonExistentID: 'z281a5d4-ecf4-47e2-ba45-a76f6ba6ba0z',
    invalidID: 'invalid-id',
    project1Id: '50a7eee3-aa4e-4f2d-9570-ea3bb662c6f1',
    project2Id: 'ca0b2dbe-c55d-4220-b1b1-3dd7ab28fd30',
    folder1Id: '40ebe757-9ef4-45cd-9c19-a6dbc1651137',
    fileSource: 'tests/sources/people-100.csv'
};

let response: any;

describe('API_BACKEND::PROJECT EXPLORER::File', () => {
    beforeEach(() => {
        allure.epic("Project Explorer");
        allure.feature("Analysis API Tests");
        allure.owner("QA Team");
    });
    describe('1 - Uploading File :: Post /project-explorer/api/File/upload', () => {
        allure.story("Upload a file to the project explorer");
        
        it('1.1 - Upload: Successfully uploads a valid file', async () => {
            allure.story("Successfully uploads a valid file");
            allure.description("This test validates that a file can be uploaded to the project explorer");
            
            response = await uploadFile(en.fileSource, en.project1Id);
            allure.attachment('Upload Response', JSON.stringify(response.body, null, 2), 'application/json');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('fileId');
            expect(response.body).toHaveProperty('fileName');
            en.file1Id = response.body.fileId;
            en.file1Name = response.body.fileName;
        });

        it('1.2 - Upload: Fails when no file is provided', async () => {
            allure.story("Fails when no file is provided");
            allure.description("This test validates that an error is returned when no file is provided");
            
            response = await uploadFile(null as any, en.project1Id);
            console.log(response.body);
            expect(response.statusCode).toBe(400);
            expect(response.title).toBe('One or more validation errors occurred.');
            expect(response.errors.file).toEqual('The file field is required.');
        });

        it('1.3 - Upload: Fails with an invalid Project ID', async () => {
            allure.story("Fails with an invalid Project ID");
            allure.description("This test validates that an error is returned when an invalid project ID is provided");
            
            response = await uploadFile(en.fileSource, en.invalidID);
            console.log(response.body);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors.projectId).toEqual('Project not found');
        });

        it('1.4 - Upload: Fails with an unsupported file type', async () => {
            allure.story("Fails with an unsupported file type");
            allure.description("This test validates that an error is returned when an unsupported file type is provided");
            
            response = await uploadFile('tests/sources/1.1-MB-1.jpg', en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors.file).toEqual('The file type jpg is not allowed.');
        });
    });

    describe('2 - Creating File :: Post /project-explorer/api/File', () => {
        allure.story("Create a file in the project explorer");
        
        it('2.1 - Create: Successfully processes a valid file', async () => {
            allure.story("Successfully processes a valid file");
            allure.description("This test validates that a file can be processed in the project explorer");
            
            response = await createFile(en.file1Id!, en.file1Name!, en.project1Id, en.folder1Id);
            expect(response.statusCode).toBe(200);
            en.file2Id = response.body;
        });

        it('2.3 - Create: Fails when the option field is missing', async () => {
            allure.story("Fails when the option field is missing");
            allure.description("This test validates that an error is returned when the option field is missing");
            
            response = await createFile(en.file1Id!, en.file1Name!, en.project1Id, en.folder1Id, null as any);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors.option).toEqual('The option field is required.');
        });

        it('2.4 - Create: Fails with an invalid File ID', async () => {
            allure.story("Fails with an invalid File ID");
            allure.description("This test validates that an error is returned when an invalid file ID is provided");
            
            response = await createFile(en.invalidID, en.file1Name!, en.project1Id, en.folder1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors['']).toEqual('File not found');
        });

        it('2.5 - Create: Fails with an invalid Project ID', async () => {
            allure.story("Fails with an invalid Project ID");
            allure.description("This test validates that an error is returned when an invalid project ID is provided");
            
            response = await createFile(en.file1Id!, en.file1Name!, en.invalidID, en.folder1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors['']).toContain([`Project not found with id: ${en.invalidID}`]);
        });

        it('2.6 - Create: Fails with an invalid Folder ID', async () => {
            allure.story("Fails with an invalid Folder ID");
            allure.description("This test validates that an error is returned when an invalid folder ID is provided");
            
            response = await createFile(en.file1Id!, en.file1Name!, en.project1Id, en.invalidID);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors['']).toEqual(['Folder not found']);
        });
    });

    describe('3 - Getting File :: Get /project-explorer/api/File/download', () => {
        allure.story("Get a file from the project explorer");
        
        it('3.1 - Get: Successfully retrieves a valid file', async () => {
            allure.story("Successfully retrieves a valid file");
            allure.description("This test validates that a file can be retrieved from the project explorer");
            
            response = await getFile(en.file1Id!, en.project1Id);
            expect(response.statusCode).toBe(200);
        });

        it('3.2 - Get: Fails with an invalid File ID', async () => {
            allure.story("Fails with an invalid File ID");
            allure.description("This test validates that an error is returned when an invalid file ID is provided");
            
            response = await getFile(en.invalidID, en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors['']).toEqual([`Resource ${en.invalidID} not found`]);
        });

        it('3.3 - Get: Fails with an invalid Project ID', async () => {
            allure.story("Fails with an invalid Project ID");
            allure.description("This test validates that an error is returned when an invalid project ID is provided");
            
            response = await getFile(en.file2Id!, en.invalidID);
            console.log(response);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors).toEqual({'': [`Project not found with id: ${en.invalidID}`]});
        });

        it('3.4 - Get: Fails when File ID is missing', async () => {
            allure.story("Fails when File ID is missing");
            allure.description("This test validates that an error is returned when the File ID is missing");
            
            response = await getFile(null as any, en.project1Id);
            console.log(response.body);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors).toEqual({'': ['Resource null not found']});
        });

        it('3.5 - Get: Fails when Project ID is missing', async () => {
            allure.story("Fails when Project ID is missing");
            allure.description("This test validates that an error is returned when the Project ID is missing");
            
            response = await getFile(en.file2Id!);
            console.log(response.body);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors).toEqual({"": [`Resource ${en.file2Id} not found`]});
        });
    });

    describe('4 - Deleting File :: Delete /project-explorer/api/ProjectExplorer/DeleteResource?id=${id}', () => {
        allure.story("Delete a file from the project explorer");
        allure.description("This test validates that a file can be deleted from the project explorer");
        
        it('4.1 - Delete: Successfully deletes the first file', async () => {
            allure.story("Successfully deletes the first file");
            allure.description("This test validates that a file can be deleted from the project explorer");
            
            response = await deleteFile(en.file1Id!, en.project1Id);
            expect(response.statusCode).toBe(200);
        });

        it('4.2 - Delete: Successfully deletes the second file', async () => {
            allure.story("Successfully deletes the second file");
            allure.description("This test validates that a file can be deleted from the project explorer");
            
            response = await deleteFile(en.file2Id!, en.project1Id);
            expect(response.statusCode).toBe(200);
        });

        it('4.3 - Delete: Fails when file does not exist', async () => {
            allure.story("Fails when file does not exist");
            allure.description("This test validates that an error is returned when the file does not exist");
            
            response = await deleteFile(en.nonExistentID, en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors['']).toEqual(`Resource ${en.nonExistentID} not found`);
        });

        it('4.4 - Delete: Fails with an invalid Project ID', async () => {
            allure.story("Fails with an invalid Project ID");
            allure.description("This test validates that an error is returned when an invalid project ID is provided");
            
            response = await deleteFile(en.file2Id!, en.invalidID);
            console.log(response);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors['']).toEqual(`Project not found with id: ${en.invalidID}`);
        });
    });
});
