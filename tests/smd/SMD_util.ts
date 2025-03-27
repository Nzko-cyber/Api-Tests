import {spec} from 'pactum';
import {PostSemanticModelRequest, PutSemanticModelRequest} from './interfaces';

const baseUrl = 'https://phoenix-dev.datamicron.com/api/smd/api';


export async function getSemanticModelsWithPagination(
    pageNumber: number,
    pageSize: number,
    searchTerm: string,
    orderType: string,
    orderBy: string,
    projectId: string
) {
    try {
        const response = await spec()
            .get(`${baseUrl}/api/smd/api/SemanticModel/getWithPagination`)
            .withHeaders({
                "Content-Type": "application/json",
                "ProjectId": projectId
            })
            .withQueryParams({
                PageNumber: pageNumber,
                PageSize: pageSize,
                SearchTerm: searchTerm,
                OrderType: orderType,
                OrderBy: orderBy
            })
            .toss();

        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}


export async function getSemanticModel(id: string, projectId: string) {
    try {
        const response = await spec()
            .get(`${baseUrl}/SemanticModel`)
            .withQueryParams('id', id)
            .withHeaders('ProjectId', projectId)
            .toss();
        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}


export async function postSemanticModel(postData: PostSemanticModelRequest) {
    try {
        const response = await spec()
            .post(`${baseUrl}/SemanticModel`)
            .withHeaders({
                'Content-Type': 'application/json',
                'ProjectId': postData.projectId
            })
            .withJson({
                ...postData,
                description: "",
                imageUrl: postData.imageUrl || "",
                objectTypes: postData.objectTypes || [],
                layouts: [],
            })
            .toss();

        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}


export async function deleteSemanticModel(id: string, projectId: string) {
    try {
        const response = await spec()
            .delete(`${baseUrl}/SemanticModel`)
            .withQueryParams('id', id)
            .withHeaders({
                'ProjectId': projectId,
                'Content-Type': 'application/json',
            })
            .toss();

        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}


export async function updateSemanticModel(data: PutSemanticModelRequest) {
    try {
        const response = await spec()
            .put(`${baseUrl}/SemanticModel`)
            .withHeaders({
                'ProjectId': data.projectId,
                'Content-Type': 'application/json',
            })
            .withJson(data)
            .toss();
        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}


export async function getObjectType(id: string, projectId: string) {
    try {
        const response = await spec()
            .get(`${baseUrl}/ObjectType`)
            .withQueryParams('Id', id)
            .withHeaders('ProjectId', projectId)
            .toss();
        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}

export async function getObjectTypesWithPagination(
    projectId?: string,
    statuses?: string[],
    visibilities?: string[],
    groupIds?: string[],
    pageNumber: number = 1,
    pageSize: number = 20,
    searchTerm?: string
) {
    try {
        const request = spec().get(`${baseUrl}/ObjectType/getWithPagination`);

        if (projectId) request.withHeaders("ProjectId", projectId);
        if (statuses) request.withQueryParams("Statuses", statuses);
        if (visibilities) request.withQueryParams("Visibilities", visibilities);
        if (groupIds) request.withQueryParams("GroupIds", groupIds);
        if (searchTerm) request.withQueryParams("SearchTerm", searchTerm);

        request.withQueryParams("PageNumber", pageNumber);
        request.withQueryParams("PageSize", pageSize);

        const response = await request.toss();
        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}


export async function getObjectTypeGraph(groupId: string, unrecognized: boolean, projectId: string) {
    try {
        const response = await spec()
            .get(`${baseUrl}/ObjectType/getGraph`)
            .withHeaders({
                "Content-Type": "application/json",
                "ProjectId": projectId
            })
            .withQueryParams({
                groupId,
                unrecognized
            })
            .toss();

        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}

export async function getGraphByObjectType(objectTypeId: string, projectId: string) {
    try {
        const response = await spec()
            .get(`${baseUrl}/ObjectType/getGraphByObjectType`)
            .withHeaders({
                "Content-Type": "application/json",
                "ProjectId": projectId
            })
            .withQueryParams({
                objectTypeId
            })
            .toss();

        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}

export async function getObjectTypesByGroup(groupId: string, projectId: string) {
    try {
        const response = await spec()
            .get(`${baseUrl}/ObjectType/getByGroup`)
            .withHeaders({
                "Content-Type": "application/json",
                "ProjectId": projectId
            })
            .withQueryParams({
                groupId
            })
            .toss();

        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}

export async function getGraphBySemanticModel(semanticModelId: string, projectId: string) {
    try {
        const response = await spec()
            .get(`${baseUrl}/ObjectType/getGraphBySemanticModel`)
            .withHeaders({
                "Content-Type": "application/json",
                "ProjectId": projectId
            })
            .withQueryParams({
                semanticModelId
            })
            .toss();

        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}

export async function getJoinObjectTypesBySemanticModel(
    semanticModelId: string,
    objectTypeId: string,
    includeCurrent: boolean,
    projectId: string
) {
    try {
        const response = await spec()
            .get(`${baseUrl}/ObjectType/getJoinObjectTypesBySemanticModel`)
            .withHeaders({
                "Content-Type": "application/json",
                "ProjectId": projectId
            })
            .withQueryParams({
                semanticModelId,
                objectTypeId,
                includeCurrent
            })
            .toss();

        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}

export async function getObjectTypePreview(
    id: string,
    elementsCount: any,
    projectId: string
) {
    try {
        const response = await spec()
            .get(`${baseUrl}/ObjectType/preview`)
            .withHeaders({
                "Content-Type": "application/json",
                "ProjectId": projectId
            })
            .withQueryParams({
                id,
                elementsCount
            })
            .toss();

        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}

export async function getObjectTypeGroup(id: string, projectId: string) {
    try {
        const response = await spec()
            .get(`${baseUrl}/ObjectTypeGroup`)
            .withHeaders({
                "Content-Type": "application/json",
                "ProjectId": projectId
            })
            .withQueryParams({Id: id})
            .toss();

        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}

export async function getObjectTypeGroupsWithPagination(
    pageNumber: number,
    pageSize: number,
    searchTerm: string,
    projectId: string
) {
    try {
        const response = await spec()
            .get(`${baseUrl}/ObjectTypeGroup/getWithPagination`)
            .withHeaders({
                "Content-Type": "application/json",
                "ProjectId": projectId
            })
            .withQueryParams({
                PageNumber: pageNumber,
                PageSize: pageSize,
                SearchTerm: searchTerm,
            })
            .toss();

        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}

//   export async function createSemanticModelByGroup(
//     name: string,
//     folderId: string,
//     description: string,
//     imageUrl: string,
//     groupId: string,
//     factObjectTypeId: string,
//     projectId: string
//   ) {
//     try {
//       const response = await spec()
//         .post(`${baseUrl}/api/smd/api/SemanticModel/CreateByGroup`)
//         .withHeaders({
//           "Content-Type": "application/json",
//           "ProjectId": projectId
//         })
//         .withJson({
//           name,
//           folderId,
//           description,
//           imageUrl,
//           groupId,
//           factObjectTypeId
//         })
//         .toss();

//       return response;
//     } catch (error) {
//       return { error: true, message: error.message, details: error };
//     }
//   }

export async function getSemanticModelsByObjectTypeGroup(
    groupId: string,
    projectId: string
) {
    try {
        const response = await spec()
            .get(`${baseUrl}/SemanticModel/getByObjectTypeGroup`)
            .withHeaders({
                "Content-Type": "application/json",
                "ProjectId": projectId
            })
            .withQueryParams("GroupId", groupId)
            .toss();

        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}


//   export async function getSemanticDefinition(
//     semanticModelId: string,
//     projectId: string
//   ) {
//     try {
//       const response = await spec()
//         .get(`${baseUrl}/api/smd/api/SemanticModel/getSemanticDefinition`)
//         .withHeaders({
//           "Content-Type": "application/json",
//           "ProjectId": projectId
//         })
//         .withQueryParams("SemanticModelId", semanticModelId)
//         .toss();

//       return response;
//     } catch (error) {
//       return { error: true, message: error.message, details: error };
//     }
//   }

export async function getSemanticModelLinkedObjectTypes(
    id: string,
    objectTypeId: string,
    projectId: string
) {
    try {
        const response = await spec()
            .get(`${baseUrl}/SemanticModel/getSemanticModelLinkedObjectTypes`)
            .withHeaders({
                "Content-Type": "application/json",
                "ProjectId": projectId
            })
            .withQueryParams("Id", id)
            .withQueryParams("ObjectTypeId", objectTypeId)
            .toss();

        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}

export async function getUnrecognizedGroup(projectId: string) {
    try {
        const response = await spec()
            .get(`${baseUrl}/api/smd/api/SemanticModel/getUnrecognizedGroup`)
            .withHeaders({
                "Content-Type": "application/json",
                "ProjectId": projectId
            })
            .toss();

        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}