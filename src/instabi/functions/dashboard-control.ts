import {spec} from 'pactum';
import {CreateDashboardControlRequest, updateDashboardControl} from '../analysisInterface';

const BASE_URL = 'https://phoenix-dev.datamicron.com/api/bi/api/DashboardControl';

export async function createDashboardControl(postData: CreateDashboardControlRequest) {
    try {
        const response = await spec()
            .post(BASE_URL)
            .withHeaders({
                'Content-Type': 'application/json-patch+json',
                'ProjectId': postData.projectId,
            })
            .withJson({
                ...postData,
            })
            .toss();

        return response;

    } catch (error:any) {
        console.error('❌ Error creating DashboardControl:', error);
        return {error: true, message: error.message, details: error};
    }
}

export async function updateDashboardControl(projectId: string, postData: updateDashboardControl) {
    try {
        const response = await spec()
            .put(`${BASE_URL}`)
            .withHeaders({
                'Content-Type': 'application/json-patch+json',
                'ProjectId': projectId,
            })
            .withJson(postData)
            .toss();

        console.log(`✅ DashboardControl updated, ID: ${postData.id}`);
        return {statusCode: response.statusCode};
    } catch (error:any) {
        console.error('❌ Error updating DashboardControl:', error);
        return {error: true, message: error.message, details: error};
    }
}


export async function deleteDashboardControl(projectId: string, id: string) {
    try {
        const response = await spec()
            .delete(`${BASE_URL}?id=${id}`)
            .withHeaders({'ProjectId': projectId})
            .toss();
        return response

        console.log(`✅ DashboardControl deleted, ID: ${id}`);
    } catch (error:any) {
        console.error('❌ Error deleting DashboardControl:', error);
        return {error: true, message: error.message, details: error};
    }
}

export async function getDashboardControl(projectId: string, id: string | null = null) {
    try {
        const response = await spec()
            .get(`${BASE_URL}?id=${id}`)
            .withHeaders({
                'ProjectId': projectId,
            })
            .toss();

        console.log(`✅ Get dashboard id: ${id}`);
        return response;
    } catch (error:any) {
        console.error('❌ Error retrieving DashboardControl:', error);

        return {
            error: true,
            statusCode: error.response?.statusCode || 500,
            message: error.message || 'Internal Server Error',
            details: error,
        };
    }
}

export async function getDashboardControlList(projectId: string, dashboardid: string) {
    try {
        const response = await spec()
            .get(`${BASE_URL}/by-dashboard-id?dashboardId=${dashboardid}`)
            .withHeaders({'ProjectId': projectId})
            .toss();

        console.log(`✅ Get dashboard list`);
        return response;
    } catch (error:any) {
        console.error('❌ Error retrieving DashboardControl list:', error);

        return {
            error: true,
            statusCode: error.response?.statusCode || 500,
            message: error.message || 'Internal Server Error',
            details: error,
        };
    }
}

export async function getDashboardControlListByTab(projectId: string, dashboardTabId: string) {
    try {
        const response = await spec()
            .get(`${BASE_URL}/by-dashboardtab-id?dashboardTabId=${dashboardTabId}`)
            .withHeaders({'ProjectId': projectId})
            .toss();

        console.log(`✅ Get dashboard list`);
        return response;
    } catch (error:any) {
        console.error('❌ Error retrieving DashboardControl list:', error);

        return {
            error: true,
            statusCode: error.response?.statusCode || 500,
            message: error.message || 'Internal Server Error',
            details: error,
        };
    }
}