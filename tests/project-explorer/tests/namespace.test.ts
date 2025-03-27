import {
    createNamespace,
    deleteNamespace,
    getNamespace,
    getNamespaceWithPagination,
    updateNamespace
} from "../functions/namespace";
import {randomString} from "../../utils";

let en: any = {
    nonExistentID: 'z281a5d4-ecf4-47e2-ba45-a76f6ba6ba0z',
    invalidID: 'invalid-id',
    namespace1ID: 'b92cd76f-d9d6-431a-bd25-5426ee44801e',
    namespace2ID: 'd533212e-25a2-485a-b2c2-31ba67bd803b',
};

const responseMessages = {
    empty: {Name: ["'Name' must not be empty."]},
    len: {Name: ["The name must be between 3 and 50 characters long."]},
    char: {Name: ["The name cannot contain special characters."]},
    num: {Name: ["The name must start with a letter."]}
};

let response: any = null;

describe('Use-cases for Namespace', () => {
    describe('1 - Pagination :: Get /project-explorer/api/Namespace/getWithPagination', () => {
        it('1.1 - Retrieves paginated namespaces with a valid request', async () => {
            response = await getNamespaceWithPagination();
            console.log('response', response);
            expect(response.statusCode).toBe(200);
            expect(response.body.pageNumber).toBe(1);
            expect(response.body.pageSize).toBe(20);
            expect(response.body.hasNextPage).toBeDefined();
            expect(response.body.hasPreviousPage).toBeDefined();
            expect(response.body.totalCount).toBeDefined();
            expect(response.body.items).toBeDefined();
            expect(response.body.totalPages).toBeDefined();
        });

        it('1.2 - Fails when page number is invalid (-1)', async () => {
            response = await getNamespaceWithPagination(-1, 10);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.PageNumber).toEqual(['PageNumber at least greater than or equal to 1.']);
        });

        it('1.3 - Handles requests with a very high page number', async () => {
            response = await getNamespaceWithPagination(100000, 10);
            expect(response.statusCode).toBe(200);
            expect(response.body.pageNumber).toBe(100000);
            expect(response.body.pageSize).toBe(10);
        });

        it('1.4 - Fails when page size is invalid (-5)', async () => {
            response = await getNamespaceWithPagination(1, -5);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.PageSize).toEqual(['PageSize at least greater than or equal to 1.']);
        });

        it('1.5 - Handles requests with invalid key names gracefully', async () => {
            response = await getNamespaceWithPagination(1, 10, null, null, null, true);
            expect(response.statusCode).toBe(200);
            expect(response.body.pageNumber).toBe(1);
            expect(response.body.pageSize).toBe(20);
        });
    });

    describe('2 - Creating Namespace :: Post /project-explorer/api/Namespace', () => {
        it('2.1 - Successfully creates a namespace with valid inputs', async () => {
            en.test_namespace1Name = randomString(15, true);
            en.test_namespace1Description = randomString(15);
            response = await createNamespace(en.test_namespace1Name, en.test_namespace1Description);
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeDefined();
            en.test_namespace1ID = response.body;
        });

        it('2.1.1 - Successfully creates a second namespace with valid inputs', async () => {
            en.test_namespace2Name = randomString(15);
            en.test_namespace2Description = randomString(15);
            response = await createNamespace(en.test_namespace2Name, en.test_namespace2Description);
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeDefined();
            en.test_namespace2ID = response.body;
        });

        it('2.2 - Fails when namespace name is a duplicate', async () => {
            response = await createNamespace(en.test_namespace2Name, randomString(15));
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Name).toEqual(['A namespace with this name already exists']);
        });

        it('2.3 - Fails when name field is missing', async () => {
            response = await createNamespace(null, randomString(15));
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Name).toEqual(["'Name' must not be empty."]);
        });

        it('2.4 - Creates a namespace with an empty description', async () => {
            en.test_namespace3Name = randomString(15);
            response = await createNamespace(en.test_namespace3Name, '');
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeDefined();
            en.test_namespace3ID = response.body;
        });

        it('2.5 - Fails when JSON format is invalid', async () => {
            const descriptionArray = ['This', 'should', 'fail'];
            response = await createNamespace(randomString(15), null, {description: descriptionArray});
            expect(response.statusCode).toBe(400);
            console.log('response', response);
            expect(response.json.errors.description).toBeDefined();
        });

        it('2.6 - Fails when namespace name is shorter than 3 characters', async () => {
            response = await createNamespace(randomString(2), randomString(15));
            expect(response.statusCode).toBe(400);
            expect(response.body.errors.Name).toEqual(['The name must be between 3 and 50 characters long.']);
        });

        it('2.7 - Successfully creates a namespace with a 3-character name', async () => {
            en.test_namespace4Name = randomString(3);
            response = await createNamespace(en.test_namespace4Name, randomString(15));
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeDefined();
            en.test_namespace4ID = response.body;
        });

        it('2.8 - Successfully creates a namespace with a 50-character name', async () => {
            en.test_namespace5Name = randomString(50);
            response = await createNamespace(en.test_namespace5Name, randomString(15));
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeDefined();
            en.test_namespace5ID = response.body;
        });

        it('2.9 - Fails when namespace name exceeds 50 characters', async () => {
            response = await createNamespace(randomString(51), randomString(15));
            expect(response.statusCode).toBe(400);
            expect(response.body.errors.Name).toEqual(['The name must be between 3 and 50 characters long.']);
        });

        it('2.10 - Fails when namespace name contains special characters', async () => {
            const charName = '!@#$' + randomString(15);
            response = await createNamespace(charName, randomString(15));
            expect(response.statusCode).toBe(400);
            expect(response.body.errors.Name).toEqual(['The name cannot contain special characters.']);
        });

        it('2.11 - Fails when namespace name starts with a number', async () => {
            const numName = '123' + randomString(15);
            response = await createNamespace(numName, randomString(15));
            expect(response.statusCode).toBe(400);
            expect(response.body.errors.Name).toEqual(['The name must start with a letter.']);
        });
    });

    describe('3 - Retrieve Namespace :: Get /project-explorer/api/Namespace?id={id}', () => {
        it('3.1 - Retrieves a namespace with a valid Namespace ID', async () => {
            response = await getNamespace(en.test_namespace1ID);
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeDefined();
            expect(response.body.id).toBe(en.test_namespace1ID);
            expect(response.body.name).toBe(en.test_namespace1Name);
            expect(response.body.description).toBe(en.test_namespace1Description);
        });

        it('3.2 - Fails to retrieve a namespace with a non-existent Namespace ID', async () => {
            response = await getNamespace(en.nonExistentID);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors).toEqual({'': [`Namespace with id: ${en.nonExistentID} not found`]});
        });

        it('3.3 - Fails to retrieve a namespace with an invalid Namespace ID format', async () => {
            response = await getNamespace(en.invalidID);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors).toEqual({'': [`Namespace with id: ${en.invalidID} not found`]});
        });

        it('3.4 - Fails to retrieve a namespace with a missing Namespace ID', async () => {
            response = await getNamespace('');
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors.id).toEqual(['The id field is required.']);
        });

        it('3.5 - Retrieves a namespace with a valid ID and empty description', async () => {
            response = await getNamespace(en.test_namespace3ID);
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeDefined();
            expect(response.body.id).toBe(en.test_namespace3ID);
            expect(response.body.name).toBe(en.test_namespace3Name);
            expect(response.body.description).toBe('');
        });
    });

    describe('4 - Update Namespace :: Put /project-explorer/api/Namespace/{id}', () => {
        it('4.1 - Updates a namespace with a valid request', async () => {
            en.test_namespace1Name = randomString(15);
            en.test_namespace1Description = randomString(15);
            response = await updateNamespace(en.test_namespace1ID, en.test_namespace1Name, en.test_namespace1Description);
            expect(response.statusCode).toBe(204);
        });

        it('4.1.1 - Verifies updated namespace data', async () => {
            response = await getNamespace(en.test_namespace1ID);
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeDefined();
            expect(response.body.id).toBe(en.test_namespace1ID);
            expect(response.body.name).toBe(en.test_namespace1Name);
            expect(response.body.description).toBe(en.test_namespace1Description);
        });

        it('4.2 - Fails to update a namespace with a non-existent Namespace ID', async () => {
            response = await updateNamespace(en.nonExistentID, randomString(15), randomString(15));
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors).toEqual({'': [`Namespace not found: \"${en.nonExistentID}\"`]});
        });

        it('4.3 - Fails to update a namespace with an empty name', async () => {
            response = await updateNamespace(en.test_namespace1ID, '', randomString(15));
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Name).toEqual(["'Name' must not be empty."]);
        });

        it('4.4 - Successfully updates a namespace with incorrect key structure', async () => {
            response = await updateNamespace(en.test_namespace2ID, en.test_namespace2Name, null, {'desc': randomString(15)});
            expect(response.statusCode).toBe(204);
        });

        it('4.4.1 - Verifies updated data after incorrect key structure update', async () => {
            response = await getNamespace(en.test_namespace2ID);
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeDefined();
            expect(response.body.id).toBe(en.test_namespace2ID);
            expect(response.body.name).toBe(en.test_namespace2Name);
            expect(response.body.description).toBe(en.test_namespace2Description);
        });

        it('4.5 - Fails to update a namespace with a missing ID', async () => {
            response = await updateNamespace(null, randomString(15), randomString(15));
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors.id).toEqual(['The Id field is required.']);
        });

        it('4.6 - Fails to update a namespace with an existing name', async () => {
            response = await updateNamespace(en.test_namespace2ID, en.test_namespace1Name, randomString(15));
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors.Name).toEqual(['A namespace with this name already exists']);
        });

        it('4.7 - Fails to update a namespace with a name shorter than 3 characters', async () => {
            response = await updateNamespace(en.test_namespace3ID, randomString(2), randomString(15));
            expect(response.statusCode).toBe(400);
            expect(response.body.errors.Name).toEqual(['The name must be between 3 and 50 characters long.']);
        });

        it('4.8 - Successfully updates a namespace with a 3-character name', async () => {
            en.test_namespace4Name = randomString(3);
            en.test_namespace4Description = randomString(15);
            response = await updateNamespace(en.test_namespace4ID, en.test_namespace4Name, en.test_namespace4Description);
            expect(response.statusCode).toBe(204);
        });

        it('4.8.1 - Verifies updated data after 3-character name update', async () => {
            response = await getNamespace(en.test_namespace4ID);
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeDefined();
            expect(response.body.id).toBe(en.test_namespace4ID);
            expect(response.body.name).toBe(en.test_namespace4Name);
            expect(response.body.description).toBe(en.test_namespace4Description);
        });

        it('4.9 - Successfully updates a namespace with a 50-character name', async () => {
            en.test_namespace5Name = randomString(50);
            en.test_namespace5Description = randomString(15);
            response = await updateNamespace(en.test_namespace5ID, en.test_namespace5Name, en.test_namespace5Description);
            expect(response.statusCode).toBe(204);
        });

        it('4.9.1 - Verifies updated data after 50-character name update', async () => {
            response = await getNamespace(en.test_namespace5ID);
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeDefined();
            expect(response.body.id).toBe(en.test_namespace5ID);
            expect(response.body.name).toBe(en.test_namespace5Name);
            expect(response.body.description).toBe(en.test_namespace5Description);
        });

        it('4.10 - Fails to update a namespace with a name exceeding 50 characters', async () => {
            response = await updateNamespace(en.test_namespace5ID, randomString(51), randomString(15));
            expect(response.statusCode).toBe(400);
            expect(response.body.errors.Name).toEqual(['The name must be between 3 and 50 characters long.']);
        });

        it('4.11 - Fails to update a namespace with special characters in the name', async () => {
            response = await updateNamespace(en.test_namespace5ID, '!@#$' + randomString(15), randomString(15));
            expect(response.statusCode).toBe(400);
            expect(response.body.errors.Name).toEqual(['The name cannot contain special characters.']);
        });

        it('4.12 - Fails to update a namespace with a name starting with a number', async () => {
            response = await updateNamespace(en.test_namespace5ID, '123' + randomString(15), randomString(15));
            expect(response.statusCode).toBe(400);
            expect(response.body.errors.Name).toEqual(['The name must start with a letter.']);
        });
    });

    describe('5 - Deleting Namespace :: Delete /project-explorer/api/Namespace/{id}', () => {
        it('5.1 - Deletes a namespace with a valid Namespace ID', async () => {
            response = await deleteNamespace(en.test_namespace1ID);
            expect(response.statusCode).toBe(204);
        });

        it('5.2 - Fails to delete with a non-existent Namespace ID', async () => {
            response = await deleteNamespace(en.nonExistentID);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors).toEqual({'': [`Namespace with id: ${en.nonExistentID} not found`]});
        });

        it('5.3 - Fails to delete with a missing Namespace ID', async () => {
            response = await deleteNamespace(null);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors.id).toEqual(['The id field is required.']);
        });

        it('5.4 - Fails to delete with an invalid Namespace ID format', async () => {
            response = await deleteNamespace(en.invalidID);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe('One or more validation errors occurred.');
            expect(response.body.errors).toEqual({'': [`Namespace with id: ${en.invalidID} not found`]});
        });

        it('5.5 - Deletes all specified namespaces successfully', async () => {
            response = await deleteNamespace(en.test_namespace2ID);
            expect(response.statusCode).toBe(204);
            response = await deleteNamespace(en.test_namespace3ID);
            expect(response.statusCode).toBe(204);
            response = await deleteNamespace(en.test_namespace4ID);
            expect(response.statusCode).toBe(204);
            response = await deleteNamespace(en.test_namespace5ID);
            expect(response.statusCode).toBe(204);
        });
    });
});
