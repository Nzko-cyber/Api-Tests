import pactum from "pactum";
import "../../../pactum.config";

let baseURL: string = "/project-explorer/api/Project";

async function getProjectWithPagination(
    NamespaceId: string | null = null,
    PageNumber: number | null = null,
    PageSize: number | null = null,
    SearchTerm: string | null = null,
    OrderType: string | null = null,
    OrderBy: string | null = null,
    customParams: Record<string, any> = {},
) {
    try {
        let queryJson: any = {};

        if (NamespaceId !== null && NamespaceId !== undefined)
            queryJson.NamespaceId = NamespaceId;
        if (PageNumber !== null && PageNumber !== undefined)
            queryJson.PageNumber = PageNumber;
        if (PageSize !== null && PageSize !== undefined)
            queryJson.PageSize = PageSize;
        if (SearchTerm !== null && SearchTerm !== undefined)
            queryJson.SearchTerm = SearchTerm;
        if (OrderType !== null && OrderType !== undefined)
            queryJson.OrderType = OrderType;
        if (OrderBy !== null && OrderBy !== undefined)
            queryJson.OrderBy = OrderBy;

        // Add any custom parameters for more flexible testing
        Object.assign(queryJson, customParams);

        let spec = pactum.spec().get(`${baseURL}/getWithPagination`);

        if (Object.keys(queryJson).length > 0) {
            spec.withQueryParams(queryJson);
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

async function createProject(
    Name: string | null = null,
    Description: string | null = null,
    NamespaceId: string | null = null,
) {
    try {
        let bodyJson: any = {};

        if (Name !== null && Name !== undefined) bodyJson.Name = Name;
        if (Description !== null && Description !== undefined)
            bodyJson.Description = Description;
        if (NamespaceId !== null && NamespaceId !== undefined)
            bodyJson.NamespaceId = NamespaceId;

        let spec = pactum.spec().post(`${baseURL}`);

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

async function getProject(id: string | null = null) {
    try {
        let spec: import("pactum/src/models/Spec");
        if (id === null) {
            spec = pactum.spec().get(`${baseURL}`);
        } else {
            spec = pactum.spec().get(`${baseURL}?id=${id}`);
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

async function updateProject(
    id: string | null = null,
    Name: string | null = null,
    Description: string | null = null,
    NamespaceId: string | null = null,
) {
    try {
        let bodyJson: any = {};

        if (Name !== null && Name !== undefined) bodyJson.Name = Name;
        if (Description !== null && Description !== undefined)
            bodyJson.Description = Description;
        if (NamespaceId !== null && NamespaceId !== undefined)
            bodyJson.NamespaceId = NamespaceId;

        let spec = pactum.spec().put(`${baseURL}/${id}`);

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

async function deleteProject(id: string | null = null) {
    try {
        let spec: import("pactum/src/models/Spec");
        if (id === null) {
            spec = pactum.spec().delete(`${baseURL}`);
        } else {
            spec = pactum.spec().delete(`${baseURL}/${id}`);
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
    getProjectWithPagination,
    createProject,
    getProject,
    updateProject,
    deleteProject,
};
