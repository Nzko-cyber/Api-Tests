import {getChangesLastWeek, getResourceUsages, searchResources, updateResourceName} from "../functions/recource";

const validProjectId = "79eb5496-9516-4318-ada4-60284b379ed2";
const validName = "Updated Resource Name";
const validResourceId = "2db31909-c40a-4177-81ae-7c6c3eae6d69";
const invalidProjectId = "invalid-project-id";
const invalidResourceId = "invalid-resource-id";
const emptyName = "";
const longName = "a".repeat(51);
const sqlInjection = "'; DROP TABLE users; --";
const xssAttack = "<script>alert('Hacked')</script>";

describe("API_BACKEND::PROJECT-EXPLORER::RESOURCE", () => {
    describe("API Tests - Search Resources (GET)", () => {

        const projectId = "79eb5496-9516-4318-ada4-60284b379ed2";

        it("✅ Search with basic pagination", async () => {
            const response = await searchResources({PageSize: 10, PageNumber: 1}, projectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
        });

        it("✅ Search with maximum PageSize handling", async () => {
            const response = await searchResources({PageSize: 1000, PageNumber: 1}, projectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
        });

        it("❌  Validate handling of PageNumber=0", async () => {
            const response = await searchResources({PageSize: 10, PageNumber: 0}, projectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
        });

        it("❌  Validate request with PageNumber exceeding total pages", async () => {
            const response = await searchResources({PageSize: 10, PageNumber: 9999}, projectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
        });

        it("✅ Validate sorting with OrderBy and OrderType", async () => {
            const response = await searchResources({OrderBy: 'name', OrderType: 'asc'}, projectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
        });

        it("✅ Validate filtering by SearchResourceType Apps", async () => {
            const response = await searchResources({SearchResourceType: 'Apps'}, projectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
        });
        it("✅ Validate filtering by SearchResourceType Datasets", async () => {
            const response = await searchResources({SearchResourceType: 'Datasets'}, projectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
        });
        it("✅ Validate filtering by SearchResourceType Files", async () => {
            const response = await searchResources({SearchResourceType: 'Files'}, projectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
        });
        it("✅ Validate filtering by SearchResourceType Object Types", async () => {
            const response = await searchResources({SearchResourceType: 'ObjectTypes'}, projectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
        });


        it("✅ Validate search functionality with SearchTerm", async () => {
            const response = await searchResources({SearchTerm: 'test'}, projectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            // expect(response.body.length).toBeGreaterThanOrEqual(0);
        });

        it("❌  Validate incorrect parameter values", async () => {
            const response = await searchResources({PageSize: "abc", PageNumber: "xyz"}, projectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
        });
        it("❌  Validate incorrect parameter values with negative numbers", async () => {
            const response = await searchResources({PageSize: -100, PageNumber: -100}, projectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
        });

        it("✅ Validate search functionality with SearchTerm", async () => {
            const response = await searchResources({SearchTerm: 't'.repeat(51)}, projectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            expect(response.body.length).toBeGreaterThanOrEqual(0);
        });


        // it("✅ Validate SQL injection in SearchTerm", async () => {
        //   const response = await searchResources({ SearchTerm: "' OR 1=1 --" }, projectId);

        //   expect(response).toBeDefined();
        //   expect(response.statusCode).toBe(400);
        // });

    });


    describe("API Tests - Get Changes Last Week (GET)", () => {

        const projectId = "79eb5496-9516-4318-ada4-60284b379ed2";

        it("✅ Fetch with basic pagination", async () => {
            const response = await getChangesLastWeek({PageSize: 10, PageNumber: 1}, projectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.headers["content-type"]).toContain("application/json");
        });

        it("✅ Fetch with maximum PageSize", async () => {
            const response = await getChangesLastWeek({PageSize: 1000, PageNumber: 1}, projectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(response.headers["content-length"]).toBeDefined();
        });

        it("✅ Validate handling of PageNumber=0", async () => {
            const response = await getChangesLastWeek({PageSize: 10, PageNumber: 0}, projectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
        });

        it("✅ Validate request with PageNumber exceeding total pages", async () => {
            const response = await getChangesLastWeek({PageSize: 10, PageNumber: 9999}, projectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
        });

        it("✅ Validate sorting with OrderBy and OrderType", async () => {
            const response = await getChangesLastWeek({OrderBy: 'date', OrderType: 'desc'}, projectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
        });

        it("✅ Validate filtering with SearchTerm", async () => {
            const response = await getChangesLastWeek({SearchTerm: 'update'}, projectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
        });

        it("❌ Validate incorrect parameter values", async () => {
            const response = await getChangesLastWeek({PageSize: "abc", PageNumber: "xyz"}, projectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
        });


        // it("❌ Validate SQL injection in SearchTerm", async () => {
        //   const response = await getChangesLastWeek({ SearchTerm: "' OR 1=1 --" }, projectId);

        //   expect(response).toBeDefined();
        //   expect(response.statusCode).toBe(400);
        // });

        it("✅ Validate Response Headers", async () => {
            const response = await getChangesLastWeek({PageSize: 10, PageNumber: 1}, projectId);

            expect(response.headers).toBeDefined();
            expect(response.headers["content-type"]).toBe("application/json; charset=utf-8");
            expect(response.headers["strict-transport-security"]).toContain("max-age=31536000");
        });

    });

    describe("API Tests - Get Resource Usages (GET)", () => {

        const projectId = "79eb5496-9516-4318-ada4-60284b379ed2";
        const resourceId = "2db31909-c40a-4177-81ae-7c6c3eae6d69";

        it("✅ Fetch resource usages with valid ID", async () => {
            const response = await getResourceUsages(resourceId, projectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("analysis");
            expect(response.body).toHaveProperty("semanticModels");
            expect(response.body).toHaveProperty("objectTypes");
            expect(response.body).toHaveProperty("linkedObjects");
        });

        it("✅ Validate handling of missing Resource ID", async () => {
            const response = await getResourceUsages("", projectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
        });

        it("✅ Validate handling of invalid Resource ID", async () => {
            const response = await getResourceUsages("invalid-resource-id", projectId);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
        });


        it("✅ Validate Response Headers", async () => {
            const response = await getResourceUsages(resourceId, projectId);

            expect(response.headers).toBeDefined();
            expect(response.headers["content-type"]).toBe("application/json; charset=utf-8");
            expect(response.headers["strict-transport-security"]).toContain("max-age=31536000");
        });

    });

  describe("API Tests - updateResourceName (PUT)", () => {

        it("✅ Update resource name with valid data", async () => {
            const response = await updateResourceName(validProjectId, validResourceId, validName);
            expect(response.statusCode).toBe(204);
            console.log(`Updated Resource Name: ${response.body.name}`);
        });

        it("❌ Should fail when ProjectId is missing", async () => {
            const response = await updateResourceName("", validResourceId, validName);
            expect(response.statusCode).toBe(400);
        });

        it("❌ Should fail when ProjectId is invalid", async () => {
            const response = await updateResourceName(invalidProjectId, validResourceId, validName);
            expect(response.statusCode).toBe(400);
        });

        it("❌ Should fail when resourceId is missing", async () => {
            const response = await updateResourceName(validProjectId, "", validName);
            expect(response.statusCode).toBe(400);
        });

        it("❌ Should fail when resourceId is invalid", async () => {
            const response = await updateResourceName(validProjectId, invalidResourceId, validName);
            expect(response.statusCode).toBe(400);
        });

        it("❌ Should fail when name is empty", async () => {
            const response = await updateResourceName(validProjectId, validResourceId, emptyName);
            expect(response.statusCode).toBe(400);
        });

        it("❌ Should fail when name exceeds character limit", async () => {
            const response = await updateResourceName(validProjectId, validResourceId, longName);
            expect(response.statusCode).toBe(400);
        });

        // it("❌ Should fail when name contains SQL injection", async () => {
        //   const response = await updateResourceName(validProjectId, validResourceId, sqlInjection);
        //   expect(response.statusCode).toBe(400);
        // });

        // it("❌ Should fail when name contains XSS attack", async () => {
        //   const response = await updateResourceName(validProjectId, validResourceId, xssAttack);
        //   expect(response.statusCode).toBe(400);
        // });

    });


    //need to write tests for api/project-explorer/api/Resource
})