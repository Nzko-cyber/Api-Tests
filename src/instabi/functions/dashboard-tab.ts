import pactum from 'pactum';

const BASE_URL = "https://phoenix-dev.datamicron.com/api/bi/api/DashboardTab";

export async function createDashboardTab(projectId: string, tabData: { name: string; dashboardId: string }) {
    try {
        const response = await pactum.spec()
            .post(`${BASE_URL}`)
            .withHeaders({
                'Content-Type': 'application/json-patch+json',
                'ProjectId': projectId
            })
            .withJson(tabData)
            .toss();

        console.log(`✅ DashboardTab created: ${tabData.name}, dashboardId => ${tabData.dashboardId}`);
        return response;
    } catch (error:any) {
        console.error("❌ Error creating DashboardTab:", error);
        return {error: true, message: error.message, details: error};
    }
}

export async function updateDashboardControl(projectId: string, controlData: { id: string; name: string; }) {
    try {
        const response = await pactum.spec()
            .put(`${BASE_URL}`)
            .withHeaders({
                'Content-Type': 'application/json-patch+json',
                'ProjectId': projectId
            })
            .withJson(controlData)
            .toss();

        console.log(`✅ DashboardControl updated: ${controlData.name}, id => ${controlData.id}`);
        return response;
    } catch (error:any) {
        console.error("❌ Error updating DashboardControl:", error);
        return {error: true, message: error.message, details: error};
    }
}


export async function getDashboardTab(projectId: string, id: string) {
    try {
        const response = await pactum.spec()
            .get(`${BASE_URL}?id=${id}`)
            .withHeaders({'ProjectId': projectId})
            .toss();

        console.log(`✅ Fetched DashboardTab: ${response.body.name}, id => ${response.body.id}`);
        return response;
    } catch (error:any) {
        console.error("❌ Error fetching DashboardTab:", error);
        return {error: true, message: error.message, details: error};
    }
}

export async function deleteDashboardControl(projectId: string, dashboardTabId: string) {
    try {
        const response = await pactum.spec()
            .delete(`${BASE_URL}?id=${dashboardTabId}`)
            .withHeaders({'ProjectId': projectId})
            .toss();

        console.log(`✅ Deleted DashboardControl: id => ${dashboardTabId}`);
        return response;
    } catch (error:any) {
        console.error("❌ Error deleting DashboardControl:", error);
        return {error: true, message: error.message, details: error};
    }
}


export async function getDashboardTabByDashboardId(projectId: string, dashboardId: string) {
    try {
        const response = await pactum.spec()
            .get(`${BASE_URL}/by-dashboard-id?dashboardId=${dashboardId}`)
            .withHeaders({'ProjectId': projectId})
            .toss();

        console.log(`✅ Fetched DashboardTab for DashboardId: ${dashboardId}`);
        return response;
    } catch (error:any) {
        console.error("❌ Error fetching DashboardTab by DashboardId:", error);
        return {error: true, message: error.message, details: error};
    }
}