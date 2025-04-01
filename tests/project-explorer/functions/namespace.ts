import pactum from "pactum";
import "../../../pactum.config";

let baseURL: string = "/project-explorer/api/Namespace";

async function getNamespaceWithPagination(
    PageNumber: number | null = null,
    PageSize: number | null = null,
    SearchTerm: string | null = null,
    OrderType: string | null = null,
    OrderBy: string | null = null,
    invalidKey: boolean = false,
    customParams: Record<string, any> = {},
) {
    try {
        let queryJson: any = {};

        const paramKeys = invalidKey
            ? { PageSize: "pageSi" }
            : { PageSize: "PageSize" };

        if (PageNumber !== null && PageNumber !== undefined)
            queryJson.PageNumber = PageNumber;
        if (PageSize !== null && PageSize !== undefined)
            queryJson[paramKeys.PageSize] = PageSize;
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

async function createNamespace(
    name: string | null = null,
    description: string | null = null,
    customParams: Record<string, any> = {},
) {
    try {
        let bodyJson: any = {};
        if (name !== null) bodyJson.Name = name;
        if (description !== null) bodyJson.Description = description;

        // Add any custom parameters for more flexible testing
        Object.assign(bodyJson, customParams);

        let spec = pactum.spec().post(`${baseURL}`).withJson(bodyJson);

        return await spec.toss();
    } catch (error) {
        return {
            error: true,
            message: (error as Error).message,
            details: error,
        };
    }
}

async function getNamespace(id: string | null = null) {
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

async function updateNamespace(
    id?: string | null,
    name?: string | null,
    description?: string | null,
    customParams: Record<string, any> = {},
) {
    try {
        let bodyJson: any = {};
        if (id !== null) bodyJson.id = id;
        if (name !== null) bodyJson.Name = name;
        if (description !== null) bodyJson.Description = description;

        Object.assign(bodyJson, customParams);

        let spec = pactum.spec().put(`${baseURL}/${id}`).withJson(bodyJson);

        return await spec.toss();
    } catch (error: any) {
        return {
            error: true,
            message: (error as Error).message,
            details: error,
        };
    }
}

async function deleteNamespace(id: string | null = null) {
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
    getNamespaceWithPagination,
    createNamespace,
    getNamespace,
    updateNamespace,
    deleteNamespace,
};
