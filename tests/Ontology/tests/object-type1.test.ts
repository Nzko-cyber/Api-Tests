import {
    createObjectType,
    deleteObjectType,
    getObjectType,
    getObjectTypesByDataSet,
    updateObjectType,
    updateObjectTypeStatus,
    updateObjectTypeVisibility
} from "../functions/object-type";
import {randomString, sleep} from "../../utils";

const environment = {
    validProjectID: "79eb5496-9516-4318-ada4-60284b379ed2",
    datasetPrId: '79eb5496-9516-4318-ada4-60284b379ed2',
    invalidProjectID: "invalid-project-id",
    datasetid: "2db31909-c40a-4177-81ae-7c6c3eae6d69",
    objectId: '',
    invalidObjectTypeID: "invalid-object-type-id",
    emptyDataSetID: "f945e039-326d-4628-b5d4-0e8b0ba3b87b",
    obidforstatus: "0b2037a6-e6bc-4113-8148-b37ce5d07eed",
    anotherValidObjectTypeID: '1dc9fbe4-91a7-4f4a-b804-c1d7cb9f9e5f'

};

interface RequestBody {
    name?: string;
    pluralName: string;
    description: string;
    status: string;
    visibility: string;
    hasGeo: boolean;
    isEvent: boolean;
    imageUrl: string | null;
    dataSet: {
        dataSetId: string;
        dataSetName: string;
        projectId: string;
    };
    properties: Array<{
        key: number;
        name: string;
        dataSetColumnName: string;
        isPrimary: boolean;
        isTitle: boolean;
        valueType: string;
    }>;
    groups: Array<{
        id: string;
    }>;
}

const validRequestBody: RequestBody = {
    name: "Test Api",
    pluralName: "For test",
    description: "For test",
    status: "0",
    visibility: "0",
    hasGeo: false,
    isEvent: false,
    imageUrl: null,
    dataSet: {
        dataSetId: '2db31909-c40a-4177-81ae-7c6c3eae6d69',
        dataSetName: "users",
        projectId: '79eb5496-9516-4318-ada4-60284b379ed2'
    },
    properties: [
        {
            key: 0,
            name: "Id",
            dataSetColumnName: "id",
            isPrimary: true,
            isTitle: false,
            valueType: "String"
        },
        {
            key: 1,
            name: "Created Date",
            dataSetColumnName: "created_date",
            isPrimary: false,
            isTitle: true,
            valueType: "Timestamp"
        }
    ],
    groups: [
        {
            id: "4e7086e9-38d5-4b1f-bc11-51b320c7a568"
        }
    ]
};

