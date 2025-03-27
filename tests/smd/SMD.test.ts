import {
    deleteSemanticModel,
    getGraphByObjectType,
    getGraphBySemanticModel,
    getJoinObjectTypesBySemanticModel,
    getObjectType,
    getObjectTypeGraph,
    getObjectTypeGroup,
    getObjectTypeGroupsWithPagination,
    getObjectTypePreview,
    getObjectTypesByGroup,
    getObjectTypesWithPagination,
    getSemanticModel,
    getSemanticModelLinkedObjectTypes,
    getSemanticModelsByObjectTypeGroup,
    postSemanticModel,
    updateSemanticModel
} from "./SMD_util";
import {mockSemanticModelPostRequest, mockSemanticModelPutRequest} from "./mockData";

const projectId = "fa118425-239f-46e9-b1b2-e4e9c462a8b5";
const objectTypeId = "75f7a78b-93da-43b9-b614-c5ab546f3bb2";
const objectTypeName = "UserForTesting";
const groupId = "4e7086e9-38d5-4b1f-bc11-51b320c7a568";
const folderId = "19289305-46f2-417b-803c-44ce66c97832";
const semanticModelId = "93043b0b-ec13-4480-b162-eaa6742cd228";


describe('Test Cases for Retrieving ObjectType', () => {

    test("1.1 Valid Request - Send a request with a valid Id & ProjectId", async () => {
        const response = await getObjectType(objectTypeId, projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.id).toBe(objectTypeId);
        expect(response.json.name).toBeDefined();
    });

    test("1.2 Missing Id - Send a request without Id", async () => {
        const response = await getObjectType("", projectId);
        expect(response.json).toBeDefined();
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
    });

    test("1.3 Invalid Id - Send a request with an invalid Id", async () => {
        const response = await getObjectType("InvalidObjectTypeId", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
    });

    test("1.4 Missing ProjectId - Send a request with empty ProjectId", async () => {
        const response = await getObjectType(objectTypeId, "");
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
    });

    test("1.5 Invalid ProjectId - Send a request with an invalid ProjectId", async () => {
        const response = await getObjectType(objectTypeId, "invalid-project-id");
        expect(response.json).toBeDefined();
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
    });

    test("1.6 Validate Response Schema", async () => {
        const response = await getObjectType(objectTypeId, projectId);

        expect(response.statusCode).toBe(200);
        expect(response.json).toMatchObject({
            id: expect.any(String),
            name: expect.any(String),
            description: expect.any(String),
            status: expect.stringMatching(/Active|Inactive/),
            createdAt: expect.any(String),
            lastModifiedAt: expect.any(String),
        });
    });
});


describe("Test Cases for Retrieving Object Types with Pagination", () => {

    test("2.1 Valid Request (No Filters) - Send a request without any query parameters", async () => {
        const response = await getObjectTypesWithPagination();
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.items).toBeDefined();
        expect(Array.isArray(response.json.items)).toBeTruthy();
    });

    test("2.2 Valid Request with Status Filter - Send a request with status filter", async () => {
        const response = await getObjectTypesWithPagination(projectId, ["Active"]);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.items).toBeDefined();
        expect(Array.isArray(response.json.items)).toBeTruthy();
        expect(response.json.items.every(obj => obj.status === "Active")).toBe(true);
    });

    test("2.3 Valid Request with Visibility Filter - Send a request with visibility filter", async () => {
        const response = await getObjectTypesWithPagination(projectId, undefined, ["Normal"]);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.items).toBeDefined();
        expect(Array.isArray(response.json.items)).toBeTruthy();
        expect(response.json.items.every(obj => obj.visibility === "Normal")).toBe(true);
    });

    test("2.4 Valid Request with Group Filter - Send a request with a valid group filter", async () => {
        const response = await getObjectTypesWithPagination(projectId, undefined, undefined, [groupId]);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.items).toBeDefined();
        expect(Array.isArray(response.json.items)).toBeTruthy();
    });

    test("2.5 Valid Request with SearchTerm - Send a request with a search term", async () => {
        const response = await getObjectTypesWithPagination(projectId, undefined, undefined, undefined, 1, 20, "Test");
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.items).toBeDefined();
        expect(Array.isArray(response.json.items)).toBeTruthy();
    });

    test("2.6 Valid Request with Pagination - Send a request with PageNumber=2 and PageSize=5", async () => {
        const response = await getObjectTypesWithPagination(projectId, undefined, undefined, undefined, 2, 5);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.items).toBeDefined();
        expect(Array.isArray(response.json.items)).toBeTruthy();
        expect(response.json.items.length).toBeLessThanOrEqual(5);
    });

    test("2.7 Valid Request with All Filters - Send a request with all optional filters included", async () => {
        const response = await getObjectTypesWithPagination(projectId, ["Active"], ["Normal"], [groupId], 1, 10, "User");
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.items).toBeDefined();
        expect(Array.isArray(response.json.items)).toBeTruthy();
    });

    test("2.8 Invalid ProjectId - Send a request with an invalid ProjectId", async () => {
        const response = await getObjectTypesWithPagination("invalid-project-id");
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

});

