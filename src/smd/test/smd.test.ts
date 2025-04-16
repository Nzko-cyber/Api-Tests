import { description, epic } from "allure-js-commons";
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

describe(" SEMANTIC MODEL DESIGNER::Object Type", () => {

beforeEach(() => {
    allure.epic('Semantic Model');
    allure.owner("QA Team");
});


    describe('Test Cases for Retrieving ObjectType', () => {
        allure.feature(" SMD ObjectType Api Tests");
  
      it("1.1 Valid Request - Send a request with a valid Id & ProjectId", async () => {
        allure.story("Get ObjectType with valid ID");
        allure.description("Retrieve a single ObjectType by valid ID and ProjectID");
  
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
        allure.description("This test checks the response when ID is missing in the request.");
        allure.parameter("projectId", projectId);
  
        const response = await getObjectType("", projectId);
        
        allure.attachment("Response", JSON.stringify(response.json), "application/json");
  
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
      });
  
      it("1.3 Invalid Id - Send a request with an invalid Id", async () => {
        allure.story("GET by ID - Invalid ID");
        allure.description("This test checks the response when an invalid ID is provided.");
  
        const response = await getObjectType("InvalidObjectTypeId", projectId);
        
        allure.attachment("Response", JSON.stringify(response.json), "application/json");
  
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
      });
  
      it("1.4 Missing ProjectId - Send a request with empty ProjectId", async () => {
        allure.story("GET by ID - Missing ProjectId");
        allure.description("This test checks the response when ProjectId is empty.");
  
        const response = await getObjectType(objectTypeId, "");
        
        allure.attachment("Response", JSON.stringify(response.json), "application/json");
  
        expect(response.statusCode).toBe(200);
      });
  
      it("1.5 Invalid ProjectId - Send a request with an invalid ProjectId", async () => {
        allure.story("GET by ID - Invalid ProjectId");
        allure.description("This test checks the response when an invalid ProjectId is provided.");
  
        const response = await getObjectType(objectTypeId, "invalid-project-id");
        
        allure.attachment("Response", JSON.stringify(response.json), "application/json");
  
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
      });
  
      it("1.6 Validate Response Schema", async () => {
        allure.story("GET by ID - Schema Validation");
        allure.description("This test validates the schema of the response.");
  
        const response = await getObjectType(objectTypeId, projectId);
        
        allure.attachment("Response", JSON.stringify(response.json), "application/json");
  
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
        allure.feature(" SMD ObjectTypePagnigation Api Tests");
  
      it("2.1 Valid Request (No Filters)", async () => {
        allure.story("Get Pagination with valid data");
        allure.tag("pagination");
        allure.description("This test retrieves a list of ObjectTypes without any filters.");
  
        const response = await getObjectTypesWithPagination();
        
        allure.attachment("Response", JSON.stringify(response.json), "application/json");
  
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.json.items)).toBeTruthy();
      });
  
      it("2.2 Valid Request with Status Filter", async () => {
        allure.story("Pagination - Filter by Status");
        allure.parameter("status", "Active");
        allure.description("This test applies a filter by status 'Active' and retrieves the ObjectTypes.");
  
        const response = await getObjectTypesWithPagination(projectId, ["Active"]);
        
        allure.attachment("Response", JSON.stringify(response.json), "application/json");
  
        expect(response.statusCode).toBe(200);
        expect(response.json.items.every((obj: { status: string }) => obj.status === "Active")).toBe(true);
      });
  
      it("2.3 Valid Request with Visibility Filter", async () => {
        allure.story("Pagination - Filter by Visibility");
        allure.description("This test applies a filter by visibility 'Normal' and retrieves ObjectTypes.");
  
        const response = await getObjectTypesWithPagination(projectId, undefined, ["Normal"]);
        
        allure.attachment("Response", JSON.stringify(response.json), "application/json");
  
        expect(response.statusCode).toBe(200);
        expect(response.json.items.every((obj: { visibility: string }) => obj.visibility === "Normal")).toBe(true);
      });
  
      it("2.4 Valid Request with Group Filter", async () => {
        allure.story("Pagination - Filter by Group");
        allure.description("This test applies a filter by Group and retrieves ObjectTypes.");
  
        const response = await getObjectTypesWithPagination(projectId, undefined, undefined, [groupId]);
        
        allure.attachment("Response", JSON.stringify(response.json), "application/json");
  
        expect(response.statusCode).toBe(200);
      });
  
      it("2.5 Valid Request with SearchTerm", async () => {
        allure.story("Pagination - Search by Term");
        allure.parameter("search", "it");
        allure.description("This test searches for ObjectTypes with the search term 'it'.");
  
        const response = await getObjectTypesWithPagination(projectId, undefined, undefined, undefined, 1, 20, "it");
        
        allure.attachment("Response", JSON.stringify(response.json), "application/json");
  
        expect(response.statusCode).toBe(200);
      });
  
      it("2.6 Valid Request with Pagination", async () => {
        allure.story("Pagination - Page 2, Size 5");
        allure.description("This test retrieves ObjectTypes with pagination, page 2 and size 5.");
  
        const response = await getObjectTypesWithPagination(projectId, undefined, undefined, undefined, 2, 5);
        
        allure.attachment("Response", JSON.stringify(response.json), "application/json");
  
        expect(response.statusCode).toBe(200);
        expect(response.json.items.length).toBeLessThanOrEqual(5);
      });
  
      it("2.7 Valid Request with All Filters", async () => {
        allure.story("Pagination - All Filters Applied");
        allure.description("This test applies all available filters and retrieves ObjectTypes.");
  
        const response = await getObjectTypesWithPagination(projectId, ["Active"], ["Normal"], [groupId], 1, 10, "User");
        
        allure.attachment("Response", JSON.stringify(response.json), "application/json");
  
        expect(response.statusCode).toBe(200);
      });
  
      it("2.8 Invalid ProjectId", async () => {
        allure.story("Pagination - Invalid ProjectId");
        allure.description("This test ensures proper error handling for invalid ProjectId.");
        
        const response = await getObjectTypesWithPagination("invalid-project-id");
        
        allure.attachment("Response", JSON.stringify(response.json), "application/json");
  
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
      });
  
    });
  
    describe('Test Cases for Retrieving ObjectType Graph', () => {
        allure.feature(" SMD Retrieving  ObjectType Graph Api Tests");
        
      it("3.1 Valid Graph Request", async () => {
        allure.story("Graph - Valid GroupId");
        allure.description("This test checks retrieving the ObjectType graph with a valid GroupId.");
  
        const response = await getObjectTypeGraph(groupId, false, projectId);
        
        allure.attachment("Response", JSON.stringify(response.json), "application/json");
  
        expect(response.statusCode).toBe(200);
      });
  
      it("3.2 Missing GroupId", async () => {
        allure.story("Graph - Missing GroupId");
        allure.description("This test checks retrieving the ObjectType graph when GroupId is missing.");
  
        const response = await getObjectTypeGraph("", false, projectId);
        
        allure.attachment("Response", JSON.stringify(response.json), "application/json");
  
        expect(response.statusCode).toBe(200);
      });
  
      it("3.3 Missing ProjectId", async () => {
        allure.story("Graph - Missing ProjectId");
        allure.description("This test checks retrieving the ObjectType graph when ProjectId is missing.");
  
        const response = await getObjectTypeGraph(groupId, false, '');
        
        allure.attachment("Response", JSON.stringify(response.json), "application/json");
  
        expect(response.statusCode).toBe(200);
      });
  
      it("3.4 Invalid GroupId", async () => {
        allure.story("Graph - Invalid GroupId");
        allure.description("This test checks retrieving the ObjectType graph with an invalid GroupId.");
  
        const response = await getObjectTypeGraph("invalidGroupId", false, projectId);
        
        allure.attachment("Response", JSON.stringify(response.json), "application/json");
  
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
      });
  
      it("3.5 Unrecognized=True", async () => {
        allure.story("Graph - Unrecognized=true");
        allure.description("This test checks retrieving the ObjectType graph with 'unrecognized=true'.");
  
        const response = await getObjectTypeGraph("", true, projectId);
        
        allure.attachment("Response", JSON.stringify(response.json), "application/json");
  
        expect(response.statusCode).toBe(200);
      });
  
      it("3.6 Invalid ProjectId", async () => {
        allure.story("Graph - Invalid ProjectId");
        allure.description("This test checks retrieving the ObjectType graph with an invalid ProjectId.");
  
        const response = await getObjectTypeGraph(groupId, false, "invalidProjectId");
        
        allure.attachment("Response", JSON.stringify(response.json), "application/json");
  
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
      });
  
      it("3.7 Empty ProjectId", async () => {
        allure.story("Graph - Empty ProjectId");
        allure.description("This test checks retrieving the ObjectType graph with an empty ProjectId.");
  
        const response = await getObjectTypeGraph(groupId, false, "");
        
        allure.attachment("Response", JSON.stringify(response.json), "application/json");
  
        expect(response.statusCode).toBe(200);
      });
  
 });


describe('This Test Cases for Retrieving ObjectType Graph by ObjectTypeId', () => {
    allure.feature(" SMD Retrieving  ObjectType Graph  by ObjectTypeId Api Tests");


    it("4.1 Valid Request - Send a request with valid ObjectTypeId and ProjectId", async () => {
        allure.story("Graph Retrieval by ObjectTypeId");
        allure.descripion("This test retrieves the graph of an ObjectType using a valid ObjectTypeId and ProjectId.");

        const response = await getGraphByObjectType(objectTypeId, projectId);

        allure.attachment("Response", JSON.stringify(response.json), "application/json");
        allure.parameter("objectTypeId", objectTypeId);
        allure.parameter("projectId", projectId);

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.objectTypes[0].id).toBe(objectTypeId);
    });

    it("4.2 Missing ObjectTypeId - Send a request with empty ObjectTypeId", async () => {
        allure.story("Graph Retrieval by ObjectTypeId - Missing ObjectTypeId");
        allure.description("This test checks the response when ObjectTypeId is missing from the request.");
        allure.parameter("projectId", projectId);

        const response = await getGraphByObjectType("", projectId);

        allure.attachment("Response", JSON.stringify(response.json), "application/json");

        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
        expect(response.json.errors.ObjectTypeId[0]).toBe("The ObjectTypeId field is required.");
    });

    it("4.3 Missing ProjectId - Send a request with empty ProjectId", async () => {
        allure.story("Graph Retrieval by ObjectTypeId - Missing ProjectId");
        allure.description("This test checks the response when ProjectId is missing from the request.");

        const response = await getGraphByObjectType(objectTypeId, "");

        allure.attachment("Response", JSON.stringify(response.json), "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
    });

    it("4.4 Invalid ObjectTypeId - Send a request with an invalid ObjectTypeId", async () => {
        allure.story("Graph Retrieval by ObjectTypeId - Invalid ObjectTypeId");
        allure.description("This test checks the response when an invalid ObjectTypeId is provided.");

        const response = await getGraphByObjectType("invalidObjectTypeId", projectId);

        allure.attachment("Response", JSON.stringify(response.json), "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
    });
});

describe('This test Cases for Retrieving Object Types by Group', () => {
    allure.feature(" SMD Retrieving Object Types by Group Api Tests");

    it("5.1 Valid Request - Send a request with a valid GroupId and ProjectId", async () => {
        allure.story("Retrieve Object Types by Group");
        allure.description("This test retrieves a list of ObjectTypes by providing a valid GroupId and ProjectId.");

        const response = await getObjectTypesByGroup(groupId, projectId);

        allure.attachment("Response", JSON.stringify(response.json), "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(Array.isArray(response.json)).toBeTruthy();
    });

    it("5.2 Missing GroupId - Send a request without GroupId (should return all object types)", async () => {
        allure.story("Retrieve Object Types by Group - Missing GroupId");
        allure.description("This test checks retrieving all ObjectTypes when no GroupId is provided.");

        const response = await getObjectTypesByGroup("", projectId);

        allure.attachment("Response", JSON.stringify(response.json), "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(Array.isArray(response.json)).toBeTruthy();
    });

    it("5.3 Empty ProjectId - Send a request with an empty ProjectId", async () => {
        allure.story("Retrieve Object Types by Group - Missing ProjectId");
        allure.description("This test checks retrieving ObjectTypes when ProjectId is empty.");

        const response = await getObjectTypesByGroup(groupId, "");

        allure.attachment("Response", JSON.stringify(response.json), "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(Array.isArray(response.json)).toBeTruthy();
    });

    it("5.4 Invalid GroupId - Send a request with an invalid GroupId", async () => {
        allure.story("Retrieve Object Types by Group - Invalid GroupId");
        allure.description("This test checks the response when an invalid GroupId is provided.");

        const response = await getObjectTypesByGroup("invalidGroupId", projectId);

        allure.attachment("Response", JSON.stringify(response.json), "application/json");

        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

    it("5.5 Invalid ProjectId - Send a request with an invalid ProjectId", async () => {
        allure.story("Retrieve Object Types by Group - Invalid ProjectId");
        allure.description("This test checks the response when an invalid ProjectId is provided.");

        const response = await getObjectTypesByGroup(groupId, "invalidProjectId");

        allure.attachment("Response", JSON.stringify(response.json), "application/json");

        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

});

describe('This Test Cases for Retrieving ObjectType Graph by SemanticModelId', () => {
    allure.feature(" SMD Retrieving Object Types by SemanticModelId Api Tests");

    it("6.1 Valid Request - Send a request with valid SemanticModelId and ProjectId", async () => {
        allure.story("Graph Retrieval by SemanticModelId");
        allure.description("This test retrieves the ObjectType graph by providing valid SemanticModelId and ProjectId.");

        const response = await getGraphBySemanticModel(semanticModelId, projectId);

        allure.attachment("Response", JSON.stringify(response.json), "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.objectTypes).toBeDefined();
    });

    it("6.2 Missing SemanticModelId - Send a request without SemanticModelId", async () => {
        allure.story("Graph Retrieval by SemanticModelId - Missing SemanticModelId");
        allure.description("This test checks the response when SemanticModelId is missing from the request.");

        const response = await getGraphBySemanticModel("", projectId);

        allure.attachment("Response", JSON.stringify(response.json), "application/json");

        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
        expect(response.json.errors.SemanticModelId[0]).toBe("The SemanticModelId field is required.");
    });

    it("6.3 Missing ProjectId - Send a request without ProjectId", async () => {
        allure.story("Graph Retrieval by SemanticModelId - Missing ProjectId");
        allure.description("This test checks the response when ProjectId is missing from the request.");

        const response = await getGraphBySemanticModel(semanticModelId, "");

        allure.attachment("Response", JSON.stringify(response.json), "application/json");

        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
        expect(response.json.errors.ProjectId[0]).toBe("The ProjectId field is required.");
    });

    it("6.4 Invalid SemanticModelId - Send a request with an invalid SemanticModelId", async () => {
        allure.story("Graph Retrieval by SemanticModelId - Invalid SemanticModelId");
        allure.description("This test checks the response when an invalid SemanticModelId is provided.");

        const response = await getGraphBySemanticModel("invalidSemanticModelId", projectId);

        allure.attachment("Response", JSON.stringify(response.json), "application/json");

        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

    it("6.5 Invalid ProjectId - Send a request with an invalid ProjectId", async () => {
        allure.story("Graph Retrieval by SemanticModelId - Invalid ProjectId");
        allure.description("This test checks the response when an invalid ProjectId is provided.");

        const response = await getGraphBySemanticModel(semanticModelId, "invalidProjectId");

        allure.attachment("Response", JSON.stringify(response.json), "application/json");

        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });
});

describe('Test Cases for Retrieving Joined Object Types by Semantic Model', () => {
    allure.feature("Retrieving Joined Object Types by Semantic Model");

    it("7.1 Valid Request - Send a request with valid SemanticModelId, ObjectTypeId, ProjectId, and includeCurrent=true", async () => {
        allure.story("Retrieving Joined Object Types by Semantic Model");
        allure.description("This test retrieves the joined object types by SemanticModelId, ObjectTypeId, and ProjectId with includeCurrent=true.");

        const response = await getJoinObjectTypesBySemanticModel(semanticModelId, objectTypeId, true, projectId);

        allure.attachment("Response", JSON.stringify(response.json), "application/json");
        allure.parameter("semanticModelId", semanticModelId);
        allure.parameter("objectTypeId", objectTypeId);
        allure.parameter("projectId", projectId);
        allure.parameter("includeCurrent", true);

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(Array.isArray(response.json)).toBeTruthy();
    });

    it("7.2 Missing SemanticModelId - Send a request without SemanticModelId", async () => {
        allure.story("Missing SemanticModelId");
        allure.description("This test ensures that a request without SemanticModelId is rejected.");
        
        const response = await getJoinObjectTypesBySemanticModel("", objectTypeId, true, projectId);

        allure.attachment("Response", JSON.stringify(response.json), "application/json");
        allure.parameter("semanticModelId", "");

        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
    });

    it("7.3 Missing ObjectTypeId - Send a request without ObjectTypeId", async () => {
        allure.story("Missing ObjectTypeId");
        allure.description("This test ensures that a request without ObjectTypeId is rejected.");
        
        const response = await getJoinObjectTypesBySemanticModel(semanticModelId, "", true, projectId);

        allure.attachment("Response", JSON.stringify(response.json), "application/json");
        allure.parameter("objectTypeId", "");

        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
    });

    it("7.4 Missing ProjectId - Send a request without ProjectId", async () => {
        allure.story("Missing ProjectId");
        allure.description("This test checks the behavior when ProjectId is not provided.");

        const response = await getJoinObjectTypesBySemanticModel(semanticModelId, objectTypeId, true, "");

        allure.attachment("Response", JSON.stringify(response.json), "application/json");
        allure.parameter("projectId", "");

        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
    });

    it("7.5 Invalid SemanticModelId - Send a request with an invalid SemanticModelId", async () => {
        allure.story("Invalid SemanticModelId");
        allure.description("This test checks how the API handles an invalid SemanticModelId.");

        const response = await getJoinObjectTypesBySemanticModel("invalidSemanticModelId", objectTypeId, true, projectId);

        allure.attachment("Response", JSON.stringify(response.json), "application/json");
        allure.parameter("semanticModelId", "invalidSemanticModelId");

        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
    });

    it("7.6 Invalid ObjectTypeId - Send a request with an invalid ObjectTypeId", async () => {
        allure.story("Invalid ObjectTypeId");
        allure.description("This test checks how the API handles an invalid ObjectTypeId.");

        const response = await getJoinObjectTypesBySemanticModel(semanticModelId, "invalidObjectTypeId", true, projectId);

        allure.attachment("Response", JSON.stringify(response.json), "application/json");
        allure.parameter("objectTypeId", "invalidObjectTypeId");

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json).toEqual([]);
    });

    it("7.7 Invalid ProjectId - Send a request with an invalid ProjectId", async () => {
        allure.story("Invalid ProjectId");
        allure.description("This test checks how the API handles an invalid ProjectId.");

        const response = await getJoinObjectTypesBySemanticModel(semanticModelId, objectTypeId, true, "invalidProjectId");

        allure.attachment("Response", JSON.stringify(response.json), "application/json");
        allure.parameter("projectId", "invalidProjectId");

        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
    });

    it("7.8 Missing includeCurrent - Send a request without includeCurrent", async () => {
        allure.story("Missing includeCurrent");
        allure.description("This test checks the behavior when includeCurrent is not provided in the request.");

        const response = await getJoinObjectTypesBySemanticModel(semanticModelId, objectTypeId, false, projectId);

        allure.attachment("Response", JSON.stringify(response.json), "application/json");
        allure.parameter("includeCurrent", false);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.json)).toBeTruthy();
    });

    it("7.9 includeCurrent=false - Send a request with includeCurrent=false", async () => {
        allure.story("includeCurrent=false");
        allure.description("This test checks the behavior when includeCurrent is set to false in the request.");

        const response = await getJoinObjectTypesBySemanticModel(semanticModelId, objectTypeId, false, projectId);

        allure.attachment("Response", JSON.stringify(response.json), "application/json");
        allure.parameter("includeCurrent", false);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.json)).toBeTruthy();
    });

});

describe("Test Cases for ObjectType Preview", () => {
    allure.feature("Tests ObjectType Preview");

    it("8.1 Valid Request - Send a request with valid id, elementsCount=50, and ProjectId", async () => {
        allure.story("Valid Preview Request");
        allure.description("This test sends a valid request to retrieve the object type preview with 50 elements.");

        const response = await getObjectTypePreview(objectTypeId, 50, projectId);

        allure.attachment("Response", JSON.stringify(response.json), "application/json");
        allure.parameter("objectTypeId", objectTypeId);
        allure.parameter("elementsCount", 50);
        allure.parameter("projectId", projectId);

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
        allure.story("Missing ObjectTypeId");
        allure.description("This test ensures that a request without ObjectTypeId is rejected.");

        const response = await getObjectTypePreview("", 50, projectId);

        allure.attachment("Response", JSON.stringify(response.json), "application/json");

        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
        expect(response.json.errors.id[0]).toBe("The id field is required.");
    });

    it("8.3 Missing elementsCount - Send a request without elementsCount", async () => {
        allure.story("Missing elementsCount");
        allure.description("This test ensures that a request without elementsCount will return the default value.");

        const response = await getObjectTypePreview(objectTypeId, '', projectId);

        allure.attachment("Response", JSON.stringify(response.json), "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.totalCount).toBe(100);
    });

    it("8.4 Missing ProjectId - Send a request without ProjectId", async () => {
        allure.story("Missing ProjectId");
        allure.description("This test checks the response when ProjectId is missing from the request.");

        const response = await getObjectTypePreview(objectTypeId, 50, "");

        allure.attachment("Response", JSON.stringify(response.json), "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.totalCount).toBe(50);
    });

    it("8.5 Invalid id - Send a request with an invalid id", async () => {
        allure.story("Invalid ObjectTypeId");
        allure.description("This test checks the response when an invalid ObjectTypeId is provided.");

        const response = await getObjectTypePreview("invalid-id", 50, projectId);

        allure.attachment("Response", JSON.stringify(response.json), "application/json");

        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

    it("8.6 Invalid ProjectId - Send a request with an invalid ProjectId", async () => {
        allure.story("Invalid ProjectId");
        allure.description("This test checks the response when an invalid ProjectId is provided.");

        const response = await getObjectTypePreview(objectTypeId, 50, "invalidProjectId");

        allure.attachment("Response", JSON.stringify(response.json), "application/json");

        expect(response.statusCode).toBe(400);
        expect(response.json).toBeDefined();
        expect(response.json.errors).toBeDefined();
    });

});

describe('Test Cases for Retrieving ObjectTypeGroup', () => {
    allure.feature("Retrieving ObjectTypeGroup Api Tests");

    it("9.1 Valid Request - Send a request with a valid Id and optional ProjectId", async () => {
        allure.story("Retrieve ObjectTypeGroup");
        allure.description("This test retrieves the ObjectTypeGroup using a valid Id and ProjectId.");

        const response = await getObjectTypeGroup(groupId, projectId);

        allure.attachment("Response", JSON.stringify(response.json), "application/json");
        allure.parameter("groupId", groupId);
        allure.parameter("projectId", projectId);

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.id).toBe(groupId);
    });

    it("9.2 Missing Id - Send a request without Id", async () => {
        allure.story("Missing ObjectTypeGroup Id");
        allure.description("This test checks the behavior when the ObjectTypeGroup Id is missing from the request.");

        const response = await getObjectTypeGroup("", projectId);

        allure.attachment("Response", JSON.stringify(response.json), "application/json");

        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
        expect(response.json.errors.Id[0]).toBe("The Id field is required.");
    });

    it("9.3 Invalid Id - Send a request with an invalid Id", async () => { 
        allure.story("Invalid ObjectTypeGroup Id");
        allure.description("This test checks the response when an invalid ObjectTypeGroup Id is provided.");
        const response = await getObjectTypeGroup("invalidGroupId", projectId);
        
            allure.attachment("Response", JSON.stringify(response.json), "application/json");
        
            expect(response.statusCode).toBe(400);
            expect(response.json).toBeDefined();
            expect(response.json.errors).toBeDefined();
        });
        
        it("9.4 Missing ProjectId - Send a request with a valid Id, but without ProjectId", async () => {
            allure.story("Missing ProjectId");
            allure.description("This test verifies that ObjectTypeGroup can still be retrieved with a valid Id and no ProjectId.");
        
            const response = await getObjectTypeGroup(groupId, "");
        
            allure.attachment("Response", JSON.stringify(response.json), "application/json");
        
            expect(response.statusCode).toBe(200);
            expect(response.json).toBeDefined();
            expect(response.json.id).toBe(groupId);
        });
        
        it("9.5 Invalid ProjectId - Send a request with a valid Id, but an invalid ProjectId", async () => {
            allure.story("Invalid ProjectId");
            allure.description("This test checks the response when an invalid ProjectId is provided for ObjectTypeGroup retrieval.");
        
            const response = await getObjectTypeGroup(groupId, "invalidProjectId");
        
            allure.attachment("Response", JSON.stringify(response.json), "application/json");
        
            expect(response.statusCode).toBe(400);
            expect(response.json).toBeDefined();
            expect(response.json.errors).toBeDefined();
        });
    });

    describe('Test Cases for Retrieving ObjectTypeGroup with Pagination', () => {
        allure.feature("Retrieving ObjectTypeGroup with Pagination");

        it("10.1 Valid Request - Send a request with PageNumber, PageSize, SearchTerm, and ProjectId", async () => {
            allure.story("Pagination");
            allure.description("Retrieve ObjectTypeGroups with pagination and search term.");
            allure.parameter("PageNumber", 1);
            allure.parameter("PageSize", 10);
            allure.parameter("SearchTerm", "user");
            allure.parameter("ProjectId", projectId);
    
            const response = await getObjectTypeGroupsWithPagination(1, 10, "user", projectId);
    
            allure.attachment("Response", JSON.stringify(response.json), "application/json");
            expect(response.statusCode).toBe(200);
            expect(response.json).toBeDefined();
            expect(response.json.items).toBeInstanceOf(Array);
        });
    
        it("10.2 Default Pagination Values - Send a request without PageNumber and PageSize", async () => {
            allure.story("Default Pagination");
            allure.description("Verifies that default pagination values are returned.");
            const response = await getObjectTypeGroupsWithPagination(1, 20, "user", projectId);
    
            allure.attachment("Response", JSON.stringify(response.json), "application/json");
            expect(response.statusCode).toBe(200);
            expect(response.json.pageNumber).toBe(1);
            expect(response.json.pageSize).toBe(20);
        });
    
        it("10.3 SearchTerm Filter - Send a request with a SearchTerm and valid ProjectId", async () => {
            allure.story("SearchTerm Filter");
            allure.description("Ensures filtering by search term works correctly.");
            const response = await getObjectTypeGroupsWithPagination(1, 20, "", projectId);
    
            allure.attachment("Response", JSON.stringify(response.json), "application/json");
            expect(response.statusCode).toBe(200);
            expect(response.json.items).toBeInstanceOf(Array);
        });
    
        it("10.4 Missing ProjectId - Send a request without ProjectId", async () => {
            allure.story("Missing ProjectId");
            allure.description("Validates behavior when ProjectId is missing.");
            const response = await getObjectTypeGroupsWithPagination(1, 20, "", "");
    
            allure.attachment("Response", JSON.stringify(response.json), "application/json");
            expect(response.statusCode).toBe(200);
            expect(response.json.items).toBeInstanceOf(Array);
        });
    
        it("10.5 Invalid ProjectId - Send a request with a valid PageNumber, PageSize, but an invalid ProjectId", async () => {
            allure.story("Invalid ProjectId");
            allure.description("Should return 400 error on invalid ProjectId.");
            const response = await getObjectTypeGroupsWithPagination(1, 20, "", "invalidProjectId");
    
            allure.attachment("Response", JSON.stringify(response.json), "application/json");
            expect(response.statusCode).toBe(400);
            expect(response.json.errors).toBeDefined();
        });
    
    });
    
    describe('Test Cases for Retrieving Semantic Model GET', () => {
        allure.feature("Retrieving Semantic Model ");

        it("12.1 Valid Request - Send a request with a valid id and ProjectId", async () => {
            allure.story("GET by ID");
            allure.description("Successfully retrieves semantic model by ID.");
            allure.parameter("id", semanticModelId);
            allure.parameter("ProjectId", projectId);
    
            const response = await getSemanticModel(semanticModelId, projectId);
    
            allure.attachment("Response", JSON.stringify(response.json), "application/json");
            expect(response.statusCode).toBe(200);
            expect(response.json.id).toBe(semanticModelId);
        });
    
        it("12.2 Missing id - Send a request without id", async () => {
            allure.story("Missing ID");
            allure.description("Request without semantic model ID should return 400.");
    
            const response = await getSemanticModel("", projectId);
    
            allure.attachment("Response", JSON.stringify(response.json), "application/json");
            expect(response.statusCode).toBe(400);
            expect(response.json.errors.id[0]).toBe("The id field is required.");
        });
    
        it("12.3 Missing ProjectId - Send a request without ProjectId", async () => {
            allure.story("Missing ProjectId");
            allure.descripion("Request without ProjectId should return 400.");
            const response = await getSemanticModel(semanticModelId, "");
    
            allure.attachment("Response", JSON.stringify(response.json), "application/json");
            expect(response.statusCode).toBe(400);
            expect(response.json.errors).toBeDefined();
        });
    
        it("12.4 Invalid id - Send a request with an invalid id", async () => {
            allure.story("Invalid ID");
            allure.description("This test sends a request with an invalid id  ");
            const response = await getSemanticModel("invalidSemanticModelId", projectId);
    
            allure.attachment("Response", JSON.stringify(response.json), "application/json");
            expect(response.statusCode).toBe(400);
            expect(response.json.errors).toBeDefined();
        });
    
        it("12.5 Invalid ProjectId - Send a request with an invalid ProjectId", async () => {
            allure.story("Invalid ProjectId");
            allure.descripion("Request with an invalid ProjectId should return 400.");
            const response = await getSemanticModel(semanticModelId, "invalidProjectId");
    
            allure.attachment("Response", JSON.stringify(response.json), "application/json");
            expect(response.statusCode).toBe(400);
            expect(response.json.errors).toBeDefined();
        });
    
    });
    
    describe('Test Cases for Retrieving Semantic Models by ObjectType Group', () => {
        allure.feature("Semantic Model");

        it("16.1 Valid Request - Send a request with a valid GroupId and ProjectId", async () => {
            allure.story("Get By GroupId");
            allure.description("Retrieves semantic models based on a valid group ID and project ID.");
            allure.parameter("GroupId", groupId);
            allure.parameter("ProjectId", projectId);
    
            const response = await getSemanticModelsByObjectTypeGroup(groupId, projectId);
    
            allure.attachment("Response", JSON.stringify(response.json), "application/json");
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.json)).toBe(true);
        });
    
        it("16.2 Missing GroupId - Send a request without GroupId", async () => {
            allure.story("Missing GroupId");
            allure.description("Attempts to retrieve semantic models without providing GroupId.");
    
            const response = await getSemanticModelsByObjectTypeGroup("", projectId);
    
            allure.attachment("Response", JSON.stringify(response.json), "application/json");
            expect(response.statusCode).toBe(400);
            expect(response.json.errors.GroupId[0]).toBe("The GroupId field is required.");
        });
    
        it("16.3 Missing ProjectId - Send a request with a valid GroupId but no ProjectId", async () => {
            allure.story("Missing ProjectId");
            allure.description("Retrieves semantic models with valid GroupId but no ProjectId.");
    
            const response = await getSemanticModelsByObjectTypeGroup(groupId, "");
    
            allure.attachment("Response", JSON.stringify(response.json), "application/json");
            expect(response.statusCode).toBe(200);
        });
    
        it("16.4 Invalid GroupId - Send a request with an invalid GroupId", async () => {
            allure.story("Invalid GroupId");
            allure.description("Attempts to retrieve semantic models using an invalid GroupId.");
    
            const response = await getSemanticModelsByObjectTypeGroup("invalidGroupId", projectId);
    
            allure.attachment("Response", JSON.stringify(response.json), "application/json");
            expect(response.statusCode).toBe(400);
            expect(response.json.errors).toBeDefined();
        });
    
        it("16.5 Invalid ProjectId - Send a request with an invalid ProjectId", async () => {
            allure.story("Invalid ProjectId");
            allure.description("Attempts to retrieve semantic models using a valid GroupId and invalid ProjectId.");
    
            const response = await getSemanticModelsByObjectTypeGroup(groupId, "invalidProjectId");
    
            allure.attachment("Response", JSON.stringify(response.json), "application/json");
            expect(response.statusCode).toBe(400);
            expect(response.json.errors).toBeDefined();
        });
    
    });
    
    describe('Test Cases for Retrieving Linked Object Types by SemanticModel', () => {
        allure.feature("Retrieving Linked Object Types by SemanticModel");

        it("17.1 Valid Request - Send a request with a valid semanticModelId, objectTypeId, and projectId", async () => {
            allure.story("Linked Object Types");
            allure.description("Get linked object types by valid semanticModelId, objectTypeId, and projectId");
            allure.parameter("semanticModelId", semanticModelId);
            allure.parameter("objectTypeId", objectTypeId);
            allure.parameter("projectId", projectId);
    
            const response = await getSemanticModelLinkedObjectTypes(semanticModelId, objectTypeId, projectId);
            allure.attachment("Response", JSON.stringify(response.json), "application/json");
    
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.json.objectTypes)).toBe(true);
        });
    
        it("17.2 Missing semanticModelId - Send a request without semanticModelId", async () => {
            allure.story("Missing semanticModelId");
            allure.description("This test ensures that a request without semanticModelId is rejected.");
            const response = await getSemanticModelLinkedObjectTypes("", objectTypeId, projectId);
            allure.attachment("Response", JSON.stringify(response.json), "application/json");
            expect(response.statusCode).toBe(400);
            expect(response.json.errors.Id[0]).toBe("The Id field is required.");
        });
    
        it("17.3 Missing objectTypeId - Send a request without objectTypeId", async () => {
            allure.story("Missing objectTypeId");
            allure.description("This test ensures that a request without objectTypeId is rejected.");
            const response = await getSemanticModelLinkedObjectTypes(semanticModelId, "", projectId);
            allure.attachment("Response", JSON.stringify(response.json), "application/json");
            expect(response.statusCode).toBe(400);
            expect(response.json.errors.ObjectTypeId[0]).toBe("The ObjectTypeId field is required.");
        });
    });
    

  
});