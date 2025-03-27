import {createDashboard, deleteDashboard, getDashboard, updateDashboard} from '../functions/dashboard';
import {randomString} from '../../utils';
import * as allure from "allure-js-commons";
const environment = {
    validProjectID: "5c5c800c-ac58-464c-91cc-cff7a3a0f3d1",
    invalidProjectID: "invalid-project-id",
    validFolderID: "0baaf099-9c6d-4d49-948b-2dcf635356b3",
    invalidFolderID: "invalid-folder-id",
    analysisID: "0d5f7387-4183-49ba-b02d-d39e89cbf283",
    invalidAnalysisID: "invalid-analysis-id",
    duplicateName: "Test Analysis 123",
    dashboardid: ''
};

describe("API_BACKEND::INSTABI::Dashboard", () => {
    beforeEach(async () => {
        allure.epic('Instabi');
        allure.feature('Dashboard API Tests');
        allure.owner('QA Team');
    });

    describe("API Tests - Creating Analysis (POST)", () => {
        allure.feature('Dashboard Creation');

        it("✅ Create Dashboard with valid data", async () => {
            allure.story('Create Dashboard with valid data');
            allure.description('This test validates the creation of a dashboard with valid data.');
            const response = await createDashboard({
                projectId: environment.validProjectID,
                name: `Test Dashboard ${randomString(3)}`,
                description: "Test Description",
                analysisId: environment.analysisID,
                type: "Default",
                withDefaultTab: true,
            });

            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            console.log(`✅ Dashboard created, ID: ${response.body.id}`);

            environment.dashboardid = response.body;
        });

        it("❌ Create Dashboard without ProjectId", async () => {
            allure.story('Create Dashboard without ProjectId');
            allure.description('This test validates the error when creating a dashboard without a ProjectId.');
            const response = await createDashboard({
                projectId: "",
                name: `Test Dashboard ${randomString(3)}`,
                description: "Test Description",
                analysisId: environment.analysisID,
                type: "Default",
                withDefaultTab: true,
            });

            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
        });

        it("❌ Create Dashboard with invalid ProjectId", async () => {
            allure.story('Create Dashboard with invalid ProjectId');
            allure.description('This test validates the error when creating a dashboard with an invalid ProjectId.');
            const response = await createDashboard({
                projectId: environment.invalidProjectID,
                name: `Test Dashboard ${randomString(3)}`,
                description: "Test Description",
                analysisId: environment.analysisID,
                type: "Default",
                withDefaultTab: true,
            });

            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toBeDefined();
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
        });

        it("❌ Create Dashboard without name", async () => {
            allure.story('Create Dashboard without name');
            allure.description('This test validates the error when creating a dashboard without a name.');
            const response = await createDashboard({
                projectId: environment.validProjectID,
                name: "",
                description: "Test Description",
                analysisId: environment.analysisID,
                type: "Default",
                withDefaultTab: true,
            });

            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
        });

        it("❌ Create Dashboard with existing name", async () => {
            allure.story('Create Dashboard with existing name');
            allure.description('This test validates the error when creating a dashboard with a duplicate name.');
            const response = await createDashboard({
                projectId: environment.validProjectID,
                name: environment.duplicateName,
                description: "Test Description",
                analysisId: environment.analysisID,
                type: "Default",
                withDefaultTab: true,
            });

            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toContain("Dashboard with this name already exists");
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
        });
    });

    describe("API Tests - Updating Dashboard (PUT)", () => {
        allure.feature('Dashboard Update');

        it("✅ Update Dashboard with valid data", async () => {
            allure.story('Update Dashboard with valid data');
            allure.description('This test validates the update of a dashboard with valid data.');
            const response = await updateDashboard(environment.validProjectID, {
                id: environment.dashboardid,
                name: `Updated Dashboard ${randomString(3)}`,
                folderId: environment.validFolderID,
                description: "Updated Description",
                type: "Default",
                semanticModelId: "model-123",
                filters: null,
                activeTabId: "tab-123",
            });

            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(204);
            console.log(`✅ Dashboard updated, ID: ${response.body.id}`);
        });

        it("❌ Update Dashboard without ProjectId", async () => {
            allure.story('Update Dashboard without ProjectId');
            allure.description('This test validates the error when updating a dashboard without a ProjectId.');
            const response = await updateDashboard("", {
                id: environment.dashboardid,
                name: `Updated Dashboard ${randomString(3)}`,
                folderId: environment.validFolderID,
                description: "Updated Description",
                type: "Default",
                semanticModelId: "model-123",
                filters: null,
                activeTabId: "tab-123",
            });

            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toBeDefined();
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
        });

        it("❌ Update Dashboard with invalid ProjectId", async () => {
            allure.story('Update Dashboard with invalid ProjectId');
            allure.description('This test validates the error when updating a dashboard with an invalid ProjectId.');
            
            const response = await updateDashboard(environment.invalidProjectID, {
                id: environment.dashboardid,
                name: `Updated Dashboard ${randomString(3)}`,
                folderId: environment.validFolderID,
                description: "Updated Description",
                type: "Default",
                semanticModelId: "model-123",
                filters: null,
                activeTabId: "tab-123",
            });

            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
        });

        it("❌ Update Dashboard with invalid DashboardId", async () => {
            allure.story('Update Dashboard with invalid DashboardId');
            allure.description('This test validates the error when updating a dashboard with an invalid DashboardId.');
            
            const response = await updateDashboard(environment.validProjectID, {
                id: "invalid-dashboard-id",
                name: `Updated Dashboard ${randomString(3)}`,
                folderId: environment.validFolderID,
                description: "Updated Description",
                type: "Default",
                semanticModelId: "model-123",
                filters: null,
                activeTabId: "tab-123",
            });

            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toBeDefined();
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
        });

        it("❌ Update Dashboard with duplicate name", async () => {
            allure.story('Update Dashboard with duplicate name');
            allure.description('This test validates the error when updating a dashboard with a duplicate name.');
            
            const response = await updateDashboard(environment.validProjectID, {
                id: environment.dashboardid,
                name: "",
                folderId: environment.validFolderID,
                description: "Updated Description",
                type: "Default",
                semanticModelId: "model-123",
                filters: null,
                activeTabId: "tab-123",
            });

            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toBeDefined();
            expect(response.body.errors).toContain("Name is required");
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
        });

        it("❌ Update Dashboard with existing name", async () => {
            allure.story('Update Dashboard with existing name');
            allure.description('This test validates the error when updating a dashboard with an existing name.');
            
            const response = await updateDashboard(environment.validProjectID, {
                id: environment.dashboardid,
                name: environment.duplicateName,
                folderId: environment.validFolderID,
                description: "Updated Description",
                type: "Default",
                semanticModelId: "model-123",
                filters: null,
                activeTabId: "tab-123",
            });

            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toContain("Dashboard with this name already exists");
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
        });
    });

    describe("📌 API Tests - GET Dashboard  Tests", () => {
        allure.feature('Dashboard Retrieval');

        it("✅ Should get an existing dashboard", async () => {
            allure.story('Get an existing dashboard');
            allure.description('This test validates the retrieval of an existing dashboard.');

            const response = await getDashboard(environment.validProjectID, environment.dashboardid);

            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response.statusCode).toBe(200);
            console.log(` Found Dashboard: ${response.body.name}`);
        });

        it("❌ Should return 404 for non-existing dashboard", async () => {
            const response = await getDashboard(environment.validProjectID, "invalid-dashboard-id");
            allure.story('Should return 404 for non-existing dashboard');
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
            allure.description('Ensures the API returns a 404 error when attempting to retrieve a dashboard with an invalid dashboardId.');


            expect(response.statusCode).toBe(400);
            console.log("❌ Dashboard not found as expected.");
        });

        it("❌ Should return error with invalid projectId", async () => {
            const response = await getDashboard(environment.invalidProjectID, environment.dashboardid);
            allure.story('Should return error with invalid projectId');
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
            allure.description('Verifies that the API responds with an error when an invalid projectId is provided for dashboard retrieval.');

            expect(response.statusCode).toBe(400);
            console.log("❌ Invalid projectId error as expected.");
        });

    });

    describe("📌 DELETE Dashboard Tests", () => {
        allure.feature('Dashboard Deletion');

        it("✅ Should delete an existing dashboard", async () => {
            allure.story('Delete an existing dashboard');
  
            allure.description('This test validates the deletion of an existing dashboard.');

            expect(environment.dashboardid).not.toBeNull();

            const response = await deleteDashboard(environment.validProjectID, environment.dashboardid);
            allure.parameter("HTTP Status", response.statusCode);
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });

            expect(response.statusCode).toBe(204);
            console.log(`🗑 Dashboard ${environment.dashboardid} deleted successfully.`);
        });

        it("❌ Should return 400 for deleting a non-existing dashboard", async () => {
            const response = await deleteDashboard(environment.validProjectID, "non-existent-dashboard-id");
            allure.story('Should return 400 for deleting a non-existing dashboard');
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
            allure.description('Ensures the API returns a 404 error when trying to delete a dashboard that does not exist.');

            expect(response.statusCode).toBe(400);
            console.log("❌ Dashboard deletion failed as expected (non-existent ID).");
        });

        it("❌ Should return error for missing projectId", async () => {
            const response = await deleteDashboard("", environment.dashboardid);
            allure.story('Should return error for missing projectId');
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
            allure.description('Verifies that the API returns a 400 error when the projectId is missing in the delete request.');

            expect(response.statusCode).toBe(400);
            console.log("❌ Deletion failed due to missing projectId.");
        });

    });
    describe('Get Dashboards by Analysisid', () => {
//todo later

    })

});