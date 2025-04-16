import {createAnalysis, deleteAnalysis, getAnalysis, updateAnalysis} from "../functions/analysis";
import {randomString, sleep} from "../../utils";


const environment = {
    validProjectID: "5c5c800c-ac58-464c-91cc-cff7a3a0f3d1",
    invalidProjectID: "invalid-project-id",
    validFolderID: "0baaf099-9c6d-4d49-948b-2dcf635356b3",
    invalidFolderID: "invalid-folder-id",
    analysisID: "",
    invalidAnalysisID: "invalid-analysis-id",
    duplicateName: "Test Analysis 123",
};


describe(" INSTABI::ANALYSIS", () => {
    beforeEach(() => {
        allure.epic("Instabi");
        allure.feature("Analysis API Tests");
        allure.owner("QA Team");
    });

    describe("API Tests - Creating Analysis (POST)", () => {
        allure.feature("Analysis Creation");

        it("✅ Create analysis with valid data", async () => {
            allure.story("Create Analysis with valid data");
            allure.description("This test validates successful creation of an analysis with valid inputs.");
            allure.label("layer", "api");
           

            const response = await createAnalysis({
                projectId: environment.validProjectID,
                name: `Test Analysis ${randomString(3)}`,
                description: "Generated for testing",
                folderId: environment.validFolderID,
                activeDashboardId: "dashboard_123",
                semanticModels: [{ id: "model_1", name: "Test Model" }],
            });

            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            environment.analysisID = response.body;

            console.log(`Analysis ID: ${environment.analysisID}`);
            await sleep(1000);
        });

        it("❌ Create analysis without ProjectId", async () => {
            allure.story("Create Analysis without ProjectId");
            allure.description("This test verifies validation error when ProjectId is not provided.");
            allure.label("layer", "api");
            allure.tag("negative");

            const response = await createAnalysis({
                projectId: null,
                name: `Test Analysis ${randomString(3)}`,
                description: "Generated for testing",
                folderId: environment.validFolderID,
                activeDashboardId: "dashboard_123",
                semanticModels: [{ id: "model_1", name: "Test Model" }],
            });

            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toBeDefined();
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Create analysis with invalid ProjectId", async () => {
            allure.story("Create Analysis with invalid ProjectId");
            allure.description("This test checks behavior when invalid ProjectId is used.");
            allure.label("layer", "api");

            const response = await createAnalysis({
                projectId: environment.invalidProjectID,
                name: `Test Analysis ${randomString(3)}`,
                description: "Generated for testing",
                folderId: environment.validFolderID,
                activeDashboardId: "dashboard_123",
                semanticModels: [{ id: "model_1", name: "Test Model" }],
            });

            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toBeDefined();
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Create analysis without Name", async () => {
            allure.story("Create Analysis without Name");
            allure.description("This test validates error handling when name field is empty.");
            allure.label("layer", "api");

            const response = await createAnalysis({
                projectId: environment.validProjectID,
                name: "",
                description: "Generated for testing",
                folderId: environment.validFolderID,
                activeDashboardId: "dashboard_123",
                semanticModels: [{ id: "model_1", name: "Test Model" }],
            });

            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toBeDefined();
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Create analysis with empty semanticModels", async () => {
            allure.story("Create Analysis with empty semanticModels");
            allure.description("This test checks creation when semanticModels is an empty array.");
            allure.label("layer", "api");
            allure.tag("edge");

            const response = await createAnalysis({
                projectId: environment.validProjectID,
                name: `Test Analysis ${randomString(3)}`,
                description: "Generated for testing",
                folderId: environment.validFolderID,
                activeDashboardId: "dashboard_123",
                semanticModels: [],
            });

            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            console.log(`Empty semanticModels, ID: ${response.body.id}`);
            await sleep(1000);
        });

        it("❌ Create analysis with duplicate name", async () => {
            allure.story("Create Analysis with duplicate name");
            allure.description("This test ensures the system throws error on duplicate analysis name.");
            allure.label("layer", "api");

            const response = await createAnalysis({
                projectId: environment.validProjectID,
                name: environment.duplicateName,
                description: "Generated for testing",
                folderId: environment.validFolderID,
                activeDashboardId: "dashboard_123",
                semanticModels: [{ id: "model_1", name: "Test Model" }],
            });

            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toBeDefined();
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    });
    describe("API Tests - Updating Analysis (PUT)", () => {
        allure.feature("Analysis Update");
    
        it("✅ Update analysis with valid data", async () => {
            allure.story("Update Analysis with valid data");
            allure.description("This test verifies successful update of an existing analysis with valid input.");
            allure.label("layer", "api");
    
            if (!environment.analysisID) {
                throw new Error("❌ Analysis ID is undefined! Cannot update.");
            }
    
            console.log(`🔍 Updating Analysis ID: ${environment.analysisID}`);
    
            const response = await updateAnalysis(environment.validProjectID, environment.analysisID, {
                projectId: environment.validProjectID,
                name: `Updated Analysis ${randomString(3)}`,
                description: "Updated description",
                folderId: environment.validFolderID,
                activeDashboardId: "dashboard_123",
                semanticModels: [{ id: "model_1", name: "Test Model" }]
            });
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body || {}, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(204);
            console.log(`✅ Successfully updated analysis, ID: ${environment.analysisID}`);
            await sleep(2000);
        });
    
        it("❌ Update analysis without ProjectId", async () => {
            allure.story("Update Analysis without ProjectId");
            allure.description("This test validates that ProjectId is required for updating analysis.");
            allure.label("layer", "api");
    
            const response = await updateAnalysis("", environment.analysisID, {
                projectId: "",
                name: `Updated Analysis ${randomString(3)}`,
                description: "Updated description",
                folderId: environment.validFolderID,
                activeDashboardId: "dashboard_123",
                semanticModels: [{ id: "model_1", name: "Test Model" }],
            });
    
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBeDefined();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toBeDefined();
            console.log(`✅ Ожидаемая ошибка: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Update analysis with invalid ProjectId", async () => {
            allure.story("Update Analysis with invalid ProjectId");
            allure.description("This test checks error handling for update with an invalid ProjectId.");
            allure.label("layer", "api");
    
            const response = await updateAnalysis("invalid-project-id", environment.analysisID, {
                projectId: "invalid-project-id",
                name: `Updated Analysis ${randomString(3)}`,
                description: "Updated description",
                folderId: environment.validFolderID,
                activeDashboardId: "dashboard_123",
                semanticModels: [{ id: "model_1", name: "Test Model" }],
            });
    
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toBeDefined();
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
          // it("❌ Unauthorized access to update analysis", async () => {
        //   const response = await updateAnalysis("unauthorized-project-id", environment.analysisID, {
        //     projectId: "unauthorized-project-id",
        //     name: Updated Analysis ${randomString(3)},
        //     description: "Updated description",
        //     folderId: environment.validFolderID,
        //     activeDashboardId: "dashboard_123",
        //     semanticModels: [{ id: "model_1", name: "Test Model" }],
        //   });

        //   expect(response).toBeDefined();
        //   expect(response.statusCode).toBe(403);
        //   expect(response.body.errors).toBeDefined();
        //   expect(response.body.errors).toContain("Verify user permissions");
        //   console.log(✅ Expected Error: ${JSON.stringify(response.body.errors)});
        //   await sleep(1000);
        // });
    
        it("❌ Update analysis with existing name", async () => {
            allure.story("Update Analysis with duplicate name");
            allure.description("This test checks name uniqueness during analysis update.");
            allure.label("layer", "api");
    
            const response = await updateAnalysis(environment.validProjectID, environment.analysisID, {
                projectId: environment.validProjectID,
                name: environment.duplicateName,
                description: "Updated description",
                folderId: environment.validFolderID,
                activeDashboardId: "dashboard_123",
                semanticModels: [{ id: "model_1", name: "Test Model" }],
            });
    
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toBeDefined();
            expect(response.body.errors).toContain("Analysis with this name already exists");
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    });
    
    describe("API Tests - Get Analysis (Get)", () => {
        allure.feature("Get Analysis");
    
        it("✅ Get ANALYSIS with valid ID", async () => {
            allure.story("Get analysis by valid ID");
            allure.description("This test validates successful retrieval of an analysis by ID.");
            allure.label("layer", "api");
    
            const response = await getAnalysis(environment.validProjectID, environment.analysisID);
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            console.log(`Get analysis, ID: ${response.body.id}`);
            await sleep(1000);
        });
    
        it("❌ Get ANALYSIS with Invalid ProjectID", async () => {
            allure.story("Get analysis with invalid ProjectID");
            allure.description("This test validates error response when an invalid ProjectID is used.");
            allure.label("layer", "api");
    
            const response = await getAnalysis(environment.invalidProjectID, environment.analysisID);
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Get analysis, ID: ${response.body.id}`);
            await sleep(1000);
        });
    
        it("❌ Get ANALYSIS with Invalid AnalysisID", async () => {
            allure.story("Get analysis with invalid AnalysisID");
            allure.description("This test ensures error is returned when an invalid analysis ID is used.");
            allure.label("layer", "api");
    
            const response = await getAnalysis(environment.invalidProjectID, environment.invalidAnalysisID);
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Get analysis, ID: ${response.body.id}`);
            await sleep(1000);
        });
    
        it("❌ Get ANALYSIS without ID key", async () => {
            allure.story("Get analysis without AnalysisID");
            allure.description("This test validates error when no analysis ID is provided.");
            allure.label("layer", "api");
    
            const response = await getAnalysis(environment.invalidProjectID, "");
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Get analysis, ID: ${response.body.id}`);
            await sleep(1000);
        });
    
        it("❌ Get ANALYSIS without ProjectID key", async () => {
            allure.story("Get analysis without ProjectID");
            allure.description("This test validates error when no project ID is provided.");
            allure.label("layer", "api");
    
            const response = await getAnalysis("", environment.invalidAnalysisID);
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Get analysis, ID: ${response.body.id}`);
            await sleep(1000);
        });
    });
    
    describe("API Tests - Delete Analysis (Delete)", () => {
        allure.feature("Delete Analysis");
    
        it("✅ Delete Analysis", async () => {
            allure.story("Delete analysis using valid ID");
            allure.description("This test deletes an analysis using a valid project and analysis ID.");
            allure.label("layer", "api");
    
            await deleteAnalysis(environment.validProjectID, environment.analysisID);
    
            console.log(`Deleted analysis , ID: ${environment.analysisID}`);
            await sleep(1000);
        });
    
        it("✅ Delete ANALYSIS with valid ProjectId and AnalysisId", async () => {
            allure.story("Delete analysis with valid ProjectId and AnalysisId");
            allure.description("This test ensures deletion of analysis with correct inputs works as expected.");
            allure.label("layer", "api");
    
            const response = await deleteAnalysis(environment.validProjectID, environment.analysisID);
    
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(204);
            console.log(`✅ Successfully deleted analysis, ID: ${environment.analysisID}`);
        });
    
        it("❌ Delete ANALYSIS with invalid ProjectId", async () => {
            allure.story("Delete analysis with invalid ProjectId");
            allure.description("This test checks error handling for invalid project ID on delete.");
            allure.label("layer", "api");
    
            const response = await deleteAnalysis("invalid-project-id", environment.analysisID);
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toBeDefined();
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
        });
    
        it("❌ Delete ANALYSIS with invalid AnalysisId", async () => {
            allure.story("Delete analysis with invalid AnalysisId");
            allure.description("This test checks error response when trying to delete a non-existent analysis.");
            allure.label("layer", "api");
    
            const response = await deleteAnalysis(environment.validProjectID, "invalid-analysis-id");
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toBeDefined();
            expect(response.body.errors).toContain("Analysis not found");
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
        });
    
        it("❌ Delete ANALYSIS without AnalysisId", async () => {
            allure.story("Delete analysis without AnalysisId");
            allure.description("This test checks behavior when analysis ID is not provided in delete request.");
            allure.label("layer", "api");
    
            const response = await deleteAnalysis(environment.validProjectID, "");
    
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
        });
    });
});    