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
    beforeEach(() => {
        allure.epic("Ontology");
        allure.feature("ObjectType API Tests Seconf Half");
        allure.owner("QA Team");
    });

    describe("API Tests - Fetching ObjectTypes with Pagination (GET)", () => {
       allure.feature("ObjectTypes Pagination");

        it("✅ Get first page with default filters", async () => {
            allure.story("Pagination default");
            allure.description("Fetch first page of ObjectTypes with default pagination.");

            const response = await getObjectTypesWithPagination({ PageNumber: 1, PageSize: 20 }, environment.validProjectID);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("items");
            expect(Array.isArray(response.body.items)).toBe(true);
            expect(response.body.items.length).toBeLessThanOrEqual(20);
            console.log(`Retrieved ${response.body.items.length} ObjectTypes`);

            await sleep(1000);
        });

        it("✅ Get second page with larger PageSize", async () => {
            allure.story("Pagination next page");
            allure.description("Fetch second page of ObjectTypes with specified page size.");

            const response = await getObjectTypesWithPagination({ PageNumber: 2, PageSize: 20 }, environment.validProjectID);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body.items)).toBe(true);
            console.log(`Retrieved ${response.body.items.length} ObjectTypes on page 2`);
            await sleep(1000);
        });

        it("✅ Get filtered ObjectTypes (Active, Normal visibility)", async () => {
            allure.story("Filtered results");
            allure.description("Applies Status and Visibility filters to pagination query.");

            const response = await getObjectTypesWithPagination({ PageNumber: 1, PageSize: 5, Statuses: ["Active"], Visibilities: ["Normal"] }, environment.validProjectID);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body.items)).toBe(true);
            console.log(`Filtered ObjectTypes count: ${response.body.items.length}`);
            await sleep(1000);
        });

        it("❌ Validate request with PageNumber exceeding total pages", async () => {
            allure.story("Large page number");
            allure.description("Requesting a large page size to check edge behavior.");

            const response = await getObjectTypesWithPagination({ PageNumber: 1, PageSize: 500 }, environment.validProjectID);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(response.body.items.length).toBeLessThanOrEqual(500);
            console.log(`Retrieved ${response.body.items.length} ObjectTypes`);
            await sleep(1000);
        });

        it("❌ Validate handling of PageNumber=0", async () => {
            allure.story("PageNumber zero");
            allure.description("PageNumber cannot be zero, expect 400 error.");

            const response = await getObjectTypesWithPagination({ PageNumber: 0, PageSize: 10 }, environment.validProjectID);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Get ObjectTypes with missing ProjectId", async () => {
            allure.story("Missing ProjectId");
            allure.description("Fetch ObjectTypes without project ID.");

            const response = await getObjectTypesWithPagination({ PageNumber: 1, PageSize: 10 }, "");

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Get ObjectTypes with invalid PageNumber", async () => {
            allure.story("Invalid PageNumber");
            allure.description("Negative PageNumber is not allowed.");

            const response = await getObjectTypesWithPagination({ PageNumber: -1, PageSize: 10 }, environment.validProjectID);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Get ObjectTypes with invalid PageSize", async () => {
            allure.story("Invalid PageSize");
            allure.description("PageSize must be greater than 0.");

            const response = await getObjectTypesWithPagination({ PageNumber: 1, PageSize: 0 }, environment.validProjectID);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("✅ Get ObjectTypes with sorting by name", async () => {
            allure.story("Sort by name");
            allure.description("Results should be ordered alphabetically by name.");

            const response = await getObjectTypesWithPagination({ PageNumber: 1, PageSize: 10, OrderBy: "name", OrderType: "asc" }, environment.validProjectID);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            console.log(`Sorted ObjectTypes count: ${response.body.items.length}`);
            await sleep(1000);
        });

        it("❌ Validate incorrect parameter values", async () => {
            allure.story("Wrong param types");
            allure.description("Sends non-numeric values to numeric parameters.");

            const response = await getObjectTypesWithPagination({ PageNumber: "invalid", PageSize: "wrong" } as any, environment.validProjectID);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("✅ Get ObjectTypes with search term", async () => {
            allure.story("Search functionality");
            allure.description("Uses a search term to filter ObjectTypes by name.");

            const response = await getObjectTypesWithPagination({ PageNumber: 1, PageSize: 10, SearchTerm: "Test" }, environment.validProjectID);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            console.log(`Search results count: ${response.body.items.length}`);
            await sleep(1000);
        });
    });

    describe("API Tests - Fetching ObjectType Graph (GET)", () => {
        allure.feature("ObjectType Graph pagnigation ");

        it("✅ Get ObjectType Graph with valid GroupId", async () => {
            allure.story("Graph with valid GroupId");
            allure.description("Returns ObjectType relationship graph for the specified group.");

            const response = await getObjectTypeGraph(environment.validProjectID, environment.validGroupID);

            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            await sleep(1000);
        });

        it("❌ Get ObjectType Graph with missing GroupId", async () => {
            allure.story("Missing GroupId");
            allure.description("Fails to fetch graph when GroupId is empty.");

            const response = await getObjectTypeGraph(environment.validProjectID, "");

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Get ObjectType Graph with invalid GroupId", async () => {
            allure.story("Invalid GroupId");
            allure.description("Fails to fetch graph with invalid group ID format.");

            const response = await getObjectTypeGraph(environment.validProjectID, environment.invalidGroupID);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body)}`);
            await sleep(1000);
        });

        it("❌ Get ObjectType Graph with non-existent GroupId", async () => {
            allure.story("Non-existent GroupId");
            allure.description("Fails to retrieve graph for a group that doesn't exist.");

            const response = await getObjectTypeGraph(environment.validProjectID, environment.nonExistentGroupID);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Get ObjectType Graph with missing ProjectId", async () => {
            allure.story("Missing ProjectId");
            allure.description("Fails to fetch graph when projectId is not provided.");

            const response = await getObjectTypeGraph("", environment.validGroupID);

            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    });

    describe("API Tests - Fetching ObjectTypes by GroupId (GET)", () => {
        allure.feature("Get ObjectTypes by Group");
    
        it("✅ Get ObjectTypes with valid GroupId", async () => {
            allure.story("Valid GroupId");
            allure.description("Fetch ObjectTypes using a valid GroupId.");
    
            const response = await getObjectTypesByGroup(environment.validProjectID, environment.validGroupID);
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            console.log(`Retrieved ${response.body.length} ObjectTypes for GroupId ${environment.validGroupID}`);
            await sleep(1000);
        });
    
        it("❌ Get ObjectTypes with missing GroupId", async () => {
            allure.story("Missing GroupId");
            allure.description("Attempt to fetch ObjectTypes with empty GroupId.");
    
            const response = await getObjectTypesByGroup(environment.validProjectID, "");
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Get ObjectTypes with invalid GroupId", async () => {
            allure.story("Invalid GroupId");
            allure.description("Attempt to fetch ObjectTypes using an invalid GroupId.");
    
            const response = await getObjectTypesByGroup(environment.validProjectID, environment.invalidGroupID);
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Get ObjectTypes with non-existent GroupId", async () => {
            allure.story("Non-existent GroupId");
            allure.description("Attempt to fetch ObjectTypes using a non-existent GroupId.");
    
            const response = await getObjectTypesByGroup(environment.validProjectID, environment.nonExistentGroupID);
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Get ObjectTypes with missing ProjectId", async () => {
            allure.story("Missing ProjectId");
            allure.description("Attempt to fetch ObjectTypes without ProjectId.");
    
            const response = await getObjectTypesByGroup("", environment.validGroupID);
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    });
    
    describe("API Tests - Fetching ObjectType Preview (GET)", () => {
        allure.feature("Get ObjectType Preview");
    
        it("✅ Get ObjectType Preview with valid ID and element count", async () => {
            allure.story("Valid Preview");
            allure.description("Fetch ObjectType preview using valid ID and element count.");
    
            const response = await getObjectTypePreview(environment.validProjectID, environment.validObjectTypeID, 100);
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("columns");
            expect(Array.isArray(response.body.previewData)).toBe(true);
            await sleep(1000);
        });
    
        it("❌ Get ObjectType Preview with missing ID", async () => {
            allure.story("Missing ObjectType ID");
            allure.description("Fails when ObjectType ID is not provided.");
    
            const response = await getObjectTypePreview(environment.validProjectID, "", 100);
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Get ObjectType Preview with invalid ID", async () => {
            allure.story("Invalid ObjectType ID");
            allure.description("Fails with an invalid ObjectType ID.");
    
            const response = await getObjectTypePreview(environment.validProjectID, environment.invalidObjectTypeID, 100);
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Get ObjectType Preview with non-existent ID", async () => {
            allure.story("Non-existent ObjectType ID");
            allure.description("Fails using a non-existing ObjectType ID.");
    
            const response = await getObjectTypePreview(environment.validProjectID, 'non existing id', 100);
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Get ObjectType Preview with missing ProjectId", async () => {
            allure.story("Missing ProjectId");
            allure.description("Fails if ProjectId is not sent in request.");
    
            const response = await getObjectTypePreview("", environment.validObjectTypeID, 100);
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Get ObjectType Preview with negative element count", async () => {
            allure.story("Negative count");
            allure.description("Fails when element count is negative.");
    
            const response = await getObjectTypePreview(environment.validProjectID, environment.validObjectTypeID, -10);
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("✅ Get ObjectType Preview with large element count (performance test)", async () => {
            allure.story("Performance preview");
            allure.description("Preview a large number of elements to test performance.");
    
            const response = await getObjectTypePreview(environment.validProjectID, environment.validObjectTypeID, 9999);
    
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            console.log(`Retrieved ${response.body.previewData.length} preview elements for performance test`);
            await sleep(1000);
        });
    });
});    