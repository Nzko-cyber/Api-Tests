import {
    createObjectTypeGroup,
    deleteObjectTypeGroup,
    getDataSet,
    getObjectTypeGroup,
    getOTGWithGraph,
    getOTGWithPagination,
    getSearchOverview,
    getValueTypes,
    previewDataSet,
    updateObjectTypeGroup
} from "./Ontology_unit";
import {randomString} from "../utils";

let en: any = {
    project1Id: 'ca0b2dbe-c55d-4220-b1b1-3dd7ab28fd30',
    project2Id: '50a7eee3-aa4e-4f2d-9570-ea3bb662c6f1',
    invalidID: 'invalid-id',
    nonExistentID: 'z281a5d4-ecf4-47e2-ba45-a76f6ba6ba0z',
    dataSet1Id: '00d3ab3e-c1df-4189-8896-0442c30c40d7',
    objectType1Id: "7333a0f3-71c4-4f2a-b920-a35016d7725d",
    objectType1Name: 'NotDelete Api test',
    objectType1PluralName: 'NotDelete API tests',
    objectType1Description: 'This is for API testing'
}

let response: any = null;

describe('Use-cases for Ontology API', () => {
    describe('Use-cases for DataSet', () => {
        it('1.1 - Get: Valid Request | DataSet', async () => {
            response = await getDataSet(en.dataSet1Id, en.project1Id);
            expect(response.statusCode).toBe(200);
            expect(response.json.name).toBe('people-100');
            expect(response.json.projectId).toBe(en.project1Id);
            expect(response.json.resourceType).toBe('DataSet');
            expect(response.json.id).toBe(en.dataSet1Id);
            expect(response.json.columns).toEqual([
                {"name": "Index", "valueType": "Int", "notNull": false},
                {"name": "User Id", "valueType": "String", "notNull": false},
                {"name": "First Name", "valueType": "String", "notNull": false},
                {"name": "Last Name", "valueType": "String", "notNull": false},
                {"name": "Sex", "valueType": "String", "notNull": false},
                {"name": "Email", "valueType": "String", "notNull": false},
                {"name": "Phone", "valueType": "String", "notNull": false},
                {"name": "Date of birth", "valueType": "Date", "notNull": false},
                {"name": "Job Title", "valueType": "String", "notNull": false}
            ]);
        });
        it('1.2 - Get: Missing ProjectId | DataSet', async () => {
            response = await getDataSet(en.dataSet1Id, null);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.status).toBe(400);
            expect(response.json.errors).toEqual({'': [`Resource ${en.dataSet1Id} not found`]});
        });
        it('1.3 - Get: Missing DataSetId | DataSet', async () => {
            response = await getDataSet(null, en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.status).toBe(400);
            expect(response.json.errors).toEqual({'id': ['The id field is required.']});
        });
        it('1.4 - Get: Invalid DataSetId | DataSet', async () => {
            response = await getDataSet(en.invalidID, en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.status).toBe(400);
            expect(response.json.errors).toEqual({'': ['Resource invalid-id not found']});
        });
        it('1.5 - Get: Non-Existent DataSetId | DataSet', async () => {
            response = await getDataSet(en.nonExistentID, en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.status).toBe(400);
            expect(response.json.errors).toEqual({'': ['Resource z281a5d4-ecf4-47e2-ba45-a76f6ba6ba0z not found']});
        });
        it('1.6 - Get: Non-Existent ProjectId | DataSet', async () => {
            response = await getDataSet(en.dataSet1Id, en.nonExistentID);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.status).toBe(400);
            expect(response.json.errors).toEqual({'': ['Project not found with id: z281a5d4-ecf4-47e2-ba45-a76f6ba6ba0z']});
        });
        it('2.1 - Preview: Valid Request | DataSet/preview', async () => {
            response = await previewDataSet(en.dataSet1Id, en.project1Id);
            expect(response.statusCode).toBe(200);
        });
        it('2.2 - Preview: Missing ProjectId | DataSet/preview', async () => {
            response = await previewDataSet(en.dataSet1Id, null);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.status).toBe(400);
            expect(response.json.errors).toEqual({'': ['Project not found with id: ']});
        });
        it('2.3 - Preview: Missing DataSetId | DataSet/preview', async () => {
            response = await previewDataSet(null, en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.status).toBe(400);
            expect(response.json.errors).toEqual({'id': ['The id field is required.']});
        });
        it('2.4 - Preview: Invalid DataSetId | DataSet/preview', async () => {
            response = await previewDataSet(en.invalidID, en.project1Id);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.status).toBe(400);
            expect(response.json.errors).toEqual({'': [`Resource ${en.invalidID} not found`]});
        });
        it('2.5 - Preview: Default Elements Count | DataSet/preview', async () => {
            response = await previewDataSet(en.dataSet1Id, en.project1Id, 0);
            expect(response.statusCode).toBe(200);
            expect(response.json.totalCount).toBe(100);
            expect(response.json.id).toBe(en.dataSet1Id);
        });
        it('2.6 - Preview: Custom Elements Count | DataSet/preview', async () => {
            response = await previewDataSet(en.dataSet1Id, en.project1Id, 5);
            expect(response.statusCode).toBe(200);
            expect(response.json.totalCount).toBe(100);
            expect(response.json.rows.length).toBe(5);
            expect(response.json.id).toBe(en.dataSet1Id);
        });
        it('2.7 - Preview: Negative Elements Count | DataSet/preview', async () => {
            response = await previewDataSet(en.dataSet1Id, en.project1Id, -5);
            expect(response.statusCode).toBe(200);
            expect(response.json.totalCount).toBe(100);
            expect(response.json.id).toBe(en.dataSet1Id);
        });
    });
    describe('Use-cases for ObjectTypeGroup', () => {
        it('3.1 - Pagination: Valid Request | getWithPagination', async () => {
            response = await getOTGWithPagination(en.project1Id);
            expect(response.statusCode).toBe(200);
            expect(response.body.hasPreviousPage).toBe(false);
            expect(response.body.hasNextPage).toBe(false);
            expect(response.body.pageNumber).toBe(1);
            expect(response.body.pageSize).toBe(20);
        });
        it('3.2 - Pagination: Missing ProjectId | getWithPagination', async () => {
            response = await getOTGWithPagination('');
            expect(response.statusCode).toBe(200);
            expect(response.body.hasPreviousPage).toBe(false);
            expect(response.body.hasNextPage).toBe(false);
            expect(response.body.pageNumber).toBe(1);
            expect(response.body.pageSize).toBe(20);
        });
        it('3.3 - Pagination: Invalid Pagination with negative value | getWithPagination', async () => {
            response = await getOTGWithPagination(en.project1Id, -1);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe("One or more validation errors occurred.");
            expect(response.body.status).toBe(400);
            expect(response.body.errors).toEqual({'PageNumber': ['PageNumber at least greater than or equal to 1.']});
        });
        it('3.4 - Pagination: Empty Dataset | getWithPagination', async () => {
            response = await getOTGWithPagination(en.project2Id);
            expect(response.statusCode).toBe(200);
            expect(response.body.hasPreviousPage).toBe(false);
            expect(response.body.hasNextPage).toBe(false);
            expect(response.body.pageNumber).toBe(1);
            expect(response.body.pageSize).toBe(20);
        });
        it('3.5 - Pagination: Search by Term | getWithPagination', async () => {
            response = await getOTGWithPagination(en.project1Id, 1, 10, 'NoFoundDataSet');
            expect(response.statusCode).toBe(200);
            expect(response.body.hasPreviousPage).toBe(false);
            expect(response.body.hasNextPage).toBe(false);
            expect(response.body.pageNumber).toBe(1);
            expect(response.body.pageSize).toBe(10);
            expect(response.body.totalCount).toBe(0);
            expect(response.body.items).toEqual([]);
        });
        it('3.6 - Pagination: 2nd Page with PageSize | getWithPagination', async () => {
            response = await getOTGWithPagination(en.project1Id, 2, 5);
            expect(response.statusCode).toBe(200);
            expect(response.body.hasPreviousPage).toBe(true);
            // expect(response.body.hasNextPage).toBe(false);
            expect(response.body.pageNumber).toBe(2);
            expect(response.body.pageSize).toBe(5);
        });
        it('4.1 - Graph: Valid Pagination Request | getWithGraphAndPagination', async () => {
            response = await getOTGWithGraph(en.project1Id);
            expect(response.statusCode).toBe(200);
            expect(response.body.hasPreviousPage).toBe(false);
            expect(response.body.hasNextPage).toBe(false);
            expect(response.body.pageNumber).toBe(1);
            expect(response.body.pageSize).toBe(20);
        });
        it('4.2 - Graph: Missing ProjectId | getWithGraphAndPagination', async () => {
            response = await getOTGWithGraph();
            expect(response.statusCode).toBe(200);
            expect(response.body.hasPreviousPage).toBe(false);
            expect(response.body.hasNextPage).toBe(false);
            expect(response.body.pageNumber).toBe(1);
            expect(response.body.pageSize).toBe(20);
        });
        it('4.3 - Graph: Invalid Pagination Parameters | getWithGraphAndPagination', async () => {
            response = await getOTGWithGraph(en.project1Id, -1, -1);
            expect(response.statusCode).toBe(400);
            expect(response.body.title).toBe("One or more validation errors occurred.");
            expect(response.body.status).toBe(400);
            expect(response.body.errors).toEqual({
                'PageNumber': ['PageNumber at least greater than or equal to 1.'],
                'PageSize': ['PageSize at least greater than or equal to 1.']
            });
        });
        it('4.4 - Graph: Empty Dataset | getWithGraphAndPagination', async () => {
            response = await getOTGWithGraph(en.project2Id);
            expect(response.statusCode).toBe(200);
            expect(response.body.hasPreviousPage).toBe(false);
            expect(response.body.hasNextPage).toBe(false);
            expect(response.body.pageNumber).toBe(1);
            expect(response.body.pageSize).toBe(20);
        });
        it('4.5 - Graph: Include graph data | getWithGraphAndPagination', async () => {
            response = await getOTGWithGraph(en.project1Id, 1, 10, null, null, null, true);
            expect(response.statusCode).toBe(200);
            expect(response.body.hasPreviousPage).toBe(false);
            expect(response.body.hasNextPage).toBe(false);
            expect(response.body.pageNumber).toBe(1);
            expect(response.body.pageSize).toBe(10);
        });
        it('4.6 - Graph: Exclude graph data | getWithGraphAndPagination', async () => {
            response = await getOTGWithGraph(en.project1Id, 1, 10, null, null, null, false);
            expect(response.statusCode).toBe(200);
            expect(response.body.hasPreviousPage).toBe(false);
            // expect(response.body.hasNextPage).toBe(false);
            expect(response.body.pageNumber).toBe(1);
            expect(response.body.pageSize).toBe(10);
        });
        it('5.1 - Create: Valid Request | ObjectTypeGroup', async () => {
            en.test_objectTypeGroup1Name = randomString(15);
            en.test_objectTypeGroup1Description = randomString(50);
            response = await createObjectTypeGroup(en.project1Id, en.test_objectTypeGroup1Name, en.test_objectTypeGroup1Description, [en.objectType1Id]);
            expect(response.statusCode).toBe(200);
            en.test_objectTypeGroup1Id = response.body;
        });
        it('5.2 - Create: Missing Name | ObjectTypeGroup', async () => {
            response = await createObjectTypeGroup(en.project1Id, null, en.test_objectTypeGroup1Description, [en.objectType1Id]);
            console.log(response.json);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe("One or more validation errors occurred.");
            expect(response.json.status).toBe(400);
            expect(response.json.errors).toEqual({'Name': ['The Name field is required.']});
        });
        it('5.3 - Create: Missing ObjectType | ObjectTypeGroup', async () => {
            en.test_objectTypeGroup2Name = randomString(15);
            en.test_objectTypeGroup2Description = randomString(50);
            response = await createObjectTypeGroup(en.project1Id, en.test_objectTypeGroup2Name, en.test_objectTypeGroup2Description, null);
            console.log(response);
            expect(response.statusCode).toBe(200);
            en.test_objectTypeGroup2Id = response.body;
        });
        it('5.4 - Create: Invalid ObjectTypeId | ObjectTypeGroup', async () => {
            response = await createObjectTypeGroup(en.project1Id, en.test_objectTypeGroup2Name, en.test_objectTypeGroup2Description, [en.invalidID]);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe("One or more validation errors occurred.");
            expect(response.json.status).toBe(400);
            expect(response.json.errors).toEqual({'ObjectTypes': [`Object type not found. Id: ${en.invalidID}`]});
        });
        it('5.5 - Create: Invalid ProjectId | ObjectTypeGroup', async () => {
            response = await createObjectTypeGroup(en.invalidID, en.test_objectTypeGroup2Name, en.test_objectTypeGroup2Description);
            console.log(response);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe("One or more validation errors occurred.");
            expect(response.json.status).toBe(400);
            // expect(response.json.errors).toEqual({'': [`Project not found with id: ${en.invalidID}`]});
        });
        it('6.1 - Get: Valid Request | ObjectTypeGroup', async () => {
            response = await getObjectTypeGroup(en.project1Id, en.test_objectTypeGroup1Id);
            expect(response.statusCode).toBe(200);
            expect(response.json.id).toBe(en.test_objectTypeGroup1Id);
            expect(response.json.name).toBe(en.test_objectTypeGroup1Name);
            expect(response.json.description).toBe(en.test_objectTypeGroup1Description);
            expect(response.json.objectTypes[0].objectTypeId).toEqual(en.objectType1Id);
        });
        it('6.2 - Get: Missing ProjectId | ObjectTypeGroup', async () => {
            response = await getObjectTypeGroup(null, en.test_objectTypeGroup1Id);
            expect(response.statusCode).toBe(200);
            // expect(response.json.title).toBe("One or more validation errors occurred.");
            // expect(response.json.status).toBe(400);
            // expect(response.json.errors).toEqual({'': [`Resource ${en.test_objectTypeGroup1Id} not found`]});
        });
        it('6.3 - Get: Missing ObjectTypeGroupId | ObjectTypeGroup', async () => {
            response = await getObjectTypeGroup(en.project1Id, null);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe("One or more validation errors occurred.");
            expect(response.json.status).toBe(400);
            expect(response.json.errors).toEqual({'Id': ['The Id field is required.']});
        });
        it('6.4 - Get: Invalid ObjectTypeGroupId | ObjectTypeGroup', async () => {
            response = await getObjectTypeGroup(en.project1Id, en.invalidID);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe("One or more validation errors occurred.");
            expect(response.json.status).toBe(400);
            expect(response.json.errors).toEqual({'': [`Resource ${en.invalidID} not found`]});
        });
        it('7.1 - Update: Valid Request | ObjectTypeGroup', async () => {
            en.test_objectTypeGroup1Name = randomString(15);
            en.test_objectTypeGroup1Description = randomString(50);
            response = await updateObjectTypeGroup(en.project1Id, en.test_objectTypeGroup1Id, en.test_objectTypeGroup1Name, en.test_objectTypeGroup1Description);
            expect(response.statusCode).toBe(200);
        });
        it('7.1.1 - Check Updated Data | ObjectTypeGroup', async () => {
            response = await getObjectTypeGroup(en.project1Id, en.test_objectTypeGroup1Id);
            expect(response.statusCode).toBe(200);
            expect(response.json.id).toBe(en.test_objectTypeGroup1Id);
            expect(response.json.name).toBe(en.test_objectTypeGroup1Name);
            expect(response.json.description).toBe(en.test_objectTypeGroup1Description);
        });
        it('7.2 - Update: Missing Name | ObjectTypeGroup', async () => {
            response = await updateObjectTypeGroup(en.project1Id, en.test_objectTypeGroup1Id, null, en.test_objectTypeGroup1Description);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe("One or more validation errors occurred.");
            expect(response.json.status).toBe(400);
            expect(response.json.errors).toEqual({'Name': ['The Name field is required.']});
        });
        it('7.3 - Update: Invalid ProjectId | ObjectTypeGroup', async () => {
            response = await updateObjectTypeGroup(en.invalidID, en.test_objectTypeGroup1Name, en.test_objectTypeGroup1Name, en.test_objectTypeGroup1Description);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe("One or more validation errors occurred.");
            expect(response.json.status).toBe(400);
            expect(response.json.errors).toEqual({'': [`Project not found with id: ${en.invalidID}`]});
        });
        it('7.4 - Update: Invalid ObjectTypeGroupId | ObjectTypeGroup', async () => {
            response = await updateObjectTypeGroup(en.project1Id, en.invalidID, en.test_objectTypeGroup1Name, en.test_objectTypeGroup1Description);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe("One or more validation errors occurred.");
            expect(response.json.status).toBe(400);
            expect(response.json.errors).toEqual({'': [`ObjectTypeGroup not found: id=${en.invalidID}`]});
        });
        it('7.5 - Update: Missing ObjectTypeGroupId | ObjectTypeGroup', async () => {
            response = await updateObjectTypeGroup(en.project1Id, null, en.test_objectTypeGroup1Name, en.test_objectTypeGroup1Description);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe("One or more validation errors occurred.");
            expect(response.json.status).toBe(400);
            expect(response.json.errors).toEqual({'Id': ['The Id field is required.']});
        });
        it('8.1 - Delete: Valid Request | ObjectTypeGroup', async () => {
            response = await deleteObjectTypeGroup(en.project1Id, en.test_objectTypeGroup1Id);
            expect(response.statusCode).toBe(200);
        });
        it('8.2 - Delete: Missing ObjectTypeGroupId | ObjectTypeGroup', async () => {
            response = await deleteObjectTypeGroup(en.project1Id, null);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe("One or more validation errors occurred.");
            expect(response.json.status).toBe(400);
            expect(response.json.errors).toEqual({'Id': ['The Id field is required.']});
        });
        it('8.3 - Delete: Invalid ObjectTypeGroupId | ObjectTypeGroup', async () => {
            response = await deleteObjectTypeGroup(en.project1Id, en.invalidID);
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe("One or more validation errors occurred.");
            expect(response.json.status).toBe(400);
            expect(response.json.errors).toEqual({'': [`Resource ${en.invalidID} not found`]});
        });
        it('8.5 - Delete: 2nd ObjectTypeGroup | ObjectTypeGroup', async () => {
            response = await deleteObjectTypeGroup(en.project1Id, en.test_objectTypeGroup2Id);
            expect(response.statusCode).toBe(200);
        });
    });
    describe('Use-cases for Discovery', () => {
        it('9.1 - Get: Valid Request | Discovery', async () => {
            response = await getSearchOverview(en.project1Id, 'test');
            expect(response.statusCode).toBe(200);
            expect(response.json.searchTerm).toBe('test');
            expect(response.json.objectTypesCount).toBeGreaterThanOrEqual(0);
            expect(response.json.linkTypesCount).toBeGreaterThanOrEqual(0);
            expect(response.json.objectTypeGroupsCount).toBeGreaterThanOrEqual(0);
            expect(response.json.totalCount).toBeGreaterThanOrEqual(0);
        });
        it('9.2 - Get: Invalid ProjectId | Discovery', async () => {
            response = await getSearchOverview(en.invalidID, 'test');
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.status).toBe(400);
            expect(response.json.errors).toEqual({'': [`Project not found with id: ${en.invalidID}`]});
        });
    });
    describe('Use-cases for Schema', () => {
        it('10.1 - Get: Valid Request | Schema', async () => {
            response = await getValueTypes();
            expect(response.statusCode).toBe(200);
            expect(response.json).toEqual([
                {"value": "String", "text": "String"},
                {"value": "Int", "text": "Int"},
                {"value": "Timestamp", "text": "Timestamp"},
                {"value": "Date", "text": "Date"},
                {"value": "Decimal", "text": "Decimal"},
                {"value": "BigInt", "text": "BigInt"},
                {"value": "Float", "text": "Float"},
                {"value": "Double", "text": "Double"},
                {"value": "Boolean", "text": "Boolean"}
            ]);
        });
    });
});