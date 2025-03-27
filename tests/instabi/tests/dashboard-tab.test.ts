import {
    createDashboardTab,
    deleteDashboardControl,
    getDashboardTab,
    getDashboardTabByDashboardId,
    updateDashboardControl
} from "../functions/dashboard-tab";
import {randomString, sleep} from "../../utils";
import * as allure from "allure-js-commons";

const environment = {
    validProjectID: "5c5c800c-ac58-464c-91cc-cff7a3a0f3d1",
    invalidProjectID: "invalid-project-id",
    validDashboardID: "74B1D414-C04D-4919-B3C9-828EC6D4BCF3",
    invalidDashboardID: "invalid-dashboard-id",
    tabid: '',
    duplicateName: "ExistingControl123"
};

describe("API_BACKEND::INSTABI::DASHBOARD_TAB", () => {
    beforeEach(async () => {
        allure.epic('Instabi');
        allure.feature('Dashboard Tab API Tests');
        allure.owner('QA Team');
    });

    describe("API Tests - Creating DashboardTab (POST)", () => {
        allure.feature('DashboardTab Creation');

        it("✅ Create DashboardControl with valid data", async () => {
            allure.story('Create DashboardTab with valid data');
            allure.description('This test validates the creation of a DashboardTab with valid data.');

            const response = await createDashboardTab(environment.validProjectID, {
                name: `Test Tab ${randomString(3)}`,
                dashboardId: environment.validDashboardID
            });

            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            environment.tabid = response.body;

            console.log(`✅ DashboardTab created: ${JSON.stringify(response.body)}`);
            await sleep(1000);
        });

        it("❌ Creating DashboardControl with empty ProjectId", async () => {
            allure.story('Create DashboardTab without ProjectId');
            allure.description('This test checks error handling when ProjectId is missing.');

            const response = await createDashboardTab("", {
                name: `Test Tab ${randomString(3)}`,
                dashboardId: environment.validDashboardID
            });

            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Creating DashboardControl with Invalid ProjectId", async () => {
            allure.story('Create DashboardTab with invalid ProjectId');
            allure.description('This test checks validation when using an invalid ProjectId.');

            const response = await createDashboardTab(environment.invalidProjectID, {
                name: `Test Tab ${randomString(3)}`,
                dashboardId: environment.validDashboardID
            });

            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Creating DashboardControl with Max Length Constraints", async () => {
            allure.story('Create DashboardTab with long name');
            allure.description('This test checks name length constraints by sending a very long tab name.');

            const response = await createDashboardTab(environment.validProjectID, {
                name: "T".repeat(55),
                dashboardId: environment.validDashboardID
            });

            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Creating DashboardControl with Missing required fields", async () => {
            allure.story('Create DashboardTab with missing name');
            allure.description('This test validates error when required fields are missing.');

            const response = await createDashboardTab(environment.validProjectID, {
                name: "",
                dashboardId: environment.validDashboardID
            });

            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Creating DashboardControl with Missing DashboardId", async () => {
            allure.story('Create DashboardTab without dashboardId');
            allure.description('This test checks behavior when DashboardId is missing.');

            const response = await createDashboardTab(environment.validProjectID, {
                name: `Test Tab ${randomString(3)}`,
                dashboardId: ""
            });

            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Creating DashboardControl with Invalid DashboardId", async () => {
            allure.story('Create DashboardTab with invalid dashboardId');
            allure.description('This test checks validation for invalid DashboardId.');

            const response = await createDashboardTab(environment.validProjectID, {
                name: `Test Tab ${randomString(3)}`,
                dashboardId: environment.invalidDashboardID
            });

            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Try to Send a request with all keys null", async () => {
            allure.story('Create DashboardTab with null fields');
            allure.description('This test checks validation when all fields are null.');

            const response = await createDashboardTab(environment.validProjectID, {
                name: null,
                dashboardId: null
            } as any);

            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });

        it("❌ Try to Create DashboardControl with duplicate name", async () => {
            allure.story('Create DashboardTab with duplicate name');
            allure.description('This test checks error when using a duplicate tab name.');

            const response = await createDashboardTab(environment.validProjectID, {
                name: "ExistingTab123",
                dashboardId: environment.validDashboardID
            });

            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    });
    describe("API Tests - Updating DashboardControl (PUT)", () => {
        allure.feature('DashboardTab Update');
    
        it("✅ Updating DashboardControl with valid data", async () => {
            allure.story('Update DashboardTab with valid data');
            allure.description('This test validates successful update of a DashboardTab with valid inputs.');
    
            const response = await updateDashboardControl(environment.validProjectID, {
                id: environment.tabid,
                name: `Updated Control ${randomString(3)}`,
            });
    
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(204);
            await sleep(1000);
        });
    
        it("❌ Updating DashboardControl with Missing ProjectId", async () => {
            allure.story('Update DashboardTab with missing ProjectId');
            allure.description('This test validates error handling when ProjectId is not provided.');
    
            const response = await updateDashboardControl("", {
                id: environment.tabid,
                name: `Updated Control ${randomString(3)}`,
            });
    
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            await sleep(1000);
        });
    
        it("❌ Updating DashboardControl with Invalid ProjectId", async () => {
            allure.story('Update DashboardTab with invalid ProjectId');
            allure.description('This test validates error when using an invalid ProjectId.');
    
            const response = await updateDashboardControl(environment.invalidProjectID, {
                id: environment.tabid,
                name: `Updated Control ${randomString(3)}`,
            });
    
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            await sleep(1000);
        });
    
        it("❌ Updating DashboardControl with Missing DashboardTabID", async () => {
            allure.story('Update DashboardTab with missing DashboardTabID');
            allure.description('This test checks behavior when DashboardTab ID is missing.');
    
            const response = await updateDashboardControl(environment.validProjectID, {
                id: environment.tabid,
                name: `Updated Control ${randomString(3)}`,
            });
    
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            await sleep(1000);
        });
    
        it("❌ Updating DashboardControl with Invalid DashboardTabID", async () => {
            allure.story('Update DashboardTab with invalid DashboardTabID');
            allure.description('This test checks error handling for an invalid DashboardTab ID.');
    
            const response = await updateDashboardControl(environment.validProjectID, {
                id: environment.tabid,
                name: `Updated Control ${randomString(3)}`,
            });
    
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Try update to existing name", async () => {
            allure.story('Update DashboardTab with duplicate name');
            allure.description('This test validates conflict when updating a DashboardTab to an existing name.');
    
            const response = await updateDashboardControl(environment.validProjectID, {
                id: environment.tabid,
                name: environment.duplicateName,
            });
    
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    });
    describe("API Tests - Fetching DashboardTab (GET)", () => {
        allure.feature('DashboardTab Fetch');
    
        it("✅ Valid DashboardTab Request", async () => {
            allure.story('Fetch DashboardTab with valid data');
            allure.description('This test ensures the DashboardTab is fetched successfully with valid project and tab ID.');
    
            const response = await getDashboardTab(environment.validProjectID, environment.tabid);
    
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            expect(response.body.id).toBe(environment.tabid);
            console.log(`Fetched DashboardTab: ${response.body.name}`);
            await sleep(1000);
        });
    
        it("❌ Get DashboardControl with Missing ProjectId", async () => {
            allure.story('Fetch DashboardTab with missing ProjectId');
            allure.description('This test validates error when ProjectId is missing.');
    
            const response = await getDashboardTab("", environment.tabid);
    
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Get DashboardControl with Invalid ProjectId", async () => {
            allure.story('Fetch DashboardTab with invalid ProjectId');
            allure.description('This test validates error when ProjectId is invalid.');
    
            const response = await getDashboardTab(environment.invalidProjectID, environment.tabid);
    
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Get DashboardControl with Missing DashboardTabID", async () => {
            allure.story('Fetch DashboardTab with missing DashboardTabID');
            allure.description('This test validates error when DashboardTab ID is missing.');
    
            const response = await getDashboardTab(environment.validProjectID, "");
    
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Get DashboardControl with Invalid DashboardTabID", async () => {
            allure.story('Fetch DashboardTab with invalid DashboardTabID');
            allure.description('This test checks error handling for an invalid DashboardTab ID.');
    
            const response = await getDashboardTab(environment.validProjectID, 'invalid id');
    
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    });
    
    describe("API Tests - Deleting DashboardControl (DELETE)", () => {
        allure.feature('DashboardTab Delete');
    
        it("❌ Deleting DashboardControl with Missing ProjectId", async () => {
            allure.story('Delete DashboardTab with missing ProjectId');
            allure.description('This test validates error when ProjectId is not provided.');
    
            const response = await deleteDashboardControl("", environment.tabid);
    
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Deleting DashboardControl with  Missing DashboardTabID", async () => {
            allure.story('Delete DashboardTab with missing DashboardTabID');
            allure.description('This test validates error when DashboardTab ID is missing.');
    
            const response = await deleteDashboardControl(environment.validProjectID, "");
    
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Deleting DashboardControl with  Invalid ProjectId", async () => {
            allure.story('Delete DashboardTab with invalid ProjectId');
            allure.description('This test checks error when using an invalid ProjectId.');
    
            const response = await deleteDashboardControl(environment.invalidProjectID, environment.tabid);
    
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Deleting DashboardControl with  Invalid DashboardTabID", async () => {
            allure.story('Delete DashboardTab with invalid DashboardTabID');
            allure.description('This test validates error when DashboardTab ID is invalid.');
    
            const response = await deleteDashboardControl(environment.validProjectID, 'inalid id');
    
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        // it("❌ Unauthorized access", async () => {
        //   const response = await deleteDashboardControl(environment.unauthorizedProjectID, environment.tabid);
    
        //   expect(response).toBeDefined();
        //   expect(response.statusCode).toBe(403); // Ожидается ошибка доступа
        //   console.log(`Error: ${JSON.stringify(response.body.errors)}`);
        //   await sleep(1000);
        // });
    
        it("✅ Deleting DashboardControl with Valid data", async () => {
            allure.story('Delete DashboardTab with valid data');
            allure.description('This test validates successful deletion of a DashboardTab.');
    
            const response = await deleteDashboardControl(environment.validProjectID, environment.tabid);
    
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(204);
            console.log(`Deleted DashboardControl ID: ${environment.tabid}`);
            await sleep(1000);
        });
    });
    
    describe("API Tests - Fetching DashboardTab by DashboardId (GET)", () => {
        allure.feature('DashboardTab Fetch By DashboardId');
    
        it("❌ Get DashboardTab with Missing DashboardTabID", async () => {
            allure.story('Fetch DashboardTabs with missing DashboardId');
            allure.description('This test checks behavior when DashboardId is not provided.');
    
            const response = await getDashboardTabByDashboardId(environment.validProjectID, "");
    
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Get DashboardTab with Invalid DashboardTabID", async () => {
            allure.story('Fetch DashboardTabs with invalid DashboardId');
            allure.description('This test checks behavior when DashboardId is invalid.');
    
            const response = await getDashboardTabByDashboardId(environment.validProjectID, environment.invalidDashboardID);
    
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Get DashboardTab with Missing ProjectId", async () => {
            allure.story('Fetch DashboardTabs with missing ProjectId');
            allure.description('This test checks behavior when ProjectId is missing.');
    
            const response = await getDashboardTabByDashboardId("", environment.validDashboardID);
    
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("❌ Get DashboardTab with Invalid ProjectId", async () => {
            allure.story('Fetch DashboardTabs with invalid ProjectId');
            allure.description('This test checks behavior when ProjectId is invalid.');
    
            const response = await getDashboardTabByDashboardId(environment.invalidProjectID, environment.validDashboardID);
    
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`Error: ${JSON.stringify(response.body.errors)}`);
            await sleep(1000);
        });
    
        it("✅ Get DashboardTab with Valid data", async () => {
            allure.story('Fetch DashboardTabs with valid data');
            allure.description('This test validates successful fetch of all DashboardTabs by DashboardId.');
    
            const response = await getDashboardTabByDashboardId(environment.validProjectID, environment.validDashboardID);
    
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
    
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            console.log(`Fetched DashboardTab for DashboardId: ${environment.validDashboardID}`);
            await sleep(1000);
        });
    });
    
});