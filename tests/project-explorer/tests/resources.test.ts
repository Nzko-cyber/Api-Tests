import {
    getChangesLastWeek,
    getResourceUsages,
    searchResources,
    updateResourceName,
} from "../functions/recource";

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
    beforeEach(() => {
        allure.epic("Project Explorer");
        allure.feature("Project Explorer API Tests");
        allure.owner("QA Team");
    });
    describe("API Tests - Search Resources (GET)", () => {
        allure.story("Search Resources");
        const projectId = "79eb5496-9516-4318-ada4-60284b379ed2";

        it("✅ Search with basic pagination", async () => {
            allure.story("Search with basic pagination");
            allure.description(
                "This test case verifies that the search functionality works with basic pagination",
            );

            const response = await searchResources(
                { PageSize: 10, PageNumber: 1 },
                projectId,
            );
            
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
        });

        it("✅ Search with maximum PageSize handling", async () => {
            allure.story("Search with maximum PageSize handling");
            allure.description(
                "This test case verifies that the search functionality works with maximum PageSize handling",
            );

            const response = await searchResources(
                { PageSize: 1000, PageNumber: 1 },
                projectId,
            );
            
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
        });

        it("❌  Validate handling of PageNumber=0", async () => {
            allure.story("Validate handling of PageNumber=0");
            allure.description(
                "This test case verifies that the search functionality handles PageNumber=0",
            );

            const response = await searchResources(
                { PageSize: 10, PageNumber: 0 },
                projectId,
            );
            
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
        });

        it("❌  Validate request with PageNumber exceeding total pages", async () => {
            allure.story(
                "Validate request with PageNumber exceeding total pages",
            );
            allure.description(
                "This test case verifies that the search functionality handles PageNumber exceeding total pages",
            );

            const response = await searchResources(
                { PageSize: 10, PageNumber: 9999 },
                projectId,
            );
            
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
        });

        it("✅ Validate sorting with OrderBy and OrderType", async () => {
            allure.story("Validate sorting with OrderBy and OrderType");
            allure.description(
                "This test case verifies that the search functionality works with sorting by OrderBy and OrderType",
            );

            const response = await searchResources(
                { OrderBy: "name", OrderType: "asc" },
                projectId,
            );
            
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
        });

        it("✅ Validate filtering by SearchResourceType Apps", async () => {
            allure.story("Validate filtering by SearchResourceType Apps");
            allure.description(
                "This test case verifies that the search functionality works with filtering by SearchResourceType Apps",
            );

            const response = await searchResources(
                { SearchResourceType: "Apps" },
                projectId,
            );
            
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
        });
        it("✅ Validate filtering by SearchResourceType Datasets", async () => {
            allure.story("Validate filtering by SearchResourceType Datasets");
            allure.description(
                "This test case verifies that the search functionality works with filtering by SearchResourceType Datasets",
            );

            const response = await searchResources(
                { SearchResourceType: "Datasets" },
                projectId,
            );
            
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
        });
        it("✅ Validate filtering by SearchResourceType Files", async () => {
            allure.story("Validate filtering by SearchResourceType Files");
            allure.description(
                "This test case verifies that the search functionality works with filtering by SearchResourceType Files",
            );

            const response = await searchResources(
                { SearchResourceType: "Files" },
                projectId,
            );
            
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
        });
        it("✅ Validate filtering by SearchResourceType Object Types", async () => {
            allure.story(
                "Validate filtering by SearchResourceType Object Types",
            );
            allure.description(
                "This test case verifies that the search functionality works with filtering by SearchResourceType Object Types",
            );

            const response = await searchResources(
                { SearchResourceType: "ObjectTypes" },
                projectId,
            );
            
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
        });

        it("✅ Validate search functionality with SearchTerm", async () => {
            allure.story("Validate search functionality with SearchTerm");
            allure.description(
                "This test case verifies that the search functionality works with SearchTerm",
            );

            const response = await searchResources(
                { SearchTerm: "test" },
                projectId,
            );
            
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            // expect(response.body.length).toBeGreaterThanOrEqual(0);
        });

        it("❌  Validate incorrect parameter values", async () => {
            allure.story("Validate incorrect parameter values");
            allure.description(
                "This test case verifies that the search functionality handles incorrect parameter values",
            );

            const response = await searchResources(
                { PageSize: "abc", PageNumber: "xyz" },
                projectId,
            );
            
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
        });
        it("❌  Validate incorrect parameter values with negative numbers", async () => {
            allure.story(
                "Validate incorrect parameter values with negative numbers",
            );
            allure.description(
                "This test case verifies that the search functionality handles incorrect parameter values with negative numbers",
            );

            const response = await searchResources(
                { PageSize: -100, PageNumber: -100 },
                projectId,
            );
            
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
        });

        it("✅ Validate search functionality with SearchTerm", async () => {
            allure.story("Validate search functionality with SearchTerm");
            allure.description(
                "This test case verifies that the search functionality works with SearchTerm",
            );

            const response = await searchResources(
                { SearchTerm: "t".repeat(51) },
                projectId,
            );
            
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });

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
        allure.story("Get Changes Last Week");

        const projectId = "79eb5496-9516-4318-ada4-60284b379ed2";

        it("✅ Fetch with basic pagination", async () => {
            allure.story("Fetch with basic pagination");
            allure.description(
                "This test case verifies that the changes last week can be fetched with basic pagination",
            );

            const response = await getChangesLastWeek(
                { PageSize: 10, PageNumber: 1 },
                projectId,
            );
            
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.headers["content-type"]).toContain(
                "application/json",
            );
        });

        it("✅ Fetch with maximum PageSize", async () => {
            allure.story("Fetch with maximum PageSize");
            allure.description(
                "This test case verifies that the changes last week can be fetched with maximum PageSize",
            );

            const response = await getChangesLastWeek(
                { PageSize: 1000, PageNumber: 1 },
                projectId,
            );
            
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(response.headers["content-length"]).toBeDefined();
        });

        it("✅ Validate handling of PageNumber=0", async () => {
            allure.story("Validate handling of PageNumber=0");
            allure.description(
                "This test case verifies that the changes last week can be fetched with PageNumber=0",
            );

            const response = await getChangesLastWeek(
                { PageSize: 10, PageNumber: 0 },
                projectId,
            );
            
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
        });

        it("✅ Validate request with PageNumber exceeding total pages", async () => {
            allure.story(
                "Validate request with PageNumber exceeding total pages",
            );
            allure.description(
                "This test case verifies that the changes last week can be fetched with PageNumber exceeding total pages",
            );

            const response = await getChangesLastWeek(
                { PageSize: 10, PageNumber: 9999 },
                projectId,
            );
            
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
        });

        it("✅ Validate sorting with OrderBy and OrderType", async () => {
            allure.story("Validate sorting with OrderBy and OrderType");
            allure.description(
                "This test case verifies that the changes last week can be fetched with sorting by OrderBy and OrderType",
            );

            const response = await getChangesLastWeek(
                { OrderBy: "date", OrderType: "desc" },
                projectId,
            );
            
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
        });

        it("✅ Validate filtering with SearchTerm", async () => {
            allure.story("Validate filtering with SearchTerm");
            allure.description(
                "This test case verifies that the changes last week can be fetched with filtering by SearchTerm",
            );

            const response = await getChangesLastWeek(
                { SearchTerm: "update" },
                projectId,
            );
            
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
        });

        it("❌ Validate incorrect parameter values", async () => {
            allure.story("Validate incorrect parameter values");
            allure.description(
                "This test case verifies that the changes last week can be fetched with incorrect parameter values",
            );

            const response = await getChangesLastWeek(
                { PageSize: "abc", PageNumber: "xyz" },
                projectId,
            );
            
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
        });

        // it("❌ Validate SQL injection in SearchTerm", async () => {
        //   const response = await getChangesLastWeek({ SearchTerm: "' OR 1=1 --" }, projectId);

        //   expect(response).toBeDefined();
        //   expect(response.statusCode).toBe(400);
        // });

        it("✅ Validate Response Headers", async () => {
            allure.story("Validate Response Headers");
            allure.description(
                "This test case verifies that the response headers are correct",
            );

            const response = await getChangesLastWeek(
                { PageSize: 10, PageNumber: 1 },
                projectId,
            );
            
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });

            expect(response.headers).toBeDefined();
            expect(response.headers["content-type"]).toBe(
                "application/json; charset=utf-8",
            );
            expect(response.headers["strict-transport-security"]).toContain(
                "max-age=31536000",
            );
        });
    });

    describe("API Tests - Get Resource Usages (GET)", () => {
        allure.story("Get Resource Usages");

        const projectId = "79eb5496-9516-4318-ada4-60284b379ed2";
        const resourceId = "2db31909-c40a-4177-81ae-7c6c3eae6d69";

        it("✅ Fetch resource usages with valid ID", async () => {
            allure.story("Fetch resource usages with valid ID");
            allure.description(
                "This test case verifies that the resource usages can be fetched with a valid ID",
            );

            const response = await getResourceUsages(resourceId, projectId);
            
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("analysis");
            expect(response.body).toHaveProperty("semanticModels");
            expect(response.body).toHaveProperty("objectTypes");
            expect(response.body).toHaveProperty("linkedObjects");
        });

        it("✅ Validate handling of missing Resource ID", async () => {
            allure.story("Validate handling of missing Resource ID");
            allure.description(
                "This test case verifies that the resource usages cannot be fetched with a missing Resource ID",
            );

            const response = await getResourceUsages("", projectId);
            
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
        });

        it("✅ Validate handling of invalid Resource ID", async () => {
            allure.story("Validate handling of invalid Resource ID");
            allure.description(
                "This test case verifies that the resource usages cannot be fetched with an invalid Resource ID",
            );

            const response = await getResourceUsages(
                "invalid-resource-id",
                projectId,
            );
            
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
        });

        it("✅ Validate Response Headers", async () => {
            allure.story("Validate Response Headers");
            allure.description(
                "This test case verifies that the response headers are correct",
            );

            const response = await getResourceUsages(resourceId, projectId);
            
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });

            expect(response.headers).toBeDefined();
            expect(response.headers["content-type"]).toBe(
                "application/json; charset=utf-8",
            );
            expect(response.headers["strict-transport-security"]).toContain(
                "max-age=31536000",
            );
        });
    });

    describe("API Tests - updateResourceName (PUT)", () => {
        allure.story("Update Resource Name");
        
        it("✅ Update resource name with valid data", async () => {
            allure.story("Update resource name with valid data");
            allure.description(
                "This test case verifies that the resource name can be updated with valid data",
            );
            
            const response = await updateResourceName(
                validProjectId,
                validResourceId,
                validName,
            );
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });
            expect(response.statusCode).toBe(204);
            console.log(`Updated Resource Name: ${response.body.name}`);
        });

        it("❌ Should fail when ProjectId is missing", async () => {
            allure.story("Should fail when ProjectId is missing");
            allure.description(
                "This test case verifies that the resource name cannot be updated when ProjectId is missing",
            );
            
            const response = await updateResourceName(
                "",
                validResourceId,
                validName,
            );
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });
            expect(response.statusCode).toBe(400);
        });

        it("❌ Should fail when ProjectId is invalid", async () => {
            allure.story("Should fail when ProjectId is invalid");
            allure.description(
                "This test case verifies that the resource name cannot be updated when ProjectId is invalid",
            );
            
            const response = await updateResourceName(
                invalidProjectId,
                validResourceId,
                validName,
            );
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });
            expect(response.statusCode).toBe(400);
        });

        it("❌ Should fail when resourceId is missing", async () => {
            allure.story("Should fail when resourceId is missing");
            allure.description(
                "This test case verifies that the resource name cannot be updated when resourceId is missing",
            );
            
            const response = await updateResourceName(
                validProjectId,
                "",
                validName,
            );
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });
            expect(response.statusCode).toBe(400);
        });

        it("❌ Should fail when resourceId is invalid", async () => {
            allure.story("Should fail when resourceId is invalid");
            allure.description(
                "This test case verifies that the resource name cannot be updated when resourceId is invalid",
            );
            
            const response = await updateResourceName(
                validProjectId,
                invalidResourceId,
                validName,
            );
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });
            expect(response.statusCode).toBe(400);
        });

        it("❌ Should fail when name is empty", async () => {
            allure.story("Should fail when name is empty");
            allure.description(
                "This test case verifies that the resource name cannot be updated when name is empty",
            );
            
            const response = await updateResourceName(
                validProjectId,
                validResourceId,
                emptyName,
            );
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });
            expect(response.statusCode).toBe(400);
        });

        it("❌ Should fail when name exceeds character limit", async () => {
            allure.story("Should fail when name exceeds character limit");
            allure.description(
                "This test case verifies that the resource name cannot be updated when name exceeds character limit",
            );
            
            const response = await updateResourceName(
                validProjectId,
                validResourceId,
                longName,
            );
            allure.parameter("Status Code", String(response.statusCode));
            allure.attachment("Response Body", response.body || {}, {
                contentType: allure.ContentType.JSON,
            });
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
});
