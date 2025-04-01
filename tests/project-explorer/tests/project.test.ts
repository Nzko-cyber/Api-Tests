import {createProject, deleteProject, getProject, getProjectWithPagination, updateProject} from "../functions/project";
import {randomString} from "../../utils";

let en: any = {
    nonExistentID: 'z281a5d4-ecf4-47e2-ba45-a76f6ba6ba0z',
    invalidID: 'invalid-id',
    namespace1ID: 'b92cd76f-d9d6-431a-bd25-5426ee44801e',
    namespace2ID: 'd533212e-25a2-485a-b2c2-31ba67bd803b',
};

let response: any = null;

describe(' PROJECTEXPLORER::Project', () => {
    describe('1 - API Tests :: Get with Pagination (GET)', () => {
        it('1.1 - Fetches paginated projects with a valid request', async () => {
            response = await getProjectWithPagination(null, 1, 10);
            expect(response.statusCode).toBe(200);
            expect(response.body.pageNumber).toBe(1);
            expect(response.body.pageSize).toBe(10);
            expect(response.body.hasNextPage).toBeDefined();
            expect(response.body.hasPreviousPage).toBeDefined();
            expect(response.body.totalCount).toBeDefined();
            expect(response.body.items).toBeDefined();
        });

        it('1.2 - Fails when page number is invalid (-1)', async () => {
            response = await getProjectWithPagination(null, -1, 10);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.PageNumber).toEqual(['PageNumber at least greater than or equal to 1.']);
        });

        it('1.3 - Handles requests with a very high page number', async () => {
            response = await getProjectWithPagination(null, 100000, 10);
            expect(response.statusCode).toBe(200);
            expect(response.body.pageNumber).toBe(100000);
            expect(response.body.pageSize).toBe(10);
        });

        it('1.4 - Fails when page size is invalid (-5)', async () => {
            response = await getProjectWithPagination(null, 1, -5);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.PageSize).toEqual(['PageSize at least greater than or equal to 1.']);
        });

        it('1.5 - Handles requests with invalid key names gracefully', async () => {
            response = await getProjectWithPagination(null, 1, null, null, null, null, {'PageSi': 15});
            expect(response.statusCode).toBe(200);
            expect(response.body.pageNumber).toBe(1);
            expect(response.body.pageSize).toBe(20);
        });

        it('1.6 - Fails when key value is invalid (-5 for PageSize)', async () => {
            response = await getProjectWithPagination(null, 1, null, null, null, null, {'PageSize': -5});
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.PageSize).toEqual(['PageSize at least greater than or equal to 1.']);
        });

        it('1.7 - Fails when NamespaceId is invalid', async () => {
            response = await getProjectWithPagination(en.invalidID, 1, 10);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.NamespaceId).toEqual([`Namespace not found with id: ${en.invalidID}`]);
        });
    });

    describe('2 - API Tests :: Create Project (POST)', () => {
        it('2.1 - Successfully creates a project with valid inputs', async () => {
            en.project1Name = randomString(15);
            en.project1Description = randomString(50);
            response = await createProject(en.project1Name, en.project1Description, en.namespace1ID);
            en.project1Id = response.body;
        });

        it('2.2 - Fails to create a project with a duplicate name', async () => {
            response = await createProject(en.project1Name, en.project1Description, en.namespace1ID);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Name).toEqual(["'Name' must be unique."]);
        });

        it('2.3 - Fails to create a project when name is missing', async () => {
            response = await createProject(null, en.project1Description, en.namespace1ID);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Name).toEqual(["'Name' must not be empty."]);
        });

        it('2.4 - Fails to create a project when NamespaceId is missing', async () => {
            response = await createProject(en.project1Name, en.project1Description, null);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.NamespaceId).toEqual(["The NamespaceId field is required."]);
        });

        it('2.5 - Fails to create a project when NamespaceId is invalid', async () => {
            response = await createProject(en.project1Name, en.project1Description, en.invalidID);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.NamespaceId).toEqual([`Namespace not found with id: ${en.invalidID}`]);
        });

        it('2.6 - Successfully creates a project without a description', async () => {
            en.project2Name = randomString(15);
            response = await createProject(en.project2Name, null, en.namespace1ID);
            en.project2Id = response.body;
        });

        it('2.7 - Successfully creates a project with a duplicate name in another namespace', async () => {
            response = await createProject(en.project2Name, randomString(50), en.namespace2ID);
            expect(response.statusCode).toBe(200);
            en.project3Id = response.body;
        });

        it('2.8 - Fails to create a project with a duplicate name in the same namespace', async () => {
            response = await createProject(en.project2Name, null, en.namespace1ID);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Name).toEqual(["'Name' must be unique."]);
        });

        it('2.9 - Fails to create a project when name is less than 3 characters', async () => {
            response = await createProject(randomString(2), null, en.namespace1ID);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Name).toEqual(["The name must be between 3 and 50 characters long."]);
        });

        it('2.10 - Successfully creates a project with a name of 3 characters', async () => {
            en.project4Name = randomString(3);
            en.project4Description = randomString(50);
            response = await createProject(en.project4Name, en.project4Description, en.namespace1ID);
            en.project4Id = response.body;
        });

        it('2.11 - Successfully creates a project with a name of 50 characters', async () => {
            en.project5Name = randomString(50);
            en.project5Description = randomString(50);
            response = await createProject(en.project5Name, en.project5Description, en.namespace1ID);
            en.project5Id = response.body;
        });

        it('2.12 - Fails to create a project when name exceeds 50 characters', async () => {
            response = await createProject(randomString(51), null, en.namespace1ID);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Name).toEqual(["The name must be between 3 and 50 characters long."]);
        });

        it('2.13 - Fails to create a project when name contains special characters', async () => {
            response = await createProject('!@#$%' + randomString(6), null, en.namespace1ID);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Name).toEqual(["The name cannot contain special characters."]);
        });

        it('2.14 - Fails to create a project when name starts with a number', async () => {
            response = await createProject('1' + randomString(6), null, en.namespace1ID);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Name).toEqual(["The name must start with a letter."]);
        });
    });

    describe('3 - API Tests :: Retrieve Project (GET)', () => {
        it('3.1 - Retrieves a valid project successfully', async () => {
            response = await getProject(en.project1Id);
            expect(response.statusCode).toBe(200);
            expect(response.body.id).toBe(en.project1Id);
            expect(response.body.name).toBe(en.project1Name);
            expect(response.body.description).toBe(en.project1Description);
            expect(response.body.namespaceId).toBe(en.namespace1ID);
        });

        it('3.2 - Fails with a non-existent ProjectId', async () => {
            response = await getProject(en.nonExistentID);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Id).toEqual([`Project not found with id: ${en.nonExistentID}`]);
        });

        it('3.3 - Fails with an invalid ProjectId', async () => {
            response = await getProject(en.invalidID);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Id).toEqual([`Project not found with id: ${en.invalidID}`]);
        });

        it('3.4 - Fails when ProjectId is missing', async () => {
            response = await getProject(null);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.id).toEqual(["The id field is required."]);
        });

        it('3.5 - Retrieves a project with an empty description', async () => {
            response = await getProject(en.project2Id);
            expect(response.statusCode).toBe(200);
            expect(response.body.id).toBe(en.project2Id);
            expect(response.body.name).toBe(en.project2Name);
            expect(response.body.description).toBe(undefined);
            expect(response.body.namespaceId).toBe(en.namespace1ID);
        });
    });

    describe('4 - API Tests :: Update Project and Check It (PUT)', () => {
        it('4.1 - Updates a project with valid inputs', async () => {
            en.project1Name = randomString(15);
            en.project1Description = randomString(50);
            response = await updateProject(en.project1Id, en.project1Name, en.project1Description, en.namespace1ID);
            expect(response.statusCode).toBe(200);
            expect(response.body).toBe(true);
        });

        it('4.2.1 - Verifies the updated project', async () => {
            response = await getProject(en.project1Id);
            expect(response.statusCode).toBe(200);
            expect(response.body.id).toBe(en.project1Id);
            expect(response.body.name).toBe(en.project1Name);
            expect(response.body.description).toBe(en.project1Description);
            expect(response.body.namespaceId).toBe(en.namespace1ID);
        });

        it('4.2 - Fails to update with a non-existent ProjectId', async () => {
            response = await updateProject(en.nonExistentID, en.project1Name, en.project1Description, en.namespace1ID);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Id).toEqual([`Project not found with id: ${en.nonExistentID}`]);
        });

        it('4.3 - Fails to update when project name is empty', async () => {
            response = await updateProject(en.project1Id, null, en.project1Description, en.namespace1ID);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Name).toEqual(["'Name' must not be empty."]);
        });

        it('4.4 - Successfully updates a project with an empty description', async () => {
            response = await updateProject(en.project3Id, en.project2Name, null, en.namespace2ID);
            expect(response.statusCode).toBe(200);
        });

        it('4.4.1 - Verifies the project with an empty description', async () => {
            response = await getProject(en.project3Id);
            expect(response.statusCode).toBe(200);
            expect(response.body.id).toBe(en.project3Id);
            expect(response.body.name).toBe(en.project2Name);
            expect(response.body.description).toBe(undefined);
            expect(response.body.namespaceId).toBe(en.namespace2ID);
        });

        it('4.5 - Fails to update when project name is less than 3 characters', async () => {
            response = await updateProject(en.project4Id, randomString(2), null, en.namespace1ID);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Name).toEqual(["The name must be between 3 and 50 characters long."]);
        });

        it('4.6 - Updates a project with a name of 3 characters', async () => {
            en.project4Name = randomString(3);
            en.project4Description = randomString(50);
            response = await updateProject(en.project4Id, en.project4Name, en.project4Description, en.namespace1ID);
            expect(response.statusCode).toBe(200);
        });

        it('4.6.1 - Verifies the updated project with a 3-character name', async () => {
            response = await getProject(en.project4Id);
            expect(response.statusCode).toBe(200);
            expect(response.body.id).toBe(en.project4Id);
            expect(response.body.name).toBe(en.project4Name);
            expect(response.body.description).toBe(en.project4Description);
            expect(response.body.namespaceId).toBe(en.namespace1ID);
        });

        it('4.7 - Updates a project with a name of 50 characters', async () => {
            en.project5Name = randomString(50);
            en.project5Description = randomString(50);
            response = await updateProject(en.project5Id, en.project5Name, en.project5Description, en.namespace1ID);
            expect(response.statusCode).toBe(200);
        });

        it('4.7.1 - Verifies the updated project with a 50-character name', async () => {
            response = await getProject(en.project5Id);
            expect(response.statusCode).toBe(200);
            expect(response.body.id).toBe(en.project5Id);
            expect(response.body.name).toBe(en.project5Name);
            expect(response.body.description).toBe(en.project5Description);
            expect(response.body.namespaceId).toBe(en.namespace1ID);
        });

        it('4.8 - Fails to update when project name exceeds 50 characters', async () => {
            response = await updateProject(en.project5Id, randomString(51), null, en.namespace1ID);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Name).toEqual(["The name must be between 3 and 50 characters long."]);
        });

        it('4.9 - Fails to update when project name contains special characters', async () => {
            response = await updateProject(en.project5Id, '!@#$%' + randomString(6), null, en.namespace1ID);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Name).toEqual(["The name cannot contain special characters."]);
        });

        it('4.10 - Fails to update when project name starts with a number', async () => {
            response = await updateProject(en.project5Id, '1' + randomString(6), null, en.namespace1ID);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Name).toEqual(["The name must start with a letter."]);
        });
    });

    describe('5 - API Tests :: Delete Project (DELETE)', () => {
        it('5.1 - Deletes a valid project successfully', async () => {
            response = await deleteProject(en.project1Id);
            expect(response.statusCode).toBe(204);
        });

        it('5.1.1 - Verifies deletion of the valid project', async () => {
            response = await getProject(en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Id).toEqual([`Project not found with id: ${en.project1Id}`]);
        });

        it('5.2 - Fails to delete with a non-existent ProjectId', async () => {
            response = await deleteProject(en.nonExistentID);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Id).toEqual([`Project not found with id: ${en.nonExistentID}`]);
        });

        it('5.3 - Fails to delete with an invalid ProjectId', async () => {
            response = await deleteProject(en.invalidID);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Id).toEqual([`Project not found with id: ${en.invalidID}`]);
        });

        it('5.4 - Fails to delete when ProjectId is missing', async () => {
            response = await deleteProject(null);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.id).toEqual(["The id field is required."]);
        });

        it('5.5 - Deletes the second project successfully', async () => {
            response = await deleteProject(en.project2Id);
            expect(response.statusCode).toBe(204);
        });

        it('5.6 - Deletes the third project successfully', async () => {
            response = await deleteProject(en.project3Id);
            expect(response.statusCode).toBe(204);
        });

        it('5.7 - Deletes the fourth project successfully', async () => {
            response = await deleteProject(en.project4Id);
            expect(response.statusCode).toBe(204);
        });

        it('5.8 - Deletes the fifth project successfully', async () => {
            response = await deleteProject(en.project5Id);
            expect(response.statusCode).toBe(204);
        });
    });
});