import pactum from "pactum";
import "../../../pactum.config";

let baseURL: string = "/project-explorer/api/ProjectExplorer";

async function getProjectExplorer(
    projectId: string | null = null,
    folderId: string | null = null,
    searchTerm: string | null = null,
) {
    try {
        let query: any = {};

        if (folderId !== null) {
            query.folderId = folderId;
        }

        if (searchTerm !== null) {
            query.searchTerm = searchTerm;
        }

        let spec = pactum.spec().get(`${baseURL}`);

        if (projectId !== null) {
            spec.withHeaders("projectId", projectId);
        }

        if (Object.keys(query).length > 0) {
            spec.withJson(query);
        }

        return await spec.toss();
    } catch (error) {
        return {
            error: true,
            message: (error as Error).message,
            details: error,
        };
    }
}

export { getProjectExplorer };
