import pactum from 'pactum';

const BASE_URL = "https://phoenix-dev.datamicron.com/api/ontology/api/ObjectType";

export async function createObjectType(projectId: string, requestBody: any) {
    try {
        const response = await pactum.spec()
            .post(BASE_URL)
            .withHeaders({
                'Content-Type': 'application/json-patch+json',
                'ProjectId': projectId
            })
            .withJson(requestBody)
            .inspect()
            .toss();

        console.log(`✅ ObjectType created: ${response.body}`);
        return response;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("❌ Error creating ObjectType:", error.message);
            return { error: true, message: error.message, details: error };
        }
        console.error("❌ Unknown error creating ObjectType:", error);
        return { error: true, message: "An unknown error occurred", details: error };
    }
}

export async function updateObjectType(projectId: string, objectTypeId: string, requestBody: any) {
    try {
        const response = await pactum.spec()
            .put(BASE_URL)
            .withHeaders({
                'Content-Type': 'application/json-patch+json',
                'ProjectId': projectId
            })
            .withJson({ id: objectTypeId, ...requestBody })
            .inspect()
            .toss();

        console.log(`✅ ObjectType updated: ${response.body}`);
        return response;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("❌ Error updating ObjectType:", error.message);
            return { error: true, message: error.message, details: error };
        }
        console.error("❌ Unknown error updating ObjectType:", error);
        return { error: true, message: "An unknown error occurred", details: error };
    }
}

export async function getObjectType(projectId: string, objectTypeId: string) {
    try {
        const response = await pactum.spec()
            .get(`${BASE_URL}?id=${objectTypeId}`)
            .withHeaders({ 'ProjectId': projectId })
            .toss();

        console.log(`✅ Fetched ObjectType: ${response.body.name || "Unknown"}`);
        return response;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("❌ Error fetching ObjectType:", error.message);
            return { error: true, message: error.message, details: error };
        }
        console.error("❌ Unknown error fetching ObjectType:", error);
        return { error: true, message: "An unknown error occurred", details: error };
    }
}

export async function deleteObjectType(projectId: string, objectTypeId: string) {
    try {
        const response = await pactum.spec()
            .delete(`${BASE_URL}?id=${objectTypeId}`)
            .withHeaders({ 'ProjectId': projectId })
            .toss();

        console.log(`✅ Deleted ObjectType ID: ${objectTypeId}`);
        return response;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("❌ Error deleting ObjectType:", error.message);
            return { error: true, message: error.message, details: error };
        }
        console.error("❌ Unknown error deleting ObjectType:", error);
        return { error: true, message: "An unknown error occurred", details: error };
    }
}

export async function getObjectTypesByDataSet(projectId: string, dataSetId: string) {
    try {
        const response = await pactum.spec()
            .get(`${BASE_URL}/getByDataSet?DataSetId=${dataSetId}`)
            .withHeaders({ 'ProjectId': projectId })
            .toss();

        console.log(`✅ Retrieved ObjectTypes for DataSet: ${dataSetId}`);
        return response;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("❌ Error fetching ObjectTypes:", error.message);
            return { error: true, message: error.message, details: error };
        }
        console.error("❌ Unknown error fetching ObjectTypes:", error);
        return { error: true, message: "An unknown error occurred", details: error };
    }
}

export async function updateObjectTypeStatus(projectId: string, objectTypeIds: string[], status: string) {
    try {
        const response = await pactum.spec()
            .put(`${BASE_URL}/updateStatus`)
            .withHeaders({
                'Content-Type': 'application/json-patch+json',
                'ProjectId': projectId
            })
            .withJson({
                ids: objectTypeIds,
                status: status
            })
            .toss();

        console.log(`✅ Updated status for ObjectType(s): ${objectTypeIds.join(', ')}`);
        return response;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("❌ Error updating ObjectType status:", error.message);
            return { error: true, message: error.message, details: error };
        }
        console.error("❌ Unknown error updating ObjectType status:", error);
        return { error: true, message: "An unknown error occurred", details: error };
    }
}

export async function updateObjectTypeVisibility(projectId: string, objectTypeIds: string[], visibility: string) {
    try {
        const response = await pactum.spec()
            .put(`${BASE_URL}/updateVisibility`)
            .withHeaders({
                'Content-Type': 'application/json-patch+json',
                'ProjectId': projectId
            })
            .withJson({
                ids: objectTypeIds,
                visibility: visibility
            })
            .toss();

        console.log(`✅ Updated visibility for ObjectType(s): ${objectTypeIds.join(', ')}`);
        return response;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("❌ Error updating ObjectType visibility:", error.message);
            return { error: true, message: error.message, details: error };
        }
        console.error("❌ Unknown error updating ObjectType visibility:", error);
        return { error: true, message: "An unknown error occurred", details: error };
    }
}