describe('API_BACKEND::ONTOLOGY::ObjectType-1', () => {
    beforeEach(() => {
        allure.epic('Ontology');
        allure.feature('ObjectType API Tests');
        allure.owner('QA Team');
    });

    describe("API Tests - Creating ObjectType (POST)", () => {
        allure.feature("ObjectType Creation");

        it("✅ Create ObjectType with valid data", async () => {
            allure.story("Create ObjectType with valid data");
            allure.description("This test creates an ObjectType using a valid request body and project ID.");

            const response = await createObjectType(environment.validProjectID, validRequestBody);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            console.log(`Created ObjectType ID: ${response.body}`);
            environment.objectId = response.body
            await sleep(1000);
        });

        it("❌ Create ObjectType without ProjectId", async () => {
            allure.story("Create ObjectType without ProjectId");
            allure.description("This test verifies behavior when no ProjectId is provided in the request.");

            const response = await createObjectType("", validRequestBody);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Create ObjectType with more than 50 character", async () => {
            allure.story("Create ObjectType with name exceeding 50 characters");
            allure.description("This test attempts to create an ObjectType with a name longer than 50 characters.");

            const invalidRequestBody = { ...validRequestBody };
            invalidRequestBody.name = 't'.repeat(52);

            const response = await createObjectType(environment.validProjectID, invalidRequestBody);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Created ObjectType ID: ${response.body}`);
            await sleep(1000);
        });

        it("❌ Create ObjectType with invalid ProjectId", async () => {
            allure.story("Create ObjectType with invalid ProjectId");
            allure.description("This test ensures proper error handling when an invalid ProjectId is provided.");

            const response = await createObjectType(environment.invalidProjectID, validRequestBody);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Create ObjectType with missing required fields", async () => {
            allure.story("Create ObjectType with missing required fields");
            allure.description("This test removes required field `name` from request body.");

            const invalidRequestBody = { ...validRequestBody };
            delete invalidRequestBody.name;

            const response = await createObjectType(environment.validProjectID, invalidRequestBody);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    });

    describe("API Tests - Updating ObjectType (PUT)", () => {
        allure.feature("ObjectType Updating");

        it("✅ Update ObjectType with valid data", async () => {
            allure.story("Update ObjectType with valid data");
            allure.description("This test updates an ObjectType with a valid ID and payload.");

            const updatedBody = { ...validRequestBody };
            updatedBody.name = 'Updated ObjectType ' + randomString(2);
            updatedBody.pluralName = 'UpdatedStrings ' + randomString(2);
            updatedBody.description = "Updated description " + randomString(2);

            const response = await updateObjectType(environment.validProjectID, environment.objectId, updatedBody);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            console.log(`Updated ObjectType ID: ${response.body}`);
            await sleep(1000);
        });

        it("❌ Update ObjectType with invalid ID", async () => {
            allure.story("Update ObjectType with invalid ID");
            allure.description("This test attempts to update an ObjectType using an invalid ID.");

            const updatedBody = { ...validRequestBody };
            updatedBody.name = 'Updated ObjectType ' + randomString(2);
            updatedBody.pluralName = 'UpdatedStrings ' + randomString(2);
            updatedBody.description = "Updated description " + randomString(2);

            const response = await updateObjectType(environment.validProjectID, environment.invalidObjectTypeID, updatedBody);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Update ObjectType without ProjectId", async () => {
            allure.story("Update ObjectType without ProjectId");
            allure.description("This test sends an update request with an empty ProjectId.");

            const updatedBody = { ...validRequestBody };
            updatedBody.name = 'Updated ObjectType ' + randomString(2);
            updatedBody.pluralName = 'UpdatedStrings ' + randomString(2);
            updatedBody.description = "Updated description " + randomString(2);

            const response = await updateObjectType("", environment.objectId, updatedBody);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Update ObjectType with missing required fields", async () => {
            allure.story("Update ObjectType with missing name");
            allure.description("This test sends an update request without the `name` field.");

            const updatedBody = { ...validRequestBody };
            updatedBody.name = 'Updated ObjectType ' + randomString(2);
            updatedBody.pluralName = 'UpdatedStrings ' + randomString(2);
            updatedBody.description = "Updated description " + randomString(2);
            delete updatedBody.name;

            const response = await updateObjectType(environment.validProjectID, environment.objectId, updatedBody);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Update ObjectType with invalid data types", async () => {
            allure.story("Update ObjectType with invalid data types");
            allure.description("This test sends number values for fields that should be strings.");

            const updatedBody = { ...validRequestBody };
            updatedBody.name = 123123 as any;
            updatedBody.pluralName = 1212 as any;
            updatedBody.description = 12312 as any;

            const response = await updateObjectType(environment.validProjectID, environment.objectId, updatedBody);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("✅ Get ObjectType with valid ID", async () => {
            allure.story("Get ObjectType with valid ID");
            allure.description("This test retrieves the ObjectType by valid ID and checks its fields.");

            const response = await getObjectType(environment.validProjectID, environment.objectId);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("id", environment.objectId);
            expect(response.body).toHaveProperty("name");
            console.log(`Fetched ObjectType Name: ${response.body.name}`);
            await sleep(1000);
        });

        it("❌ Get ObjectType with missing ID", async () => {
            allure.story("Get ObjectType with missing ID");
            allure.description("This test attempts to retrieve an ObjectType without specifying ID.");

            const response = await getObjectType(environment.validProjectID, "");

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Get ObjectType with invalid ID", async () => {
            allure.story("Get ObjectType with invalid ID");
            allure.description("This test checks response when an invalid ObjectType ID is provided.");

            const response = await getObjectType(environment.validProjectID, environment.invalidObjectTypeID);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Get ObjectType with missing ProjectId", async () => {
            allure.story("Get ObjectType with missing ProjectId");
            allure.description("This test checks response when the ProjectId is empty.");

            const response = await getObjectType("", environment.objectId);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    });



    describe("API Tests - Fetching ObjectTypes by DataSetId (GET)", () => {
        allure.feature("Fetch ObjectTypes by DataSetId");
    
        it("✅ Get ObjectTypes with valid DataSetId", async () => {
            allure.story("Valid DataSetId");
            allure.description("Fetch all ObjectTypes linked to a valid dataset.");
    
            const response = await getObjectTypesByDataSet(environment.validProjectID, environment.datasetid);
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            console.log(`Retrieved ${response.body.length} ObjectTypes`);
            await sleep(1000);
        });
    
        it("❌ Get ObjectTypes with missing DataSetId", async () => {
            allure.story("Missing DataSetId");
            allure.description("Try fetching ObjectTypes with empty dataset ID.");
    
            const response = await getObjectTypesByDataSet(environment.validProjectID, "");
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Get ObjectTypes with invalid DataSetId", async () => {
            allure.story("Invalid DataSetId");
            allure.description("Try fetching ObjectTypes with an invalid dataset ID.");
    
            const response = await getObjectTypesByDataSet(environment.validProjectID, 'invalid dataset id');
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(404);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Get ObjectTypes with missing ProjectId", async () => {
            allure.story("Missing ProjectId");
            allure.description("Try fetching ObjectTypes with no project ID.");
    
            const response = await getObjectTypesByDataSet("", environment.objectId);
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("✅ Get ObjectTypes with empty DataSet (no linked ObjectTypes)", async () => {
            allure.story("Empty dataset");
            allure.description("Should return empty list if no ObjectTypes are linked to the dataset.");
    
            const response = await getObjectTypesByDataSet(environment.validProjectID, environment.emptyDataSetID);
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
            console.log(`No ObjectTypes found for DataSet: ${environment.emptyDataSetID}`);
            await sleep(1000);
        });
    });
    
    describe("API Tests - Deleting ObjectType (DELETE)", () => {
        allure.feature("Delete ObjectType");
    
        it("✅ Delete ObjectType with valid ID", async () => {
            allure.story("Valid Deletion");
            allure.description("Successfully deletes a valid ObjectType by ID.");
    
            const response = await deleteObjectType(environment.validProjectID, environment.objectId);
    
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            console.log(`Deleted ObjectType ID: ${environment.objectId}`);
            await sleep(1000);
        });
    
        it("❌ Delete ObjectType with missing ID", async () => {
            allure.story("Missing ObjectType ID");
            allure.description("Attempting to delete ObjectType with empty ID.");
    
            const response = await deleteObjectType(environment.validProjectID, "");
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Delete ObjectType with invalid ID", async () => {
            allure.story("Invalid ObjectType ID");
            allure.description("Invalid ID should result in error.");
    
            const response = await deleteObjectType(environment.validProjectID, 'invalid id');
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Delete ObjectType with missing ProjectId", async () => {
            allure.story("Missing ProjectId");
            allure.description("Try deleting an ObjectType without a ProjectId.");
    
            const response = await deleteObjectType("", environment.objectId);
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    });
    
    describe("API Tests - Updating ObjectType Status (PUT)", () => {
        allure.feature("Update ObjectType Status");
    
        it("✅ Update status for a single valid ObjectType", async () => {
            allure.story("Single ObjectType Status Update");
            allure.description("Sets status to Active for a valid ObjectType ID.");
    
            const response = await updateObjectTypeStatus(environment.validProjectID, [environment.obidforstatus], 'Active');
    
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(204);
            console.log(`Updated ObjectType Status: ${environment.obidforstatus} -> Active`);
            await sleep(1000);
        });
    
        it("✅ Update status for multiple valid ObjectTypes", async () => {
            allure.story("Multiple ObjectTypes Status Update");
            allure.description("Updates status for multiple valid ObjectType IDs.");
    
            const response = await updateObjectTypeStatus(environment.validProjectID, [environment.obidforstatus, environment.anotherValidObjectTypeID], 'Active');
    
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(204);
            console.log(`Updated ObjectTypes Status: ${environment.obidforstatus}, ${environment.anotherValidObjectTypeID} -> Active`);
            await sleep(1000);
        });
    
        it("❌ Update status with missing ObjectType IDs", async () => {
            allure.story("Missing ObjectType IDs");
            allure.description("Update call without any ObjectType IDs.");
    
            const response = await updateObjectTypeStatus(environment.validProjectID, [], 'Active');
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Update status with invalid ObjectType ID", async () => {
            allure.story("Invalid ObjectType ID");
            allure.description("Test updating status with invalid ObjectType ID.");
    
            const response = await updateObjectTypeStatus(environment.validProjectID, [environment.invalidObjectTypeID], 'Active');
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Update status with non-existent ObjectType ID", async () => {
            allure.story("Non-existent ObjectType ID");
            allure.description("Uses a made-up ObjectType ID to test failure.");
    
            const response = await updateObjectTypeStatus(environment.validProjectID, ['non-existing-id'], 'Active');
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Update status with invalid status value", async () => {
            allure.story("Invalid status value");
            allure.description("Passes a status value that's not supported by API.");
    
            const response = await updateObjectTypeStatus(environment.validProjectID, [environment.obidforstatus], 'sss');
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Update status with missing Project ID", async () => {
            allure.story("Missing Project ID");
            allure.description("Leaves projectId empty during status update call.");
    
            const response = await updateObjectTypeStatus("", [environment.obidforstatus], 'Active');
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    });
    
    describe("API Tests - Updating ObjectType Visibility (PUT)", () => {
        allure.feature("Update ObjectType Visibility");
    
        it("✅ Update visibility for a single valid ObjectType", async () => {
            allure.story("Single ObjectType visibility update");
            allure.description("Sets visibility to 'Normal' for a single valid ObjectType.");
    
            const response = await updateObjectTypeVisibility(environment.validProjectID, [environment.obidforstatus], 'Normal');
    
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(204);
            console.log(`Updated ObjectType Visibility: ${environment.obidforstatus} -> Normal`);
            await sleep(1000);
        });
    
        it("✅ Update visibility for multiple valid ObjectTypes", async () => {
            allure.story("Multiple ObjectTypes visibility update");
            allure.description("Updates visibility to 'Normal' for multiple ObjectTypes.");
    
            const response = await updateObjectTypeVisibility(environment.validProjectID, [environment.obidforstatus, environment.anotherValidObjectTypeID], 'Normal');
    
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(204);
            console.log(`Updated ObjectTypes Visibility: ${environment.obidforstatus}, ${environment.anotherValidObjectTypeID} -> Normal`);
            await sleep(1000);
        });
    
        it("❌ Update visibility with missing ObjectType IDs", async () => {
            allure.story("Missing ObjectType IDs");
            allure.description("Tries to update visibility with an empty ID list.");
    
            const response = await updateObjectTypeVisibility(environment.validProjectID, [], 'Normal');
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Update visibility with invalid ObjectType ID", async () => {
            allure.story("Invalid ObjectType ID");
            allure.description("Sends an invalid ObjectType ID when updating visibility.");
    
            const response = await updateObjectTypeVisibility(environment.validProjectID, ['invalid Object type id'], 'Normal');
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Update visibility with invalid visibility value", async () => {
            allure.story("Invalid visibility value");
            allure.description("Tests with an unsupported visibility value.");
    
            const response = await updateObjectTypeVisibility(environment.validProjectID, [environment.obidforstatus], 'Normal s');
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Update visibility with missing Project ID", async () => {
            allure.story("Missing Project ID");
            allure.description("Attempts to update visibility without specifying a project ID.");
    
            const response = await updateObjectTypeVisibility("", [environment.obidforstatus], 'Normal');
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    });
});    