import {randomString} from "../../utils";
import {
    createFolder,
    deleteFolder,
    getFolder,
    updateFolder,
    updateFolderName,
    updateFolderParentId
} from "../functions/folder";

let en: any = {
    nonExistentID: 'z281a5d4-ecf4-47e2-ba45-a76f6ba6ba0z',
    invalidID: 'invalid-id',
    project1Id: '50a7eee3-aa4e-4f2d-9570-ea3bb662c6f1',
    project2Id: 'ca0b2dbe-c55d-4220-b1b1-3dd7ab28fd30',
};

let response: any;

describe('API_BACKEND::PROJECTEXPLORER::Folder', () => {
    describe('1 - Creating Folder :: Post /project-explorer/api/Folder', () => {
        it('1.1 - Successfully creates a folder without a ParentId', async () => {
            en.folder1Name = randomString(15);
            response = await createFolder(en.folder1Name, en.project1Id);
            expect(response.statusCode).toBe(200);
            en.folder1Id = response.body;
        });

        it('1.2 - Successfully creates a folder with a valid ParentId', async () => {
            en.folder2Name = randomString(15);
            response = await createFolder(en.folder2Name, en.project1Id, en.folder1Id);
            expect(response.statusCode).toBe(200);
            en.folder2Id = response.body;
        });

        it('1.3 - Fails when folder name is not provided', async () => {
            response = await createFolder(null, en.project1Id);
            expect(response.statusCode).toBe(400);
        });

        it('1.4 - Fails when ProjectId is not provided', async () => {
            response = await createFolder(randomString(15), '');
            expect(response.statusCode).toBe(400);
        });

        it('1.5 - Fails when ParentId is invalid', async () => {
            response = await createFolder(randomString(15), en.project1Id, en.invalidID);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors).toEqual({'': ['Folder not found']});
        });

        it('1.6 - Fails when folder name already exists', async () => {
            response = await createFolder(en.folder1Name, en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors).toEqual({'': [`Folder already exist: /${en.folder1Name}`]});
        });

        it('1.7 - Successfully creates a folder with a duplicate name in a different project', async () => {
            response = await createFolder(en.folder1Name, en.project2Id);
            expect(response.statusCode).toBe(200);
            en.folder3Id = response.body;
        });

        it('1.8 - Successfully creates a folder with a duplicate name under a parent folder', async () => {
            response = await createFolder(en.folder1Name, en.project1Id, en.folder1Id);
            expect(response.statusCode).toBe(200);
            en.folder4Id = response.body;
        });

        it('1.9 - Fails when folder name is empty', async () => {
            response = await createFolder('');
            expect(response.statusCode).toBe(400);
        });

        it('1.10 - Fails when folder name is shorter than 3 characters', async () => {
            response = await createFolder(randomString(2), en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Name).toEqual(['The name must be between 3 and 50 characters long.']);
        });

        it('1.11 - Successfully creates a folder with a 3-character name', async () => {
            en.folder4Name = randomString(3);
            response = await createFolder(en.folder4Name, en.project1Id);
            expect(response.statusCode).toBe(200);
            en.folder5Id = response.body;
        });

        it('1.12 - Successfully creates a folder with a 50-character name', async () => {
            en.folder5Name = randomString(50);
            response = await createFolder(en.folder5Name, en.project1Id);
            expect(response.statusCode).toBe(200);
            en.folder6Id = response.body;
        });

        it('1.13 - Fails when folder name exceeds 50 characters', async () => {
            response = await createFolder(randomString(51), en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Name).toEqual(['The name must be between 3 and 50 characters long.']);
        });

        it('1.14 - Fails when folder name contains special characters', async () => {
            en.folder6Name = '@#$%' + randomString(10);
            response = await createFolder(en.folder6Name, en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Name).toEqual(['The name cannot contain special characters.']);
        });

        it('1.15 - Fails when folder name starts with a number', async () => {
            response = await createFolder('12' + randomString(10), en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Name).toEqual(['The name must start with a letter.']);
        });
    });

    describe('2 - Retrieve Folder :: Get /project-explorer/api/Folder?id={id}', () => {
        it('2.1 - Retrieves a folder without a parent folder', async () => {
            response = await getFolder(en.folder1Id, en.project1Id);
            expect(response.statusCode).toBe(200);
            expect(response.body.name).toBe(en.folder1Name);
            expect(response.body.projectId).toBe(en.project1Id);
            expect(response.body.parentId).toBe(null);
            expect(response.body.id).toBe(en.folder1Id);
        });

        it('2.2 - Retrieves a folder with a valid parent folder', async () => {
            response = await getFolder(en.folder2Id, en.project1Id);
            expect(response.statusCode).toBe(200);
            expect(response.body.name).toBe(en.folder2Name);
            expect(response.body.projectId).toBe(en.project1Id);
            expect(response.body.parentId).toBe(en.folder1Id);
            expect(response.body.id).toBe(en.folder2Id);
        });

        it('2.3 - Fails when FolderId is not provided', async () => {
            response = await getFolder('', en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors.id).toEqual(["The id field is required."]);
        });

        it('2.4 - Fails when FolderId is invalid', async () => {
            response = await getFolder(en.invalidID, en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors).toEqual({'': [`Folder ${en.invalidID} not found`]});
        });

        it('2.5 - Fails when FolderId does not exist', async () => {
            response = await getFolder(en.nonExistentID, en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors).toEqual({'': [`Folder ${en.nonExistentID} not found`]});
        });

        it('2.6 - Retrieves a folder with a duplicate name in a different project', async () => {
            response = await getFolder(en.folder3Id, en.project2Id);
            expect(response.statusCode).toBe(200);
            expect(response.body.name).toBe(en.folder1Name);
            expect(response.body.projectId).toBe(en.project2Id);
            expect(response.body.parentId).toBe(null);
            expect(response.body.id).toBe(en.folder3Id);
        });

        it('2.7 - Retrieves a folder with a duplicate parent folder name', async () => {
            response = await getFolder(en.folder4Id, en.project1Id);
            expect(response.statusCode).toBe(200);
            expect(response.body.name).toBe(en.folder1Name);
            expect(response.body.projectId).toBe(en.project1Id);
            expect(response.body.parentId).toBe(en.folder1Id);
            expect(response.body.id).toBe(en.folder4Id);
        });

        it('2.8 - Fails when ProjectId is not provided', async () => {
            response = await getFolder(en.folder1Id, '');
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors).toEqual({'': [`Folder ${en.folder1Id} not found`]});
        });
    });

    describe('3 - Update Folder :: Put /project-explorer/api/Folder', () => {
        it('3.1 - Updates a folder with valid parameters', async () => {
            en.folder1Name = randomString(15);
            response = await updateFolder(en.folder1Id, en.folder1Name, en.project1Id);
            expect(response.statusCode).toBe(204);
        });

        it('3.1.1 - Validates the updated folder', async () => {
            response = await getFolder(en.folder1Id, en.project1Id);
            expect(response.statusCode).toBe(200);
            expect(response.body.name).toBe(en.folder1Name);
            expect(response.body.projectId).toBe(en.project1Id);
            expect(response.body.parentId).toBe(null);
            expect(response.body.id).toBe(en.folder1Id);
        });

        it('3.2 - Fails when FolderId is not provided', async () => {
            response = await updateFolder('', en.folder1Name, en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors.Id).toEqual(["The Id field is required."]);
        });

        it('3.3 - Fails when FolderId is invalid', async () => {
            response = await updateFolder(en.invalidID, en.folder1Name, en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors).toEqual({'': [`Folder not found: ${en.invalidID}`]});
        });

        it('3.4 - Fails when Parent FolderId is invalid', async () => {
            response = await updateFolder(en.folder1Id, en.folder1Name, en.project1Id, en.invalidID);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors.parentId).toEqual([`Folder ${en.invalidID} not found`]);
        });

        it('3.5 - Fails when ProjectId is invalid', async () => {
            response = await updateFolder(en.folder2Id, en.folder2Name, en.invalidID);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors).toEqual({'': [`Project not found with id: ${en.invalidID}`]});
        });

        it('3.6 - Fails when updating a folder with a duplicate name', async () => {
            response = await updateFolder(en.folder6Id, en.folder1Name, en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Name).toEqual([`Folder already exist: ${en.folder1Name}`]);
        });

        it('3.7 - Successfully updates a folder with a duplicate name in a different project', async () => {
            response = await updateFolder(en.folder3Id, en.folder1Name, en.project2Id);
            expect(response.statusCode).toBe(204);
        });

        it('3.8 - Successfully updates a folder with a duplicate parent folder name', async () => {
            response = await updateFolder(en.folder4Id, en.folder4Name, en.project1Id);
            expect(response.statusCode).toBe(204);
        });

        it('3.9 - Fails when folder name is empty', async () => {
            response = await updateFolder(en.folder1Id, '', en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors.Name).toEqual(["'Name' must not be empty."]);
        });

        it('3.10 - Fails when folder name is shorter than 3 characters', async () => {
            response = await updateFolder(en.folder1Id, randomString(2), en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Name).toEqual(["The name must be between 3 and 50 characters long."]);
        });

        it('3.11 - Updates a folder with a 3-character name', async () => {
            en.folder5Name = randomString(3);
            response = await updateFolder(en.folder5Id, en.folder5Name, en.project1Id);
            expect(response.statusCode).toBe(204);
        });

        it('3.11.1 - Validates the folder update with a 3-character name', async () => {
            response = await getFolder(en.folder5Id, en.project1Id);
            expect(response.statusCode).toBe(200);
            expect(response.body.name).toBe(en.folder5Name);
            expect(response.body.projectId).toBe(en.project1Id);
            expect(response.body.parentId).toBe(null);
            expect(response.body.id).toBe(en.folder5Id);
        });

        it('3.12 - Updates a folder with a 50-character name', async () => {
            en.folder6Name = randomString(50);
            response = await updateFolder(en.folder6Id, en.folder6Name, en.project1Id);
            expect(response.statusCode).toBe(204);
        });

        it('3.12.1 - Validates the folder update with a 50-character name', async () => {
            response = await getFolder(en.folder6Id, en.project1Id);
            expect(response.statusCode).toBe(200);
            expect(response.body.name).toBe(en.folder6Name);
            expect(response.body.projectId).toBe(en.project1Id);
            expect(response.body.parentId).toBe(null);
            expect(response.body.id).toBe(en.folder6Id);
        });
        it('3.13 - Fails when folder name exceeds 50 characters', async () => {
            response = await updateFolder(en.folder6Id, randomString(51), en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Name).toEqual(["The name must be between 3 and 50 characters long."]);
        });

        it('3.14 - Fails when folder name contains special characters', async () => {
            en.folder6Name = '@#$%' + randomString(10);
            response = await updateFolder(en.folder6Id, en.folder6Name, en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Name).toEqual(["The name cannot contain special characters."]);
        });

        it('3.15 - Fails when folder name starts with a number', async () => {
            response = await updateFolder(en.folder6Id, '12' + randomString(10), en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Name).toEqual(["The name must start with a letter."]);
        });
    });

    describe('4 - Update Folder Parent Id And Name :: Put /project-explorer/api/Folder/updateFolder+(ParentId, Name)', () => {
        it('4.1 - Updates ParentId with a valid ParentId', async () => {
            response = await updateFolderParentId(en.folder4Id, en.folder1Id);
            expect(response.statusCode).toBe(204);
        });

        it('4.1.1 - Verifies updated folder after ParentId change', async () => {
            response = await getFolder(en.folder4Id, en.project1Id);
            expect(response.statusCode).toBe(200);
            expect(response.body.name).toBe(en.folder4Name);
            expect(response.body.projectId).toBe(en.project1Id);
            expect(response.body.parentId).toBe(en.folder1Id);
            expect(response.body.id).toBe(en.folder4Id);
        });

        it('4.2 - Fails to update ParentId when FolderId is missing', async () => {
            response = await updateFolderParentId('', en.folder1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors.id).toEqual(["The id field is required."]);
        });

        it('4.3 - Fails to update ParentId when FolderId is invalid', async () => {
            response = await updateFolderParentId(en.invalidID, en.folder1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors).toEqual({'': [`Folder ${en.invalidID} not found`]});
        });

        it('4.4 - Fails to update ParentId with an invalid ParentId', async () => {
            response = await updateFolderParentId(en.folder4Id, en.invalidID);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors).toEqual({'': [`Folder ${en.folder4Id} not found`]});
        });

        it('4.5 - Updates folder name with a valid name', async () => {
            en.folder1Name = randomString(15);
            response = await updateFolderName(en.folder1Id, en.folder1Name, en.project1Id);
            expect(response.statusCode).toBe(204);
        });

        it('4.5.1 - Verifies updated folder after name change', async () => {
            response = await getFolder(en.folder1Id, en.project1Id);
            expect(response.statusCode).toBe(200);
            expect(response.body.name).toBe(en.folder1Name);
            expect(response.body.projectId).toBe(en.project1Id);
            expect(response.body.parentId).toBe(null);
            expect(response.body.id).toBe(en.folder1Id);
        });

        it('4.6 - Fails to update folder name when FolderId is missing', async () => {
            response = await updateFolderName('', en.folder1Name, en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.id).toEqual(["The id field is required."]);
        });

        it('4.7 - Fails to update folder name with a duplicate name', async () => {
            response = await updateFolderName(en.folder6Id, en.folder1Name, en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors.Name).toEqual([`Folder already exist: ${en.folder1Name}`]);
        });

        it('4.8 - Fails to update folder name with a name shorter than 3 characters', async () => {
            response = await updateFolderName(en.folder1Id, randomString(2), en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors.Name).toEqual(["The name must be between 3 and 50 characters long."]);
        });

        it('4.9 - Updates folder name with a name of 3 characters', async () => {
            en.folder5Name = randomString(3);
            response = await updateFolderName(en.folder5Id, en.folder5Name, en.project1Id);
            expect(response.statusCode).toBe(204);
        });

        it('4.9.1 - Verifies updated folder with 3-character name', async () => {
            response = await getFolder(en.folder5Id, en.project1Id);
            expect(response.statusCode).toBe(200);
            expect(response.body.name).toBe(en.folder5Name);
            expect(response.body.projectId).toBe(en.project1Id);
            expect(response.body.parentId).toBe(null);
            expect(response.body.id).toBe(en.folder5Id);
        });

        it('4.10 - Updates folder name with a name of 50 characters', async () => {
            en.folder6Name = randomString(50);
            response = await updateFolderName(en.folder6Id, en.folder6Name, en.project1Id);
            expect(response.statusCode).toBe(204);
        });

        it('4.10.1 - Verifies updated folder with 50-character name', async () => {
            response = await getFolder(en.folder6Id, en.project1Id);
            expect(response.statusCode).toBe(200);
            expect(response.body.name).toBe(en.folder6Name);
            expect(response.body.projectId).toBe(en.project1Id);
            expect(response.body.parentId).toBe(null);
            expect(response.body.id).toBe(en.folder6Id);
        });

        it('4.11 - Fails to update folder name with a name exceeding 50 characters', async () => {
            response = await updateFolderName(en.folder6Id, randomString(51), en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors.Name).toEqual(["The name must be between 3 and 50 characters long."]);
        });

        it('4.12 - Fails to update folder name with special characters', async () => {
            en.folder6Name = '@#$%' + randomString(10);
            response = await updateFolderName(en.folder6Id, en.folder6Name, en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors.Name).toEqual(["The name cannot contain special characters."]);
        });

        it('4.13 - Fails to update folder name when it starts with a number', async () => {
            response = await updateFolderName(en.folder6Id, '12' + randomString(10), en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors.Name).toEqual(["The name must start with a letter."]);
        });

        it('4.14 - Fails to update folder name when the name is empty', async () => {
            response = await updateFolderName(en.folder1Id, '', en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors.Name).toEqual(["'Name' must not be empty."]);
        });

        it('4.15 - Fails to update ParentId when ProjectId is missing', async () => {
            response = await updateFolderParentId(en.folder4Id, en.folder1Id, '');
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors).toEqual({'': [`Folder ${en.folder4Id} not found`]});
        });
    });

    describe('5 - Delete Folder :: Delete /project-explorer/api/Folder?id={id}', () => {
        it('5.1 - Deletes a valid folder successfully', async () => {
            response = await deleteFolder(en.folder6Id, en.project1Id);
            expect(response.statusCode).toBe(204);
        });

        it('5.2 - Fails to delete when FolderId is missing', async () => {
            response = await deleteFolder('', en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors.id).toEqual(["The id field is required."]);
        });

        it('5.3 - Fails to delete with an invalid FolderId', async () => {
            response = await deleteFolder(en.invalidID, en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors.id).toEqual([`Folder ${en.invalidID} not found`]);
        });

        it('5.4 - Deletes a parent folder successfully', async () => {
            response = await deleteFolder(en.folder1Id, en.project1Id);
            expect(response.statusCode).toBe(204);
        });

        it('5.5 - Deletes multiple folders across projects successfully', async () => {
            await deleteFolder(en.folder2Id, en.project1Id);
            await deleteFolder(en.folder3Id, en.project2Id);
            await deleteFolder(en.folder4Id, en.project1Id);
            await deleteFolder(en.folder5Id, en.project1Id);
        });
    });
});