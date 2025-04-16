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
} from "../functions/ontology-unit";
import {randomString} from "../../utils";

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

describe(' ONTOLOGY::Dataset && ObjectTypeGroup && Discovery', () => {
    beforeEach(() => {
        allure.epic("Ontology");
        allure.feature("Dataset && ObjectTypeGroup && Discovery API Tests");
        allure.owner("QA Team");
      
    });
    describe('Use-cases for DataSet', () => {
        allure.feature('DataSet Api tests');

        it('1.1 - Get: Valid Request | DataSet', async () => {
            allure.story('Get dataset with valid ID');
            allure.description('Fetches a DataSet using valid dataset and project ID.');
    
            response = await getDataSet(en.dataSet1Id, en.project1Id);
            allure.attachment("Response", response.json, { contentType: allure.ContentType.JSON });
    
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
            allure.story('Missing ProjectId');
            allure.description('Validate error when project ID is not provided.');
    
            response = await getDataSet(en.dataSet1Id, null);
            allure.attachment("Error Response", response.json, { contentType: allure.ContentType.JSON });
    
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.status).toBe(400);
            expect(response.json.errors).toEqual({'': [`Resource ${en.dataSet1Id} not found`]});
        });
    
        it('1.3 - Get: Missing DataSetId | DataSet', async () => {
            allure.story('Missing DataSetId');
            allure.description('Validate error when DataSetId is not provided.');

            response = await getDataSet(null, en.project1Id);
            allure.attachment("Error Response", response.json, { contentType: allure.ContentType.JSON });

            expect(response.statusCode).toBe(400);
            expect(response.json.errors).toEqual({'id': ['The id field is required.']});
        });
    
        it('1.4 - Get: Invalid DataSetId | DataSet', async () => {
            allure.story('Invalid DataSetId');
            allure.description('Validate error when an invalid DataSetId is provided.');

            response = await getDataSet(en.invalidID, en.project1Id);
            allure.attachment("Error Response", response.json, { contentType: allure.ContentType.JSON });

            expect(response.statusCode).toBe(400);
            expect(response.json.errors).toEqual({'': ['Resource invalid-id not found']});
        });
    
        it('1.5 - Get: Non-Existent DataSetId | DataSet', async () => {
            allure.story('Non-existent DataSetId');
            allure.description('Validate error when a non-existent DataSetId is provided.');

            response = await getDataSet(en.nonExistentID, en.project1Id);
            allure.attachment("Error Response", response.json, { contentType: allure.ContentType.JSON });

            expect(response.statusCode).toBe(400);
            expect(response.json.errors).toEqual({'': ['Resource z281a5d4-ecf4-47e2-ba45-a76f6ba6ba0z not found']});
        });
    
        it('1.6 - Get: Non-Existent ProjectId | DataSet', async () => {
            allure.story('Non-existent ProjectId');
            allure.description('Validate error when a non-existent ProjectId is provided.');

            response = await getDataSet(en.dataSet1Id, en.nonExistentID);
            allure.attachment("Error Response", response.json, { contentType: allure.ContentType.JSON });

            expect(response.statusCode).toBe(400);
            expect(response.json.errors).toEqual({'': ['Project not found with id: z281a5d4-ecf4-47e2-ba45-a76f6ba6ba0z']});
        });

    });

    describe('DataSet/preview Api tests', () => {
        allure.feature('DataSet Preview Api tests');

        it('2.1 - Preview: Valid Request | DataSet/preview', async () => {
            allure.story('Valid Preview');
            response = await previewDataSet(en.dataSet1Id, en.project1Id);
            allure.attachment("Preview Response", response.json, { contentType: allure.ContentType.JSON });
    
            expect(response.statusCode).toBe(200);
        });
    
        it('2.2 - Preview: Missing ProjectId | DataSet/preview', async () => {
            allure.story('Preview missing ProjectId');
            allure.description('Validate error when ProjectId is missing in the preview request.');

            response = await previewDataSet(en.dataSet1Id, null);
            allure.attachment("Error", response.json, { contentType: allure.ContentType.JSON });

            expect(response.statusCode).toBe(400);
        });
    
        it('2.3 - Preview: Missing DataSetId | DataSet/preview', async () => {
            allure.story('Preview missing DataSetId');
            allure.description('Validate error when DataSetId is missing in the preview request.');

            response = await previewDataSet(null, en.project1Id);
            allure.attachment("Error", response.json, { contentType: allure.ContentType.JSON });

            expect(response.statusCode).toBe(400);
        });
    
        it('2.4 - Preview: Invalid DataSetId | DataSet/preview', async () => {
            allure.story('Preview invalid DataSetId');
            allure.description('Validate error when an invalid DataSetId is provided in the preview request.');

            response = await previewDataSet(en.invalidID, en.project1Id);
            allure.attachment("Error", response.json, { contentType: allure.ContentType.JSON });

            expect(response.statusCode).toBe(400);
        });
    
        it('2.5 - Preview: Default Elements Count | DataSet/preview', async () => {
            allure.story('Default Elements Preview');
    
            response = await previewDataSet(en.dataSet1Id, en.project1Id, 0);
            allure.attachment("Preview Response", response.json, { contentType: allure.ContentType.JSON });
    
            expect(response.statusCode).toBe(200);
            expect(response.json.totalCount).toBe(100);
        });
    
        it('2.6 - Preview: Custom Elements Count | DataSet/preview', async () => {
            allure.story('Custom Elements Preview');
    
            response = await previewDataSet(en.dataSet1Id, en.project1Id, 5);
            allure.attachment("Preview Response", response.json, { contentType: allure.ContentType.JSON });
    
            expect(response.statusCode).toBe(200);
            expect(response.json.rows.length).toBe(5);
        });
    
        it('2.7 - Preview: Negative Elements Count | DataSet/preview', async () => {
            allure.story('Negative Elements Preview');
    
            response = await previewDataSet(en.dataSet1Id, en.project1Id, -5);
            allure.attachment("Preview Response", response.json, { contentType: allure.ContentType.JSON });
    
            expect(response.statusCode).toBe(200);
        });
    });

    describe('Use-cases for ObjectTypeGroup', () => {
        allure.feature('ObjectTypeGroup Api tests');

        it('3.1 - Pagination: Valid Request | getWithPagination', async () => {
            allure.story('Pagination - valid');
            allure.description('Fetches the first page of OTG pagination with default size');
            
            response = await getOTGWithPagination(en.project1Id);
            allure.attachment("Response", JSON.stringify(response.body), { contentType: 'application/json' });
    
            expect(response.statusCode).toBe(200);
            expect(response.body.hasPreviousPage).toBe(false);
            expect(response.body.hasNextPage).toBe(false);
            expect(response.body.pageNumber).toBe(1);
            expect(response.body.pageSize).toBe(20);
        });
    
        it('3.2 - Pagination: Missing ProjectId | getWithPagination', async () => {
            allure.story('Pagination - missing projectId');
            allure.description('Validate behavior when ProjectId is missing in the pagination request.');

            response = await getOTGWithPagination('');
            allure.attachment("Response", JSON.stringify(response.body), { contentType: 'application/json' });

            expect(response.statusCode).toBe(200);
            expect(response.body.pageNumber).toBe(1);
        });
    
        it('3.3 - Pagination: Invalid Pagination with negative value | getWithPagination', async () => {
            allure.story('Pagination - invalid page number');
            allure.description('Validate error when a negative page number is provided in the pagination request.');

            response = await getOTGWithPagination(en.project1Id, -1);
            allure.attachment("Validation Error", JSON.stringify(response.body), { contentType: 'application/json' });

            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toEqual({
                'PageNumber': ['PageNumber at least greater than or equal to 1.']
            });
        });
    
        it('3.4 - Pagination: Empty Dataset | getWithPagination', async () => {
            allure.story('Pagination - project with no OTG');
            allure.description('Validate behavior when the project has no ObjectTypeGroups.');

            response = await getOTGWithPagination(en.project2Id);
            allure.attachment("Response", JSON.stringify(response.body), { contentType: 'application/json' });

            expect(response.statusCode).toBe(200);
            expect(response.body.totalCount ?? 0).toBeGreaterThanOrEqual(0);
        });
    
        it('3.5 - Pagination: Search by Term | getWithPagination', async () => {
            allure.story('Pagination - search');
            allure.description('Validate behavior when searching for a term in the pagination request.');

            response = await getOTGWithPagination(en.project1Id, 1, 10, 'NoFoundDataSet');
            allure.attachment("Search Result", JSON.stringify(response.body), { contentType: 'application/json' });

            expect(response.statusCode).toBe(200);
            expect(response.body.items).toEqual([]);
        });
    });

    describe('Use-cases for Discovery', () => {
        allure.feature('Discovery Api tests');

        it('9.1 - Get: Valid Request | Discovery', async () => {
            allure.story('Valid search overview');
            allure.description('Should return valid overview counts for search term "test"');
    
            response = await getSearchOverview(en.project1Id, 'test');
            allure.attachment("Response", JSON.stringify(response.json), { contentType: 'application/json' });
    
            expect(response.statusCode).toBe(200);
            expect(response.json.searchTerm).toBe('test');
            expect(response.json.objectTypesCount).toBeGreaterThanOrEqual(0);
            expect(response.json.linkTypesCount).toBeGreaterThanOrEqual(0);
            expect(response.json.objectTypeGroupsCount).toBeGreaterThanOrEqual(0);
            expect(response.json.totalCount).toBeGreaterThanOrEqual(0);
        });
    
        it('9.2 - Get: Invalid ProjectId | Discovery', async () => {
            allure.story('Invalid project ID in discovery');
            allure.description('Should return validation error for invalid project');
    
            response = await getSearchOverview(en.invalidID, 'test');
            allure.attachment("Error Response", JSON.stringify(response.json), { contentType: 'application/json' });
    
            expect(response.statusCode).toBe(400);
            expect(response.json.title).toBe('One or more validation errors occurred.');
            expect(response.json.errors).toEqual({
                '': [`Project not found with id: ${en.invalidID}`]});
        
        });
    });
    describe('Use-cases for Schema', () => {
        allure.feature('Schema validation Api tests');

        it('10.1 - Get: Valid Request | Schema', async () => {
            allure.story('Get value types');
            allure.description('Returns all available value types from the system');
    
            response = await getValueTypes();
            allure.attachment("Schema Value Types", JSON.stringify(response.json), { contentType: 'application/json' });
    
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