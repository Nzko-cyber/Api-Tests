import {spec} from 'pactum';
import {CreateDashboardRequest, updateDashboard} from '../analysisInterface';

const BASE_URL = 'https://phoenix-dev.datamicron.com/api/bi/api/Dashboard';


export async function createDashboard(postData: CreateDashboardRequest) {
    try {
        const response = await spec()
            .post(`${BASE_URL}`)
            .withHeaders({
                'Content-Type': 'application/json-patch+json',
                'ProjectId': postData.projectId || "",
            })
            .withJson({
                ...postData,
                name: postData.name || '',
                analysisId: postData.analysisId || ''
            })
        return response;

    } catch (error:any) {
        console.error("❌ Error on creating Analysis:", error);
        return {error: true, message: error.message, details: error};

    }
}

export async function updateDashboard(projectId: string, dashdata: updateDashboard) {

    try {
        const response = await spec()
            .put(`${BASE_URL}`)
            .withHeaders({
                'Content-Type': 'application/json-patch+json',
                'ProjectId': projectId
            })
            .withJson({
                id: dashdata.id,
                name: dashdata.name,
                folderId: dashdata.folderId,
                description: dashdata.description,
                type: dashdata.type,
                semanticmodelId: dashdata.semanticModelId,
                filters: dashdata.filters,
                activetabdId: dashdata.activeTabId

            })
            .toss()
        console.log(`✅ Dashboard updated: ${dashdata.name}, id => ${dashdata.id}`);
        return response;
    } catch (error:any) {

        console.error("❌ Error on creating Analysis:", error);
        return {error: true, message: error.message, details: error};

    }

}

export async function getDashboard(projectId: string, id: string) {
    try {
        const response = await spec()
            .get(`${BASE_URL}?id=${id}`)
            .withHeaders({
                'ProjectId': projectId
            })
            .toss()
        console.log(`✅ get dashboard id:=> ${response}`);
        return response;

    } catch (error) {

        console.log(error)
    }

}

export async function deleteDashboard(projectId: string, id: string) {
    try {
        const response = await spec()
            .delete(`${BASE_URL}?id=${id}`)
            .withHeaders({
                'ProjectId': projectId
            })
            .toss()
        return response;

    } catch (error) {
        console.log(error)
    }
}

export async function getDashboardbyAnalysId(projectId: string, id: string, type: string) {
    try {
        const response = await spec()
            .get(`${BASE_URL}?id=${id}&type=${type}`)
            .withHeaders({
                'ProjectId': projectId
            })
            .toss()
        console.log(`✅ get dashboard id:=> ${response}`);
        return response;

    } catch (error) {

        console.log(error)
    }

}
