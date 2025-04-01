import pactum from "pactum";

const BASE_URL =
    "https://phoenix-dev.datamicron.com/api/project-explorer/api/Resource/";

export async function searchResources(queryParams: any, projectId: string) {
    try {
        const response = await pactum
            .spec()
            .get(`${BASE_URL}/search`)
            .withHeaders({
                Accept: "text/plain",
                ProjectId: projectId,
            })
            .withQueryParams(queryParams)
            .toss();

        console.log(`✅ Search API Response:`, response.body);
        return response;
    } catch (error) {
        console.error("❌ Error calling Search API:", error);
        return {
            error: true,
            message: (error as Error).message,
            details: error,
        };
    }
}

export async function getChangesLastWeek(queryParams: any, projectId: string) {
    try {
        const response = await pactum
            .spec()
            .get(`${BASE_URL}/getChangesLastWeekWithPagination`)
            .withHeaders({
                Accept: "text/plain",
                ProjectId: projectId,
            })
            .withQueryParams(queryParams)
            .toss();

        console.log(`✅ API Response:`, response.body);
        return response;
    } catch (error) {
        console.error("❌ Error calling API:", error);
        return {
            error: true,
            message: (error as Error).message,
            details: error,
        };
    }
}

/**
 * Получает информацию об использовании ресурса по его ID.
 *
 * @param {string} resourceId - ID ресурса.
 * @param {string} projectId - ID проекта.
 * @returns {Promise<any>} - Ответ API.
 */
export async function getResourceUsages(
    resourceId: string,
    projectId: string,
): Promise<any> {
    try {
        const response = await pactum
            .spec()
            .get(`${BASE_URL}/getUsages`)
            .withQueryParams({ id: resourceId })
            .withHeaders({ ProjectId: projectId })
            .toss();

        console.log(
            `✅ Resource usages fetched successfully for ID: ${resourceId}`,
        );
        return response;
    } catch (error) {
        console.error("❌ Error fetching resource usages:", error);
        return {
            error: true,
            message: (error as Error).message,
            details: error,
        };
    }
}

export async function updateResourceName(
    projectId: string,
    resourceId: string,
    newName: string,
) {
    try {
        const response = await pactum
            .spec()
            .put(`${BASE_URL}/updateResourceName`)
            .withHeaders({
                ProjectId: projectId,
                "Content-Type": "application/json-patch+json",
            })
            .withJson({ id: resourceId, name: newName })
            .toss();

        console.log(`✅ Resource name updated successfully: ${newName}`);
        return response;
    } catch (error) {
        console.error("❌ Error updating resource name:", error);
        return {
            error: true,
            message: (error as Error).message,
            details: error,
        };
    }
}

async function getFolderId(resourceId: any, projectId: any) {
    const response = await pactum
        .spec()
        .get(`${BASE_URL}/search`)
        .withQueryParams({
            SearchResourceType: "Dataset",
            SearchTerm: resourceId,
        })
        .withHeaders({ ProjectId: projectId })
        .expectStatus(200)
        .returns("datasets.items[0].folderId");

    return response;
}

// Функция для обновления folderId
async function updateResourceFolderId(
    resourceId: any,
    projectId: any,
    folderId: string,
) {
    const newFolderId =
        folderId === "bcdcf852-4b50-4bd8-8ed8-b8c38a91dda7"
            ? "3ac540d6-5303-4dcc-8366-b21a8904ec20"
            : "bcdcf852-4b50-4bd8-8ed8-b8c38a91dda7";

    const response = await pactum
        .spec()
        .put(`${BASE_URL}/updateResourceFolderId`)
        .withHeaders({
            ProjectId: projectId,
            "Content-Type": "application/json-patch+json",
        })
        .withJson({ id: resourceId, folderId: newFolderId })
        .expectStatus(200);

    return newFolderId;
}
