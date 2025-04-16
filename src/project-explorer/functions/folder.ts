import pactum from "pactum";
import "../../../pactum.config";

let baseURL: string = "/project-explorer/api/Folder";

async function createFolder(
    Name: string | null = null,
    ProjectId: string | null = null,
    ParentId: string | null = null,
    customParams: Record<string, any> = {},
) {
    try {
        let bodyJson: any = {};

        if (Name !== null && Name !== undefined) bodyJson.Name = Name;
        if (ParentId !== null && ParentId !== undefined)
            bodyJson.ParentId = ParentId;

        // Add any custom parameters for more flexible testing
        Object.assign(bodyJson, customParams);

        let spec = pactum.spec().post(`${baseURL}`);
        if (ProjectId !== null) {
            spec.withHeaders("projectId", ProjectId);
        }
        if (Object.keys(bodyJson).length > 0) {
            spec.withJson(bodyJson);
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

async function getFolder(
    id: string | null = null,
    projectId: string | null = null,
) {
    try {
        let spec: import("pactum/src/models/Spec");
        spec = pactum.spec().get(`${baseURL}?id=${id}`);

        if (projectId !== null) {
            spec.withHeaders({ projectId: projectId });
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

async function updateFolder(
    id: any = null,
    name: any = null,
    projectId: any = null,
    parentId: any = null,
) {
    try {
        let bodyJson: any = {};

        if (id !== null) bodyJson.Id = id;
        if (name !== null) bodyJson.Name = name;
        if (parentId !== null) bodyJson.ParentId = parentId;

        let spec = pactum.spec().put(`${baseURL}`);
        if (projectId !== null) {
            spec.withHeaders("projectId", projectId);
        }
        if (Object.keys(bodyJson).length > 0) {
            spec.withJson(bodyJson);
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

async function updateFolderParentId(
    id: any = null,
    parentId: any = null,
    projectId: any = null,
) {
    try {
        let bodyJson: any = {};

        if (id !== null) bodyJson.Id = id;
        if (parentId !== null) bodyJson.ParentId = parentId;

        let spec = pactum.spec().put(`${baseURL}/updateFolderParentId`);
        if (projectId !== null) {
            spec.withHeaders("projectId", projectId);
        }
        if (Object.keys(bodyJson).length > 0) {
            spec.withJson(bodyJson);
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

async function updateFolderName(
    id: any = null,
    name: any = null,
    projectId: any = null,
) {
    try {
        let bodyJson: any = {};

        if (id !== null) bodyJson.Id = id;
        if (name !== null) bodyJson.Name = name;

        let spec = pactum.spec().put(`${baseURL}/updateFolderName`);
        if (projectId !== null) {
            spec.withHeaders("projectId", projectId);
        }
        if (Object.keys(bodyJson).length > 0) {
            spec.withJson(bodyJson);
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

async function deleteFolder(
    id: string | null = null,
    projectId: string | null = null,
) {
    try {
        let spec: import("pactum/src/models/Spec");
        spec = pactum.spec().delete(`${baseURL}?id=${id}`);

        if (projectId !== null) {
            spec.withHeaders({ projectId: projectId });
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

export {
    createFolder,
    getFolder,
    updateFolder,
    updateFolderParentId,
    updateFolderName,
    deleteFolder,
};
