import pactum from 'pactum';

import('../pactum.config');

let baseURL: string = '/ontology/api';

async function getDataSet(
    id: string | null = null,
    projectId: string | null = null,
) {
    try {
        const spec = pactum.spec().get(`${baseURL}/DataSet`);

        if (projectId !== null) spec.withHeaders('ProjectId', projectId);
        if (id !== null) spec.withQueryParams('id', id);

        const response = await spec.toss();

        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}

async function previewDataSet(
    id: string | null = null,
    projectId: string | null = null,
    count: number | null = null,
) {
    try {
        let queryBody: any = {};
        if (id !== null) queryBody.id = id;
        if (count !== null) queryBody.elementsCount = count;

        let spec: any = null;
        if (projectId !== null) {
            spec = pactum.spec().get(`${baseURL}/DataSet/preview`).withHeaders('ProjectId', projectId);
        } else {
            spec = pactum.spec().get(`${baseURL}/DataSet/preview`);
        }

        if (Object.keys(queryBody).length > 0) {
            spec.withQueryParams(queryBody);
        }

        const response = await spec.toss();

        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}

async function getOTGWithPagination(
    ProjectId: string | null = null,
    PageNumber: number | null = null,
    PageSize: number | null = null,
    SearchTerm: string | null = null,
    OrderType: string | null = null,
    OrderBy: string | null = null
) {
    try {
        let queryJson: any = {};

        if (PageNumber !== null && PageNumber !== undefined) queryJson.PageNumber = PageNumber;
        if (PageSize !== null && PageSize !== undefined) queryJson.PageSize = PageSize;
        if (SearchTerm !== null && SearchTerm !== undefined) queryJson.SearchTerm = SearchTerm;
        if (OrderType !== null && OrderType !== undefined) queryJson.OrderType = OrderType;
        if (OrderBy !== null && OrderBy !== undefined) queryJson.OrderBy = OrderBy;

        let spec = pactum.spec().get(`${baseURL}/ObjectTypeGroup/getWithPagination`).withHeaders('ProjectId', ProjectId);

        if (Object.keys(queryJson).length > 0) {
            spec.withQueryParams(queryJson);
        }

        const response = await spec.toss();

        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}

async function getOTGWithGraph(
    ProjectId: string | null = null,
    PageNumber: number | null = null,
    PageSize: number | null = null,
    SearchTerm: string | null = null,
    OrderType: string | null = null,
    OrderBy: string | null = null,
    NotEmpty: boolean | null = null
) {
    try {
        let queryJson: any = {};

        if (PageNumber !== null && PageNumber !== undefined) queryJson.PageNumber = PageNumber;
        if (PageSize !== null && PageSize !== undefined) queryJson.PageSize = PageSize;
        if (SearchTerm !== null && SearchTerm !== undefined) queryJson.SearchTerm = SearchTerm;
        if (OrderType !== null && OrderType !== undefined) queryJson.OrderType = OrderType;
        if (OrderBy !== null && OrderBy !== undefined) queryJson.OrderBy = OrderBy;
        if (NotEmpty !== null && NotEmpty !== undefined) queryJson.NotEmpty = NotEmpty;

        let spec: any = null;
        if (ProjectId !== null) spec = pactum.spec().get(`${baseURL}/ObjectTypeGroup/getWithGraphAndPagination`).withHeaders('ProjectId', ProjectId);
        else spec = pactum.spec().get(`${baseURL}/ObjectTypeGroup/getWithGraphAndPagination`);

        if (Object.keys(queryJson).length > 0) {
            spec.withQueryParams(queryJson);
        }

        const response = await spec.toss();

        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}

async function createObjectTypeGroup(
    ProjectId: string | null = null,
    Name: string | null = null,
    Description: string | null = null,
    ObjectTypeIds: string[] | null = null
) {
    try {
        let queryJson: any = {};

        if (Name !== null && Name !== undefined) queryJson.name = Name;
        if (Description !== null && Description !== undefined) queryJson.description = Description;

        let spec: any = null;
        if (Object.keys(queryJson).length === 0) {
            spec = pactum.spec().post(`${baseURL}/ObjectTypeGroup`).withHeaders('ProjectId', ProjectId);
        } else {
            let objectTypes: any[] = [];
            for (let i = 0; ObjectTypeIds !== null && i < ObjectTypeIds.length; i++) {
                objectTypes.push({objectTypeId: ObjectTypeIds[i]});
            }
            if (ObjectTypeIds !== null && ObjectTypeIds !== undefined) queryJson.objectTypes = objectTypes;
            spec = pactum.spec().post(`${baseURL}/ObjectTypeGroup`).withHeaders('ProjectId', ProjectId).withJson(queryJson);
        }

        const response = await spec.toss();

        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}

async function getObjectTypeGroup(
    ProjectId: string | null = null,
    Id: string | null = null
) {
    try {
        let queryJson: any = {};

        if (Id !== null && Id !== undefined) queryJson.id = Id;

        let spec: any = null;
        if (ProjectId !== null) spec = pactum.spec().get(`${baseURL}/ObjectTypeGroup`).withHeaders('ProjectId', ProjectId);
        else spec = pactum.spec().get(`${baseURL}/ObjectTypeGroup`);

        if (Object.keys(queryJson).length > 0) {
            spec.withQueryParams(queryJson);
        }

        const response = await spec.toss();

        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}

async function updateObjectTypeGroup(
    ProjectId: string | null = null,
    Id: string | null = null,
    Name: string | null = null,
    Description?: string[],
) {
    try {
        let queryJson: any = {};

        if (Id !== null && Id !== undefined) queryJson.id = Id;
        if (Name !== null && Name !== undefined) queryJson.name = Name;
        if (Description !== null && Description !== undefined) queryJson.description = Description;

        let spec: any = null;
        if (Object.keys(queryJson).length === 0) {
            spec = pactum.spec().put(`${baseURL}/ObjectTypeGroup`).withHeaders('ProjectId', ProjectId);
        } else {
            spec = pactum.spec().put(`${baseURL}/ObjectTypeGroup`).withHeaders('ProjectId', ProjectId).withJson(queryJson);
        }

        const response = await spec.toss();

        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}

async function deleteObjectTypeGroup(
    ProjectId: string | null = null,
    Id: string | null = null
) {
    try {
        let queryJson: any = {};

        if (Id !== null && Id !== undefined) queryJson.id = Id;

        let spec: any = null;
        if (ProjectId !== null) spec = pactum.spec().delete(`${baseURL}/ObjectTypeGroup`).withHeaders('ProjectId', ProjectId);
        else spec = pactum.spec().delete(`${baseURL}/ObjectTypeGroup`);

        if (Object.keys(queryJson).length > 0) {
            spec.withQueryParams(queryJson);
        }

        const response = await spec.toss();

        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}

async function getSearchOverview(
    ProjectId: string | null = null,
    SearchTerm: string | null = null
) {
    try {
        let queryJson: any = {};

        if (SearchTerm !== null && SearchTerm !== undefined) queryJson.SearchTerm = SearchTerm;

        let spec: any = null;
        if (ProjectId !== null) spec = pactum.spec().get(`${baseURL}/Discovery/SearchOverview`).withHeaders('ProjectId', ProjectId);
        else spec = pactum.spec().get(`${baseURL}/Discovery/SearchOverview`);

        if (Object.keys(queryJson).length > 0) {
            spec.withQueryParams(queryJson);
        }

        const response = await spec.toss();

        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}

async function getValueTypes(
    ProjectId: string | null = null,
    SearchTerm: string | null = null
) {
    try {
        let queryJson: any = {};

        if (SearchTerm !== null && SearchTerm !== undefined) queryJson.SearchTerm = SearchTerm;

        let spec: any = null;
        if (ProjectId !== null) spec = pactum.spec().get(`${baseURL}/Schema/getValueTypes`).withHeaders('ProjectId', ProjectId);
        else spec = pactum.spec().get(`${baseURL}/Schema/getValueTypes`);

        if (Object.keys(queryJson).length > 0) {
            spec.withQueryParams(queryJson);
        }

        const response = await spec.toss();

        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}

export {
    getDataSet,
    previewDataSet,
    getOTGWithPagination,
    getOTGWithGraph,
    createObjectTypeGroup,
    getObjectTypeGroup,
    updateObjectTypeGroup,
    deleteObjectTypeGroup,
    getSearchOverview,
    getValueTypes
};