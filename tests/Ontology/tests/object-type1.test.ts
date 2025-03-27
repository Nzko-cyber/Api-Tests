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

const validRequestBody = {
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
    describe("API Tests - Creating ObjectType (POST)", () => {

        it("✅ Create ObjectType with valid data", async () => {
            const response = await createObjectType(environment.validProjectID, validRequestBody);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            console.log(`Created ObjectType ID: ${response.body}`);
            environment.objectId = response.body
            await sleep(1000);
        });

        it("❌ Create ObjectType without ProjectId", async () => {
            const response = await createObjectType("", validRequestBody);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
        it("❌ Create ObjectType with more than 50 character", async () => {
            const response = await createObjectType(environment.validProjectID, validRequestBody);
            const invalidRequestBody = {...validRequestBody};
            invalidRequestBody.name = 't'.repeat(52)
            expect(response).toBeDefined();

            expect(response.statusCode).toBe(400);
            console.log(`Created ObjectType ID: ${response.body}`);
            environment.objectId = response.body
            await sleep(1000);
        });

        it("❌ Create ObjectType with invalid ProjectId", async () => {
            const response = await createObjectType(environment.invalidProjectID, validRequestBody);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Create ObjectType with missing required fields", async () => {
            const invalidRequestBody = {...validRequestBody};
            delete invalidRequestBody.name;
            const response = await createObjectType(environment.validProjectID, invalidRequestBody);
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });


    });


    describe("API Tests - Updating ObjectType (PUT)", () => {

        it("✅ Update ObjectType with valid data", async () => {
            const updatedBody = {...validRequestBody}
            updatedBody.name = 'Updated ObjectType ' + randomString(2)
            updatedBody.pluralName = 'UpdatedStrings ' + randomString(2)
            updatedBody.description = "Updated description " + randomString(2)

            const response = await updateObjectType(environment.validProjectID, environment.objectId, updatedBody);


            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            console.log(`Updated ObjectType ID: ${response.body}`);
            await sleep(1000);
        });

        it("❌ Update ObjectType with invalid ID", async () => {
            const updatedBody = {...validRequestBody}
            updatedBody.name = 'Updated ObjectType ' + randomString(2)
            updatedBody.pluralName = 'UpdatedStrings ' + randomString(2)
            updatedBody.description = "Updated description " + randomString(2)

            const response = await updateObjectType(environment.validProjectID, environment.invalidObjectTypeID, updatedBody);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Update ObjectType without ProjectId", async () => {
            const updatedBody = {...validRequestBody}
            updatedBody.name = 'Updated ObjectType ' + randomString(2)
            updatedBody.pluralName = 'UpdatedStrings ' + randomString(2)
            updatedBody.description = "Updated description " + randomString(2)
            const response = await updateObjectType("", environment.objectId, updatedBody);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Update ObjectType with missing required fields", async () => {
            const updatedBody = {...validRequestBody}
            updatedBody.name = 'Updated ObjectType ' + randomString(2)
            updatedBody.pluralName = 'UpdatedStrings ' + randomString(2)
            updatedBody.description = "Updated description " + randomString(2)
            delete updatedBody.name;

            const response = await updateObjectType(environment.validProjectID, environment.objectId, updatedBody);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Update ObjectType with invalid data types", async () => {
            const updatedBody = {...validRequestBody}
            updatedBody.name = 123123 as any
            updatedBody.pluralName = 1212 as any
            updatedBody.description = 12312 as any

            const response = await updateObjectType(environment.validProjectID, environment.objectId, updatedBody);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("✅ Get ObjectType with valid ID", async () => {
            const response = await getObjectType(environment.validProjectID, environment.objectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("id", environment.objectId);
            expect(response.body).toHaveProperty("name");
            console.log(`Fetched ObjectType Name: ${response.body.name}`);
            await sleep(1000);
        });

        it("❌ Get ObjectType with missing ID", async () => {
            const response = await getObjectType(environment.validProjectID, "");

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Get ObjectType with invalid ID", async () => {
            const response = await getObjectType(environment.validProjectID, environment.invalidObjectTypeID);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Get ObjectType with missing ProjectId", async () => {
            const response = await getObjectType("", environment.objectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });


    });


    describe("API Tests - Fetching ObjectTypes by DataSetId (GET)", () => {

        it("✅ Get ObjectTypes with valid DataSetId", async () => {
            const response = await getObjectTypesByDataSet(environment.validProjectID, environment.datasetid);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            console.log(`Retrieved ${response.body.length} ObjectTypes`);
            await sleep(1000);
        });

        it("❌ Get ObjectTypes with missing DataSetId", async () => {
            const response = await getObjectTypesByDataSet(environment.validProjectID, "");

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Get ObjectTypes with invalid DataSetId", async () => {
            const response = await getObjectTypesByDataSet(environment.validProjectID, 'invalid dataset id');

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(404);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Get ObjectTypes with missing ProjectId", async () => {
            const response = await getObjectTypesByDataSet("", environment.objectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("✅ Get ObjectTypes with empty DataSet (no linked ObjectTypes)", async () => {
            const response = await getObjectTypesByDataSet(environment.validProjectID, environment.emptyDataSetID);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
            console.log(`No ObjectTypes found for DataSet: ${environment.emptyDataSetID}`);
            await sleep(1000);
        });

    });

    describe("API Tests - Deleting ObjectType (DELETE)", () => {

        it("✅ Delete ObjectType with valid ID", async () => {
            const response = await deleteObjectType(environment.validProjectID, environment.objectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            console.log(`Deleted ObjectType ID: ${environment.objectId}`);
            await sleep(1000);
        });

        it("❌ Delete ObjectType with missing ID", async () => {
            const response = await deleteObjectType(environment.validProjectID, "");

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Delete ObjectType with invalid ID", async () => {
            const response = await deleteObjectType(environment.validProjectID, 'invalid id');

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Delete ObjectType with missing ProjectId", async () => {
            const response = await deleteObjectType("", environment.objectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

    })

    describe("API Tests - Updating ObjectType Status (PUT)", () => {

        it("✅ Update status for a single valid ObjectType", async () => {
            const response = await updateObjectTypeStatus(environment.validProjectID, [environment.obidforstatus], 'Active');

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(204);
            console.log(`Updated ObjectType Status: ${environment.obidforstatus} -> Active`);
            await sleep(1000);
        });

        it("✅ Update status for multiple valid ObjectTypes", async () => {
            const response = await updateObjectTypeStatus(environment.validProjectID, [environment.obidforstatus, environment.anotherValidObjectTypeID], 'Active');

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(204);
            console.log(`Updated ObjectTypes Status: ${environment.obidforstatus}, ${environment.anotherValidObjectTypeID} -> ${'Active'}`);
            await sleep(1000);
        });

        it("❌ Update status with missing ObjectType IDs", async () => {
            const response = await updateObjectTypeStatus(environment.validProjectID, [], 'Active');

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Update status with invalid ObjectType ID", async () => {
            const response = await updateObjectTypeStatus(environment.validProjectID, [environment.invalidObjectTypeID], 'Active');

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Update status with non-existent ObjectType ID", async () => {
            const response = await updateObjectTypeStatus(environment.validProjectID, ['non-existing-id'], 'Active');

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Update status with invalid status value", async () => {
            const response = await updateObjectTypeStatus(environment.validProjectID, [environment.obidforstatus], 'sss');

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Update status with missing Project ID", async () => {
            const response = await updateObjectTypeStatus("", [environment.obidforstatus], 'Active');

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

    });

    describe("API Tests - Updating ObjectType Visibility (PUT)", () => {

        it("✅ Update visibility for a single valid ObjectType", async () => {
            const response = await updateObjectTypeVisibility(environment.validProjectID, [environment.obidforstatus], 'Normal');

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(204);
            console.log(`Updated ObjectType Visibility: ${environment.obidforstatus} -> ${'Normal'}`);
            await sleep(1000);
        });

        it("✅ Update visibility for multiple valid ObjectTypes", async () => {
            const response = await updateObjectTypeVisibility(environment.validProjectID, [environment.obidforstatus, environment.anotherValidObjectTypeID], 'Normal');

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(204);
            console.log(`Updated ObjectTypes Visibility: ${environment.obidforstatus}, ${environment.anotherValidObjectTypeID} -> ${'Normal'}`);
            await sleep(1000);
        });

        it("❌ Update visibility with missing ObjectType IDs", async () => {
            const response = await updateObjectTypeVisibility(environment.validProjectID, [], 'Normal');

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Update visibility with invalid ObjectType ID", async () => {
            const response = await updateObjectTypeVisibility(environment.validProjectID, ['invalid Object type id'], 'Normal');

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Update visibility with invalid visibility value", async () => {
            const response = await updateObjectTypeVisibility(environment.validProjectID, [environment.obidforstatus], 'Normal s');

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Update visibility with missing Project ID", async () => {
            const response = await updateObjectTypeVisibility("", [environment.obidforstatus], 'Normal');

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

    });
});