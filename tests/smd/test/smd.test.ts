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
} from "../functions/SMD_util";
import {mockSemanticModelPostRequest, mockSemanticModelPutRequest} from "../mockData";

const projectId = "fa118425-239f-46e9-b1b2-e4e9c462a8b5";
const objectTypeId = "75f7a78b-93da-43b9-b614-c5ab546f3bb2";
const objectTypeName = "UserForTesting";
const groupId = "4e7086e9-38d5-4b1f-bc11-51b320c7a568";
const folderId = "19289305-46f2-417b-803c-44ce66c97832";
const semanticModelId = "93043b0b-ec13-4480-b162-eaa6742cd228";

describe("API_BACKEND::SEMANTIC MODEL DESIGNER::Object Type", () => {

    describe('Test Cases for Retrieving ObjectType', () => {
  
      it("1.1 Valid Request - Send a request with a valid Id & ProjectId", async () => {
        allure.feature("ObjectType");
        allure.story("GET by ID");
        allure.description("Retrieve a single ObjectType by valid ID and ProjectID");
        allure.tag("positive", "critical");
        allure.label("component", "ObjectType");
  
        const response = await getObjectType(objectTypeId, projectId);
        allure.attachment("Response", JSON.stringify(response.json), "application/json");
        allure.parameter("objectTypeId", objectTypeId);
        allure.parameter("projectId", projectId);
  
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.id).toBe(objectTypeId);
      });
  
      it("1.2 Missing Id - Send a request without Id", async () => {
        allure.story("GET by ID - Missing ID");
        allure.parameter("projectId", projectId);
  
        const response = await getObjectType("", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
      });
  
      it("1.3 Invalid Id - Send a request with an invalid Id", async () => {
        allure.story("GET by ID - Invalid ID");
        const response = await getObjectType("InvalidObjectTypeId", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
      });
  
      it("1.4 Missing ProjectId - Send a request with empty ProjectId", async () => {
        allure.story("GET by ID - Missing ProjectId");
        const response = await getObjectType(objectTypeId, "");
        expect(response.statusCode).toBe(200);
      });
  
      it("1.5 Invalid ProjectId - Send a request with an invalid ProjectId", async () => {
        allure.story("GET by ID - Invalid ProjectId");
        const response = await getObjectType(objectTypeId, "invalid-project-id");
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
      });
  
      it("1.6 Validate Response Schema", async () => {
        allure.story("GET by ID - Schema Validation");
  
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
  
      it("2.1 Valid Request (No Filters)", async () => {
        allure.feature("ObjectType");
        allure.story("Pagination");
        allure.tag("pagination");
        allure.label("component", "ObjectType");
  
        const response = await getObjectTypesWithPagination();
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.json.items)).toBeTruthy();
      });
  
      it("2.2 Valid Request with Status Filter", async () => {
        allure.story("Pagination - Filter by Status");
        allure.parameter("status", "Active");
  
        const response = await getObjectTypesWithPagination(projectId, ["Active"]);
        expect(response.statusCode).toBe(200);
        expect(response.json.items.every((obj: { status: string }) => obj.status === "Active")).toBe(true);
      });
  
      it("2.3 Valid Request with Visibility Filter", async () => {
        allure.story("Pagination - Filter by Visibility");
        const response = await getObjectTypesWithPagination(projectId, undefined, ["Normal"]);
        expect(response.statusCode).toBe(200);
        expect(response.json.items.every((obj: { visibility: string }) => obj.visibility === "Normal")).toBe(true);
      });
  
      it("2.4 Valid Request with Group Filter", async () => {
        allure.story("Pagination - Filter by Group");
        const response = await getObjectTypesWithPagination(projectId, undefined, undefined, [groupId]);
        expect(response.statusCode).toBe(200);
      });
  
      it("2.5 Valid Request with SearchTerm", async () => {
        allure.story("Pagination - Search by Term");
        allure.parameter("search", "it");
  
        const response = await getObjectTypesWithPagination(projectId, undefined, undefined, undefined, 1, 20, "it");
        expect(response.statusCode).toBe(200);
      });
  
      it("2.6 Valid Request with Pagination", async () => {
        allure.story("Pagination - Page 2, Size 5");
        const response = await getObjectTypesWithPagination(projectId, undefined, undefined, undefined, 2, 5);
        expect(response.statusCode).toBe(200);
        expect(response.json.items.length).toBeLessThanOrEqual(5);
      });
  
      it("2.7 Valid Request with All Filters", async () => {
        allure.story("Pagination - All Filters Applied");
  
        const response = await getObjectTypesWithPagination(projectId, ["Active"], ["Normal"], [groupId], 1, 10, "User");
        expect(response.statusCode).toBe(200);
      });
  
      it("2.8 Invalid ProjectId", async () => {
        allure.story("Pagination - Invalid ProjectId");
        const response = await getObjectTypesWithPagination("invalid-project-id");
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
      });
  
    });
  
    describe('Test Cases for Retrieving ObjectType Graph', () => {
  
      it("3.1 Valid Graph Request", async () => {
        allure.feature("ObjectType");
        allure.story("Graph - Valid GroupId");
        const response = await getObjectTypeGraph(groupId, false, projectId);
        expect(response.statusCode).toBe(200);
      });
  
      it("3.2 Missing GroupId", async () => {
        allure.story("Graph - Missing GroupId");
        const response = await getObjectTypeGraph("", false, projectId);
        expect(response.statusCode).toBe(200);
      });
  
      it("3.3 Missing ProjectId", async () => {
        allure.story("Graph - Missing ProjectId");
        const response = await getObjectTypeGraph(groupId, false, '');
        expect(response.statusCode).toBe(200);
      });
  
      it("3.4 Invalid GroupId", async () => {
        allure.story("Graph - Invalid GroupId");
        const response = await getObjectTypeGraph("invalidGroupId", false, projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
      });
  
      it("3.5 Unrecognized=True", async () => {
        allure.story("Graph - Unrecognized=true");
        const response = await getObjectTypeGraph("", true, projectId);
        expect(response.statusCode).toBe(200);
      });
  
      it("3.6 Invalid ProjectId", async () => {
        allure.story("Graph - Invalid ProjectId");
        const response = await getObjectTypeGraph(groupId, false, "invalidProjectId");
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
      });
  
      it("3.7 Empty ProjectId", async () => {
        allure.story("Graph - Empty ProjectId");
        const response = await getObjectTypeGraph(groupId, false, "");
        expect(response.statusCode).toBe(200);
      });
  
    });
 


describe('it Cases for Retrieving ObjectType Graph by ObjectTypeId', () => {

    it("4.1 Valid Request - Send a request with valid ObjectTypeId and ProjectId", async () => {
        const response = await getGraphByObjectType(objectTypeId, projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.objectTypes[0].id).toBe(objectTypeId);
    });

    it("4.2 Missing ObjectTypeId - Send a request with empty ObjectTypeId", async () => {
        const response = await getGraphByObjectType("", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
        expect(response.json.errors.ObjectTypeId[0]).toBe("The ObjectTypeId field is required.");
    });

    it("4.3 Missing ProjectId - Send a request with empty ProjectId", async () => {
        const response = await getGraphByObjectType(objectTypeId, '');
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
    });

    it("4.4 Invalid ObjectTypeId - Send a request with an invalid ObjectTypeId", async () => {
        const response = await getGraphByObjectType("invalidObjectTypeId", projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
    });
});

describe('it Cases for Retrieving Object Types by Group', () => {

    it("5.1 Valid Request - Send a request with a valid GroupId and ProjectId", async () => {
        const response = await getObjectTypesByGroup(groupId, projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(Array.isArray(response.json)).toBeTruthy();
    });

    it("5.2 Missing GroupId - Send a request without GroupId (should return all object types)", async () => {
        const response = await getObjectTypesByGroup("", projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(Array.isArray(response.json)).toBeTruthy();
    });

    it("5.3 Empty ProjectId - Send a request with an empty ProjectId", async () => {
        const response = await getObjectTypesByGroup(groupId, "");
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(Array.isArray(response.json)).toBeTruthy();
    });

    it("5.4 Invalid GroupId - Send a request with an invalid GroupId", async () => {
        const response = await getObjectTypesByGroup("invalidGroupId", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

    it("5.5 Invalid ProjectId - Send a request with an invalid ProjectId", async () => {
        const response = await getObjectTypesByGroup(groupId, "invalidProjectId");
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

});

describe('it Cases for Retrieving ObjectType Graph by SemanticModelId', () => {

    it("6.1 Valid Request - Send a request with valid SemanticModelId and ProjectId", async () => {
        const response = await getGraphBySemanticModel(semanticModelId, projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.objectTypes).toBeDefined();
    });

    it("6.2 Missing SemanticModelId - Send a request without SemanticModelId", async () => {
        const response = await getGraphBySemanticModel("", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
        expect(response.json.errors.SemanticModelId[0]).toBe("The SemanticModelId field is required.");
    });

    it("6.3 Missing ProjectId - Send a request without ProjectId", async () => {
        const response = await getGraphBySemanticModel(semanticModelId, "");
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
        expect(response.json.errors.ProjectId[0]).toBe("The ProjectId field is required.");
    });

    it("6.4 Invalid SemanticModelId - Send a request with an invalid SemanticModelId", async () => {
        const response = await getGraphBySemanticModel("invalidSemanticModelId", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

    it("6.5 Invalid ProjectId - Send a request with an invalid ProjectId", async () => {
        const response = await getGraphBySemanticModel(semanticModelId, "invalidProjectId");
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });
});

describe('it Cases for Retrieving Joined Object Types by Semantic Model', () => {

    it("7.1 Valid Request - Send a request with valid SemanticModelId, ObjectTypeId, ProjectId, and includeCurrent=true", async () => {
        const response = await getJoinObjectTypesBySemanticModel(semanticModelId, objectTypeId, true, projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(Array.isArray(response.json)).toBeTruthy();
    });

    it("7.2 Missing SemanticModelId - Send a request without SemanticModelId", async () => {
        const response = await getJoinObjectTypesBySemanticModel("", objectTypeId, true, projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
    });

    it("7.3 Missing ObjectTypeId - Send a request without ObjectTypeId", async () => {
        const response = await getJoinObjectTypesBySemanticModel(semanticModelId, "", true, projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
    });

    it("7.4 Missing ProjectId - Send a request without ProjectId", async () => {
        const response = await getJoinObjectTypesBySemanticModel(semanticModelId, objectTypeId, true, "");
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
    });

    it("7.5 Invalid SemanticModelId - Send a request with an invalid SemanticModelId", async () => {
        const response = await getJoinObjectTypesBySemanticModel("invalidSemanticModelId", objectTypeId, true, projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
    });

    it("7.6 Invalid ObjectTypeId - Send a request with an invalid ObjectTypeId", async () => {
        const response = await getJoinObjectTypesBySemanticModel(semanticModelId, "invalidObjectTypeId", true, projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json).toEqual([]);
    });


    it("7.7 Invalid ProjectId - Send a request with an invalid ProjectId", async () => {
        const response = await getJoinObjectTypesBySemanticModel(semanticModelId, objectTypeId, true, "invalidProjectId");
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
    });

    it("7.8 Missing includeCurrent - Send a request without includeCurrent", async () => {
        const response = await getJoinObjectTypesBySemanticModel(semanticModelId, objectTypeId, false, projectId);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.json)).toBeTruthy();
    });

    it("7.9 includeCurrent=false - Send a request with includeCurrent=false", async () => {
        const response = await getJoinObjectTypesBySemanticModel(semanticModelId, objectTypeId, false, projectId);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.json)).toBeTruthy();
    });

});

describe("it Cases for ObjectType Preview", () => {

    it("8.1 Valid Request - Send a request with valid id, elementsCount=50, and ProjectId", async () => {
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

    it("8.2 Missing id - Send a request without id", async () => {
        const response = await getObjectTypePreview("", 50, projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
        expect(response.json.errors.id[0]).toBe("The id field is required.");
    });

    it("8.3 Missing elementsCount - Send a request without elementsCount", async () => {
        const response = await getObjectTypePreview(objectTypeId, '', projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.totalCount).toBe(100);
    });

    it("8.4 Missing ProjectId - Send a request without ProjectId", async () => {
        const response = await getObjectTypePreview(objectTypeId, 50, "");
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.totalCount).toBe(50);
    });

    it("8.5 Invalid id - Send a request with an invalid id", async () => {
        const response = await getObjectTypePreview("invalid-id", 50, projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

    it("8.6 Invalid ProjectId - Send a request with an invalid ProjectId", async () => {
        const response = await getObjectTypePreview(objectTypeId, 50, "invalidProjectId");
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

});

describe('it Cases for Retrieving ObjectTypeGroup', () => {

    it("9.1 Valid Request - Send a request with a valid Id and optional ProjectId", async () => {
        const response = await getObjectTypeGroup(groupId, projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.id).toBe(groupId);
    });

    it("9.2 Missing Id - Send a request without Id", async () => {
        const response = await getObjectTypeGroup("", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
        expect(response.json.errors.Id[0]).toBe("The Id field is required.");
    });

    it("9.3 Invalid Id - Send a request with an invalid Id", async () => {
        const response = await getObjectTypeGroup("invalidGroupId", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

    it("9.4 Missing ProjectId - Send a request with a valid Id, but without ProjectId", async () => {
        const response = await getObjectTypeGroup(groupId, "");
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.id).toBe(groupId);
    });

    it("9.5 Invalid ProjectId - Send a request with a valid Id, but an invalid ProjectId", async () => {
        const response = await getObjectTypeGroup(groupId, "invalidProjectId");
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

});

describe('it Cases for Retrieving ObjectTypeGroup with Pagination', () => {

    it("10.1 Valid Request - Send a request with PageNumber, PageSize, SearchTerm, and ProjectId", async () => {
        const response = await getObjectTypeGroupsWithPagination(1, 10, "user", projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.items).toBeInstanceOf(Array);
    });

    it("10.2 Default Pagination Values - Send a request without PageNumber and PageSize", async () => {
        const response = await getObjectTypeGroupsWithPagination(1, 20, "user", projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.pageNumber).toBe(1);
        expect(response.json.pageSize).toBe(20);
    });

    it("10.3 SearchTerm Filter - Send a request with a SearchTerm and valid ProjectId", async () => {
        const response = await getObjectTypeGroupsWithPagination(1, 20, "", projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.items).toBeInstanceOf(Array);
    });

    it("10.4 Missing ProjectId - Send a request without ProjectId", async () => {
        const response = await getObjectTypeGroupsWithPagination(1, 20, "", "");
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.items).toBeInstanceOf(Array);
    });

    it("10.5 Invalid ProjectId - Send a request with a valid PageNumber, PageSize, but an invalid ProjectId", async () => {
        const response = await getObjectTypeGroupsWithPagination(1, 20, "", "invalidProjectId");
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

});

describe('it Cases for Retrieving Semantic Model GET', () => {

    it("12.1 Valid Request - Send a request with a valid id and ProjectId", async () => {
        const response = await getSemanticModel(semanticModelId, projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.id).toBe(semanticModelId);
    });

    it("12.2 Missing id - Send a request without id", async () => {
        const response = await getSemanticModel("", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
        expect(response.json.errors.id[0]).toBe("The id field is required.");
    });

    it("12.3 Missing ProjectId - Send a request without ProjectId", async () => {
        const response = await getSemanticModel(semanticModelId, "");
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

    it("12.4 Invalid id - Send a request with an invalid id", async () => {
        const response = await getSemanticModel("invalidSemanticModelId", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
    });

    it("12.5 Invalid ProjectId - Send a request with an invalid ProjectId", async () => {
        const response = await getSemanticModel(semanticModelId, "invalidProjectId");
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

});


describe('it Cases for Retrieving Semantic Models by ObjectType Group', () => {

    it("16.1 Valid Request - Send a request with a valid GroupId and ProjectId", async () => {
        const response = await getSemanticModelsByObjectTypeGroup(groupId, projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(Array.isArray(response.json)).toBe(true);
    });

    it("16.2 Missing GroupId - Send a request without GroupId", async () => {
        const response = await getSemanticModelsByObjectTypeGroup("", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
        expect(response.json.errors.GroupId[0]).toBe("The GroupId field is required.");
    });

    it("16.3 Missing ProjectId - Send a request with a valid GroupId but no ProjectId", async () => {
        const response = await getSemanticModelsByObjectTypeGroup(groupId, "");
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
    });

    it("16.4 Invalid GroupId - Send a request with an invalid GroupId", async () => {
        const response = await getSemanticModelsByObjectTypeGroup("invalidGroupId", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

    it("16.5 Invalid ProjectId - Send a request with an invalid ProjectId", async () => {
        const response = await getSemanticModelsByObjectTypeGroup(groupId, "invalidProjectId");
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

});

describe('it Cases for Retrieving Linked Object Types by SemanticModel', () => {

    it("17.1 Valid Request - Send a request with a valid semanticModelId, objectTypeId, and projectId", async () => {
        const response = await getSemanticModelLinkedObjectTypes(semanticModelId, objectTypeId, projectId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(Array.isArray(response.json.objectTypes)).toBe(true);
    });

    it("17.2 Missing semanticModelId - Send a request without semanticModelId", async () => {
        const response = await getSemanticModelLinkedObjectTypes("", objectTypeId, projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
        expect(response.json.errors.Id[0]).toBe("The Id field is required.");
    });

    it("17.3 Missing objectTypeId - Send a request without objectTypeId", async () => {
        const response = await getSemanticModelLinkedObjectTypes(semanticModelId, "", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
        expect(response.json.errors.ObjectTypeId[0]).toBe("The ObjectTypeId field is required.");
    });

    it("17.4 Missing projectId - Send a request with a valid semanticModelId and objectTypeId but no projectId", async () => {
        const response = await getSemanticModelLinkedObjectTypes(semanticModelId, objectTypeId, "");
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

    it("17.5 Invalid semanticModelId - Send a request with an invalid semanticModelId", async () => {
        const response = await getSemanticModelLinkedObjectTypes("invalid-semantic-model-id", objectTypeId, projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

    it("17.6 Invalid objectTypeId - Send a request with an invalid objectTypeId", async () => {
        const response = await getSemanticModelLinkedObjectTypes(semanticModelId, "invalid-object-type-id", projectId);
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

    it("17.7 Invalid projectId - Send a request with an invalid projectId", async () => {
        const response = await getSemanticModelLinkedObjectTypes(semanticModelId, objectTypeId, "invalid-project-id");
        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

});

describe("Semantic Model API it Suite", () => {
    let smdId: string;

    it("1. Create a new Semantic Model - Verify successful creation", async () => {
        const response = await postSemanticModel(mockSemanticModelPostRequest);

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        smdId = response.json;
    });

    it("2. Update the created Semantic Model - Verify update is successful", async () => {
        mockSemanticModelPutRequest.id = smdId;
        const response = await updateSemanticModel(mockSemanticModelPutRequest);
        expect(response.statusCode).toBe(204);
    });

    it("3. Retrieve the updated Semantic Model - Verify response schema and values", async () => {
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

    it("4. Delete the created Semantic Model - Verify deletion is successful", async () => {
        const response = await deleteSemanticModel(smdId, projectId);
        expect(response.statusCode).toBe(204);
        const getResponse = await getSemanticModel(smdId, projectId);
        expect(getResponse.statusCode).toBe(400);
    });
});



});