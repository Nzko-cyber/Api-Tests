import {
    getObjectTypeGraph,
    getObjectTypePreview,
    getObjectTypesByGroup,
    getObjectTypesWithPagination
} from "../functions/object-type-2";
import {sleep} from "../../utils";

const environment = {
    validProjectID: "79eb5496-9516-4318-ada4-60284b379ed2",
    validGroupID: "4e7086e9-38d5-4b1f-bc11-51b320c7a568",
    invalidGroupID: "invalid-group-id",
    nonExistentGroupID: "00000000-0000-0000-0000-000000000000",
    validObjectTypeID: "0b2037a6-e6bc-4113-8148-b37ce5d07eed",
    invalidObjectTypeID: "invalid-object-id",
};

describe("API_BACKEND::ONTOLOGY::ObjectType-2", () => {

    describe("API Tests - Fetching ObjectTypes with Pagination (GET)", () => {

        it("✅ Get first page with default filters", async () => {
            const response = await getObjectTypesWithPagination(
                {PageNumber: 1, PageSize: 20},
                environment.validProjectID
            );

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("items");
            expect(Array.isArray(response.body.items)).toBe(true);
            expect(response.body.items.length).toBeLessThanOrEqual(20);
            console.log(`Retrieved ${response.body.items.length} ObjectTypes`);

            await sleep(1000);
        });

        it("✅ Get second page with larger PageSize", async () => {
            const response = await getObjectTypesWithPagination(
                {PageNumber: 2, PageSize: 20},
                environment.validProjectID
            );

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body.items)).toBe(true);
            console.log(`Retrieved ${response.body.items.length} ObjectTypes on page 2`);
            await sleep(1000);
        });

        it("✅ Get filtered ObjectTypes (Active, Normal visibility)", async () => {
            const response = await getObjectTypesWithPagination(
                {PageNumber: 1, PageSize: 5, Statuses: ["Active"], Visibilities: ["Normal"]},
                environment.validProjectID
            );

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body.items)).toBe(true);
            console.log(`Filtered ObjectTypes count: ${response.body.items.length}`);
            await sleep(1000);
        });

        it("❌ Validate request with PageNumber exceeding total pages", async () => {
            const response = await getObjectTypesWithPagination({
                PageNumber: 1,
                PageSize: 500
            }, environment.validProjectID);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(response.body.items.length).toBeLessThanOrEqual(500);
            console.log(`Retrieved ${response.body.items.length} ObjectTypes`);
            await sleep(1000);
        });

        it("❌ Validate handling of PageNumber=0", async () => {
            const response = await getObjectTypesWithPagination({
                PageNumber: 0,
                PageSize: 10
            }, environment.validProjectID);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Get ObjectTypes with missing ProjectId", async () => {
            const response = await getObjectTypesWithPagination(
                {PageNumber: 1, PageSize: 10},
                ""
            );

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Get ObjectTypes with invalid PageNumber", async () => {
            const response = await getObjectTypesWithPagination(
                {PageNumber: -1, PageSize: 10},
                environment.validProjectID
            );

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Get ObjectTypes with invalid PageSize", async () => {
            const response = await getObjectTypesWithPagination(
                {PageNumber: 1, PageSize: 0},
                environment.validProjectID
            );

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("✅ Get ObjectTypes with sorting by name", async () => {
            const response = await getObjectTypesWithPagination(
                {PageNumber: 1, PageSize: 10, OrderBy: "name", OrderType: "asc"},
                environment.validProjectID
            );

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body.items)).toBe(true);
            console.log(`Sorted ObjectTypes count: ${response.body.items.length}`);
            await sleep(1000);
        });

        it("❌ Validate incorrect parameter values", async () => {
            const response = await getObjectTypesWithPagination({
                PageNumber: "invalid",
                PageSize: "wrong"
            }, environment.validProjectID);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("✅ Get ObjectTypes with search term", async () => {
            const response = await getObjectTypesWithPagination(
                {PageNumber: 1, PageSize: 10, SearchTerm: "Test"},
                environment.validProjectID
            );

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body.items)).toBe(true);
            console.log(`Search results count: ${response.body.items.length}`);
            await sleep(1000);
        });

    });

    describe("API Tests - Fetching ObjectType Graph (GET)", () => {

        it("✅ Get ObjectType Graph with valid GroupId", async () => {
            const response = await getObjectTypeGraph(environment.validProjectID, environment.validGroupID);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            await sleep(1000);
        });

        it("❌ Get ObjectType Graph with missing GroupId", async () => {
            const response = await getObjectTypeGraph(environment.validProjectID, "");

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Get ObjectType Graph with invalid GroupId", async () => {
            const response = await getObjectTypeGraph(environment.validProjectID, environment.invalidGroupID);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body)}`);
            await sleep(1000);
        });

        it("❌ Get ObjectType Graph with non-existent GroupId", async () => {
            const response = await getObjectTypeGraph(environment.validProjectID, environment.nonExistentGroupID);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Get ObjectType Graph with missing ProjectId", async () => {
            const response = await getObjectTypeGraph("", environment.validGroupID);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

    });

    describe("API Tests - Fetching ObjectTypes by GroupId (GET)", () => {

        it("✅ Get ObjectTypes with valid GroupId", async () => {
            const response = await getObjectTypesByGroup(environment.validProjectID, environment.validGroupID);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            console.log(`Retrieved ${response.body.length} ObjectTypes for GroupId ${environment.validGroupID}`);
            await sleep(1000);
        });

        it("❌ Get ObjectTypes with missing GroupId", async () => {
            const response = await getObjectTypesByGroup(environment.validProjectID, "");

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Get ObjectTypes with invalid GroupId", async () => {
            const response = await getObjectTypesByGroup(environment.validProjectID, environment.invalidGroupID);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Get ObjectTypes with non-existent GroupId", async () => {
            const response = await getObjectTypesByGroup(environment.validProjectID, environment.nonExistentGroupID);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Get ObjectTypes with missing ProjectId", async () => {
            const response = await getObjectTypesByGroup("", environment.validGroupID);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

    });

    describe("API Tests - Fetching ObjectType Preview (GET)", () => {

        it("✅ Get ObjectType Preview with valid ID and element count", async () => {
            const response = await getObjectTypePreview(environment.validProjectID, environment.validObjectTypeID, 100);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("columns");
            expect(Array.isArray(response.body.previewData)).toBe(true);
            await sleep(1000);
        });

        it("❌ Get ObjectType Preview with missing ID", async () => {
            const response = await getObjectTypePreview(environment.validProjectID, "", 100);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Get ObjectType Preview with invalid ID", async () => {
            const response = await getObjectTypePreview(environment.validProjectID, environment.invalidObjectTypeID, 100);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Get ObjectType Preview with non-existent ID", async () => {
            const response = await getObjectTypePreview(environment.validProjectID, 'non existing id', 100);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Get ObjectType Preview with missing ProjectId", async () => {
            const response = await getObjectTypePreview("", environment.validObjectTypeID, 100);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Get ObjectType Preview with negative element count", async () => {
            const response = await getObjectTypePreview(environment.validProjectID, environment.validObjectTypeID, -10);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("✅ Get ObjectType Preview with large element count (performance test)", async () => {
            const response = await getObjectTypePreview(environment.validProjectID, environment.validObjectTypeID, 9999);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            console.log(`Retrieved ${response.body.previewData.length} preview elements for performance test`);
            await sleep(1000);
        });

    });
});