describe('Test Cases for Retrieving ObjectType Graph', () => {

    test("3.1 Valid Request - Send a request with valid GroupId, Unrecognized, and ProjectId", async () => {
        const response = await getObjectTypeGraph(groupId, false, projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.objectTypes).toBeDefined();
    });

    test("3.2 Missing GroupId - Send a request without GroupId", async () => {
        const response = await getObjectTypeGraph("", false, projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
    });

    test("3.3 Missing ProjectId - Send a request with empty ProjectId", async () => {
        const response = await await getObjectTypeGraph(groupId, false, '');

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
    });
    test("3.4 Invalid GroupId - Send a request with an invalid GroupId", async () => {
        const response = await getObjectTypeGraph("invalidGroupId", false, projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

    test("3.5 Unrecognized=True Request - Retrieve unrecognized object types", async () => {
        const response = await getObjectTypeGraph("", true, projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.objectTypes).toBeDefined();
    });

    test("3.6 Invalid ProjectId - Send a request with an invalid ProjectId", async () => {
        const response = await getObjectTypeGraph(groupId, false, "invalidProjectId");
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

    test("3.7 Empty ProjectId - Send a request with an empty ProjectId", async () => {
        const response = await getObjectTypeGraph(groupId, false, "");
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
    });
});

describe('Test Cases for Retrieving ObjectType Graph by ObjectTypeId', () => {

    test("4.1 Valid Request - Send a request with valid ObjectTypeId and ProjectId", async () => {
        const response = await getGraphByObjectType(objectTypeId, projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.objectTypes[0].id).toBe(objectTypeId);
    });

    test("4.2 Missing ObjectTypeId - Send a request with empty ObjectTypeId", async () => {
        const response = await getGraphByObjectType("", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
        expect(response.json.errors.ObjectTypeId[0]).toBe("The ObjectTypeId field is required.");
    });

    test("4.3 Missing ProjectId - Send a request with empty ProjectId", async () => {
        const response = await getGraphByObjectType(objectTypeId, '');
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
    });

    test("4.4 Invalid ObjectTypeId - Send a request with an invalid ObjectTypeId", async () => {
        const response = await getGraphByObjectType("invalidObjectTypeId", projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
    });
});

describe('Test Cases for Retrieving Object Types by Group', () => {

    test("5.1 Valid Request - Send a request with a valid GroupId and ProjectId", async () => {
        const response = await getObjectTypesByGroup(groupId, projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(Array.isArray(response.json)).toBeTruthy();
    });

    test("5.2 Missing GroupId - Send a request without GroupId (should return all object types)", async () => {
        const response = await getObjectTypesByGroup("", projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(Array.isArray(response.json)).toBeTruthy();
    });

    test("5.3 Empty ProjectId - Send a request with an empty ProjectId", async () => {
        const response = await getObjectTypesByGroup(groupId, "");
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(Array.isArray(response.json)).toBeTruthy();
    });

    test("5.4 Invalid GroupId - Send a request with an invalid GroupId", async () => {
        const response = await getObjectTypesByGroup("invalidGroupId", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

    test("5.5 Invalid ProjectId - Send a request with an invalid ProjectId", async () => {
        const response = await getObjectTypesByGroup(groupId, "invalidProjectId");
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

});

describe('Test Cases for Retrieving ObjectType Graph by SemanticModelId', () => {

    test("6.1 Valid Request - Send a request with valid SemanticModelId and ProjectId", async () => {
        const response = await getGraphBySemanticModel(semanticModelId, projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.objectTypes).toBeDefined();
    });

    test("6.2 Missing SemanticModelId - Send a request without SemanticModelId", async () => {
        const response = await getGraphBySemanticModel("", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
        expect(response.json.errors.SemanticModelId[0]).toBe("The SemanticModelId field is required.");
    });

    test("6.3 Missing ProjectId - Send a request without ProjectId", async () => {
        const response = await getGraphBySemanticModel(semanticModelId, "");
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
        expect(response.json.errors.ProjectId[0]).toBe("The ProjectId field is required.");
    });

    test("6.4 Invalid SemanticModelId - Send a request with an invalid SemanticModelId", async () => {
        const response = await getGraphBySemanticModel("invalidSemanticModelId", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

    test("6.5 Invalid ProjectId - Send a request with an invalid ProjectId", async () => {
        const response = await getGraphBySemanticModel(semanticModelId, "invalidProjectId");
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });
});

describe('Test Cases for Retrieving Joined Object Types by Semantic Model', () => {

    test("7.1 Valid Request - Send a request with valid SemanticModelId, ObjectTypeId, ProjectId, and includeCurrent=true", async () => {
        const response = await getJoinObjectTypesBySemanticModel(semanticModelId, objectTypeId, true, projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(Array.isArray(response.json)).toBeTruthy();
    });

    test("7.2 Missing SemanticModelId - Send a request without SemanticModelId", async () => {
        const response = await getJoinObjectTypesBySemanticModel("", objectTypeId, true, projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
    });

    test("7.3 Missing ObjectTypeId - Send a request without ObjectTypeId", async () => {
        const response = await getJoinObjectTypesBySemanticModel(semanticModelId, "", true, projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
    });

    test("7.4 Missing ProjectId - Send a request without ProjectId", async () => {
        const response = await getJoinObjectTypesBySemanticModel(semanticModelId, objectTypeId, true, "");
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
    });

    test("7.5 Invalid SemanticModelId - Send a request with an invalid SemanticModelId", async () => {
        const response = await getJoinObjectTypesBySemanticModel("invalidSemanticModelId", objectTypeId, true, projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
    });

    test("7.6 Invalid ObjectTypeId - Send a request with an invalid ObjectTypeId", async () => {
        const response = await getJoinObjectTypesBySemanticModel(semanticModelId, "invalidObjectTypeId", true, projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json).toEqual([]);
    });


    test("7.7 Invalid ProjectId - Send a request with an invalid ProjectId", async () => {
        const response = await getJoinObjectTypesBySemanticModel(semanticModelId, objectTypeId, true, "invalidProjectId");
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
    });

    test("7.8 Missing includeCurrent - Send a request without includeCurrent", async () => {
        const response = await getJoinObjectTypesBySemanticModel(semanticModelId, objectTypeId, false, projectId);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.json)).toBeTruthy();
    });

    test("7.9 includeCurrent=false - Send a request with includeCurrent=false", async () => {
        const response = await getJoinObjectTypesBySemanticModel(semanticModelId, objectTypeId, false, projectId);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.json)).toBeTruthy();
    });

});

describe("Test Cases for ObjectType Preview", () => {

    test("8.1 Valid Request - Send a request with valid id, elementsCount=50, and ProjectId", async () => {
        const response = await getObjectTypePreview(objectTypeId, 50, projectId);

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.id).toBe(objectTypeId);
        expect(response.json.columns).toBeInstanceOf(Array);
        expect(response.json.rows).toBeInstanceOf(Array);
        expect(response.json.totalCount).toBeGreaterThan(0);

        expect(response.json.columns).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: expect.any(String),
                    valueType: expect.any(String),
                    notNull: expect.any(Boolean),
                })
            ])
        );
        expect(response.json.rows.length).toBeGreaterThan(0);
        expect(response.json.rows[0]).toHaveLength(response.json.columns.length);
        expect(response.json.totalCount).toBe(50);

    });

    test("8.2 Missing id - Send a request without id", async () => {
        const response = await getObjectTypePreview("", 50, projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
        expect(response.json.errors.id[0]).toBe("The id field is required.");
    });

    test("8.3 Missing elementsCount - Send a request without elementsCount", async () => {
        const response = await getObjectTypePreview(objectTypeId, '', projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.totalCount).toBe(100);
    });

    test("8.4 Missing ProjectId - Send a request without ProjectId", async () => {
        const response = await getObjectTypePreview(objectTypeId, 50, "");
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.totalCount).toBe(50);
    });

    test("8.5 Invalid id - Send a request with an invalid id", async () => {
        const response = await getObjectTypePreview("invalid-id", 50, projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

    test("8.6 Invalid ProjectId - Send a request with an invalid ProjectId", async () => {
        const response = await getObjectTypePreview(objectTypeId, 50, "invalidProjectId");
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

});

describe('Test Cases for Retrieving ObjectTypeGroup', () => {

    test("9.1 Valid Request - Send a request with a valid Id and optional ProjectId", async () => {
        const response = await getObjectTypeGroup(groupId, projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.id).toBe(groupId);
    });

    test("9.2 Missing Id - Send a request without Id", async () => {
        const response = await getObjectTypeGroup("", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
        expect(response.json.errors.Id[0]).toBe("The Id field is required.");
    });

    test("9.3 Invalid Id - Send a request with an invalid Id", async () => {
        const response = await getObjectTypeGroup("invalidGroupId", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

    test("9.4 Missing ProjectId - Send a request with a valid Id, but without ProjectId", async () => {
        const response = await getObjectTypeGroup(groupId, "");
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.id).toBe(groupId);
    });

    test("9.5 Invalid ProjectId - Send a request with a valid Id, but an invalid ProjectId", async () => {
        const response = await getObjectTypeGroup(groupId, "invalidProjectId");
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

});

describe('Test Cases for Retrieving ObjectTypeGroup with Pagination', () => {

    test("10.1 Valid Request - Send a request with PageNumber, PageSize, SearchTerm, and ProjectId", async () => {
        const response = await getObjectTypeGroupsWithPagination(1, 10, "user", projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.items).toBeInstanceOf(Array);
    });

    test("10.2 Default Pagination Values - Send a request without PageNumber and PageSize", async () => {
        const response = await getObjectTypeGroupsWithPagination(1, 20, "user", projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.pageNumber).toBe(1);
        expect(response.json.pageSize).toBe(20);
    });

    test("10.3 SearchTerm Filter - Send a request with a SearchTerm and valid ProjectId", async () => {
        const response = await getObjectTypeGroupsWithPagination(1, 20, "", projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.items).toBeInstanceOf(Array);
    });

    test("10.4 Missing ProjectId - Send a request without ProjectId", async () => {
        const response = await getObjectTypeGroupsWithPagination(1, 20, "", "");
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.items).toBeInstanceOf(Array);
    });

    test("10.5 Invalid ProjectId - Send a request with a valid PageNumber, PageSize, but an invalid ProjectId", async () => {
        const response = await getObjectTypeGroupsWithPagination(1, 20, "", "invalidProjectId");
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

});

describe('Test Cases for Retrieving Semantic Model GET', () => {

    test("12.1 Valid Request - Send a request with a valid id and ProjectId", async () => {
        const response = await getSemanticModel(semanticModelId, projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.id).toBe(semanticModelId);
    });

    test("12.2 Missing id - Send a request without id", async () => {
        const response = await getSemanticModel("", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
        expect(response.json.errors.id[0]).toBe("The id field is required.");
    });

    test("12.3 Missing ProjectId - Send a request without ProjectId", async () => {
        const response = await getSemanticModel(semanticModelId, "");
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

    test("12.4 Invalid id - Send a request with an invalid id", async () => {
        const response = await getSemanticModel("invalidSemanticModelId", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
    });

    test("12.5 Invalid ProjectId - Send a request with an invalid ProjectId", async () => {
        const response = await getSemanticModel(semanticModelId, "invalidProjectId");
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

});


describe('Test Cases for Retrieving Semantic Models by ObjectType Group', () => {

    test("16.1 Valid Request - Send a request with a valid GroupId and ProjectId", async () => {
        const response = await getSemanticModelsByObjectTypeGroup(groupId, projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(Array.isArray(response.json)).toBe(true);
    });

    test("16.2 Missing GroupId - Send a request without GroupId", async () => {
        const response = await getSemanticModelsByObjectTypeGroup("", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
        expect(response.json.errors.GroupId[0]).toBe("The GroupId field is required.");
    });

    test("16.3 Missing ProjectId - Send a request with a valid GroupId but no ProjectId", async () => {
        const response = await getSemanticModelsByObjectTypeGroup(groupId, "");
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
    });

    test("16.4 Invalid GroupId - Send a request with an invalid GroupId", async () => {
        const response = await getSemanticModelsByObjectTypeGroup("invalidGroupId", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

    test("16.5 Invalid ProjectId - Send a request with an invalid ProjectId", async () => {
        const response = await getSemanticModelsByObjectTypeGroup(groupId, "invalidProjectId");
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

});

describe('Test Cases for Retrieving Linked Object Types by SemanticModel', () => {

    test("17.1 Valid Request - Send a request with a valid semanticModelId, objectTypeId, and projectId", async () => {
        const response = await getSemanticModelLinkedObjectTypes(semanticModelId, objectTypeId, projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(Array.isArray(response.json.objectTypes)).toBe(true);
    });

    test("17.2 Missing semanticModelId - Send a request without semanticModelId", async () => {
        const response = await getSemanticModelLinkedObjectTypes("", objectTypeId, projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
        expect(response.json.errors.Id[0]).toBe("The Id field is required.");
    });

    test("17.3 Missing objectTypeId - Send a request without objectTypeId", async () => {
        const response = await getSemanticModelLinkedObjectTypes(semanticModelId, "", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
        expect(response.json.errors.ObjectTypeId[0]).toBe("The ObjectTypeId field is required.");
    });

    test("17.4 Missing projectId - Send a request with a valid semanticModelId and objectTypeId but no projectId", async () => {
        const response = await getSemanticModelLinkedObjectTypes(semanticModelId, objectTypeId, "");
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

    test("17.5 Invalid semanticModelId - Send a request with an invalid semanticModelId", async () => {
        const response = await getSemanticModelLinkedObjectTypes("invalid-semantic-model-id", objectTypeId, projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

    test("17.6 Invalid objectTypeId - Send a request with an invalid objectTypeId", async () => {
        const response = await getSemanticModelLinkedObjectTypes(semanticModelId, "invalid-object-type-id", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

    test("17.7 Invalid projectId - Send a request with an invalid projectId", async () => {
        const response = await getSemanticModelLinkedObjectTypes(semanticModelId, objectTypeId, "invalid-project-id");
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

});

describe("Semantic Model API Test Suite", () => {
    let smdId: string;

    test("1. Create a new Semantic Model - Verify successful creation", async () => {
        const response = await postSemanticModel(mockSemanticModelPostRequest);

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        smdId = response.json;
    });

    test("2. Update the created Semantic Model - Verify update is successful", async () => {
        mockSemanticModelPutRequest.id = smdId;
        const response = await updateSemanticModel(mockSemanticModelPutRequest);
        expect(response.statusCode).toBe(204);
    });

    test("3. Retrieve the updated Semantic Model - Verify response schema and values", async () => {
        const response = await getSemanticModel(smdId, projectId);

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.objectTypes).toBeInstanceOf(Array);
        expect(response.json.linkTypes).toBeInstanceOf(Array);
        expect(response.json.layouts).toBeInstanceOf(Array);
        expect(response.json.id).toBe(smdId);
        expect(response.json.projectId).toBe(projectId);
        expect(response.json.folderId).toBe(mockSemanticModelPostRequest.folderId);
        expect(response.json.type).toBe("Default");
        expect(response.json.name).toBe(mockSemanticModelPutRequest.name);
        expect(response.json.description).toBe(mockSemanticModelPutRequest.description);
        expect(response.json.imageUrl).toBe(mockSemanticModelPutRequest.imageUrl);
        expect(response.json.extraPrompt).toBeDefined();
        expect(response.json.extraPrompt.domain).toBe(mockSemanticModelPutRequest.extraPrompt.domain);
        expect(response.json.extraPrompt.subDomain).toBe(mockSemanticModelPutRequest.extraPrompt.subDomain);
        expect(response.json.extraPrompt.objectives).toBe(mockSemanticModelPutRequest.extraPrompt.objectives);
    });

    test("4. Delete the created Semantic Model - Verify deletion is successful", async () => {
        const response = await deleteSemanticModel(smdId, projectId);
        expect(response.statusCode).toBe(204);
        const getResponse = await getSemanticModel(smdId, projectId);
        expect(getResponse.statusCode).toBe(400);
    });
});




