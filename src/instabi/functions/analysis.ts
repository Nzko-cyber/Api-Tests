import pactum from 'pactum';
import {CreateAnalysisRequest} from '../analysisInterface';

const BASE_URL = "https://phoenix-dev.datamicron.com/api/bi/api/Analysis";

const expectedSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "id": {"type": "string"},
        "projectId": {"type": "string"},
        "name": {"type": "string"},
        "description": {"type": "string"},
        "folderId": {"type": "string"},
        "activeDashboardId": {"type": "string"},
        "semanticModels": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "name": {"type": "string"}
                },
                "required": ["id", "name"]
            }
        },
        "createdAt": {"type": "string", "format": "date-time", "readOnly": true},
        "createdBy": {"type": ["string", "null"], "readOnly": true},
        "lastModifiedAt": {"type": "string", "format": "date-time", "readOnly": true},
        "lastModifiedBy": {"type": ["string", "null"], "readOnly": true}
    },
    "required": ["id", "name", "projectId"],
    "additionalProperties": false
};

export async function createAnalysis(postData: CreateAnalysisRequest) {
    try {
        const response = await pactum.spec()
            .post(`${BASE_URL}`)
            .withHeaders({
                'Content-Type': 'application/json-patch+json',
                'ProjectId': postData.projectId || "",
            })
            .withJson({
                ...postData,
                description: postData.description || "" ,
                folderId: postData.folderId || "",
                activeDashboardId: postData.activeDashboardId || "",
                semanticModels: postData.semanticModels || [],
            })
            .toss();

        console.log(`✅ Analysis created: ${postData.name}, id => ${response.body?.id || 'unknown'}`);
        return response;
    } catch (error: any) {
        console.error("❌ Error on creating Analysis:", error);
        return {error: true, message: error.message, details: error};
    }
}

export async function updateAnalysis(projectId: string, id: string, data: CreateAnalysisRequest): Promise<any> {
    try {
        const response = await pactum.spec()
            .put(`${BASE_URL}`)
            .withHeaders({
                'Content-Type': 'application/json-patch+json',
                'ProjectId': projectId
            })
            .withJson({
                id: id,
                name: data.name,
                description: data.description || "",
                activeDashboardId: data.activeDashboardId || "",
                semanticModels: data.semanticModels || []
            })
            .toss();

        console.log(`✅ Analysis updated: ${data.name}, id => ${id}`);
        return response;
    } catch (error:any) {
        console.error("❌ Error on updating analysis:", error);
        return {error: true, message: error.message, details: error};
    }
}

export async function deleteAnalysis(projectId: string, id: string): Promise<any> {
    const response = await pactum.spec()
        .delete(`${BASE_URL}?id=${id}`)
        .withHeaders({'ProjectId': projectId})
        .toss();

    console.log(`✅ Analysis deleted: id => ${id}`);
    return response;
}

export async function getAnalysis(projectId: string, id: string): Promise<any> {
    const response = await pactum.spec()
        .get(`${BASE_URL}?id=${id}`)
        .withHeaders({'ProjectId': projectId})
        .toss();

    console.log(`✅ Fetched Analysis: ${response.body.name}, id => ${response.body.id}`);
    return response;
}

export async function schemaValidationAnalysis(projectId: string, id: string): Promise<void> {
    await pactum.spec()
        .get(`${BASE_URL}?id=${id}`)
        .withHeaders({'ProjectId': projectId})
        .expectStatus(200)
        .expectJsonSchema(expectedSchema);
}