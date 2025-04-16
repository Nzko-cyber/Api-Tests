import pactum from 'pactum';

const BASE_URL = "https://phoenix-dev.datamicron.com/api/ontology/api/ObjectType/";

export async function getObjectTypesWithPagination(queryParams: any, projectId: string) {
    try {
        const response = await pactum.spec()
            .get(`${BASE_URL}/getWithPagination`)
            .withHeaders({'ProjectId': projectId})
            .withQueryParams(queryParams)
            .toss();

        console.log(`✅ Retrieved ObjectTypes with Pagination`);
        return response;
    } catch (error) {
        console.error("❌ Error fetching paginated ObjectTypes:", error);
        return {error: true, message: (error as Error).message, details: error};
    }
}


export async function getObjectTypeGraph(projectId: string, groupId: string) {
    try {
        const response = await pactum.spec()
            .get(`${BASE_URL}/getGraph?GroupId=${groupId}`)
            .withHeaders({'ProjectId': projectId})
            .toss();

        console.log(`✅ Retrieved ObjectType Graph for GroupId: ${groupId}`);
        return response;
    } catch (error) {
        console.error("❌ Error fetching ObjectType Graph:", error);
        return {error: true, message: (error as Error).message, details: error};
    }
}

export async function getObjectTypesByGroup(projectId: string, groupId: string) {
    try {
        const response = await pactum.spec()
            .get(`${BASE_URL}/getByGroup?GroupId=${groupId}`)
            .withHeaders({'ProjectId': projectId})
            .toss();

        console.log(`✅ Retrieved ObjectTypes for GroupId: ${groupId}`);
        return response;
    } catch (error) {
        console.error("❌ Error fetching ObjectTypes:", error);
        return {error: true, message: (error as Error).message, details: error};
    }
}


export async function getObjectTypePreview(projectId: string, objectTypeId: string, elementsCount: number) {
    try {
        const response = await pactum.spec()
            .get(`${BASE_URL}/preview?id=${objectTypeId}&elementsCount=${elementsCount}`)
            .withHeaders({'ProjectId': projectId})
            .toss();

        console.log(`✅ Retrieved ObjectType Preview for ID: ${objectTypeId}`);
        return response;
    } catch (error) {
        console.error("❌ Error fetching ObjectType Preview:", error);
        return {error: true, message: (error as Error).message, details: error};
    }
}
