import {spec} from 'pactum';
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { createLinkType,updateLinkType,deleteLinkType,getLinkType,getLinkTypesByObjectTypeId,getLinkTypesWithPagination } from '../functions/ontology-linktype';

const ajv = new Ajv();
addFormats(ajv);

const linkTypeSchema = {
    type: "object",
    required: ["id", "name", "description", "namespaceId", "left", "right", "createdAt"],
    properties: {
        id: {type: "string", format: "uuid"},
        name: {type: "string"},
        description: {type: "string"},
        namespaceId: {type: "string", format: "uuid"},
        left: {
            type: "object",
            required: ["objectTypeId", "propertyTypeId", "cardinality", "name", "pluralName", "visibility"],
            properties: {
                objectTypeId: {type: "string", format: "uuid"},
                objectType: {type: ["null", "object"]},
                propertyTypeId: {type: "string", format: "uuid"},
                propertyType: {type: ["null", "object"]},
                cardinality: {type: "string", enum: ["One", "Many"]},
                name: {type: "string"},
                pluralName: {type: "string"},
                visibility: {type: "string", enum: ["Normal", "Hidden", "Prominent"]},
            }
        },
        right: {
            type: "object",
            required: ["objectTypeId", "propertyTypeId", "cardinality", "name", "pluralName", "visibility"],
            properties: {
                objectTypeId: {type: "string", format: "uuid"},
                objectType: {type: ["null", "object"]},
                propertyTypeId: {type: "string", format: "uuid"},
                propertyType: {type: ["null", "object"]},
                cardinality: {type: "string", enum: ["One", "Many"]},
                name: {type: "string"},
                pluralName: {type: "string"},
                visibility: {type: "string", enum: ["Normal", "Hidden", "Prominent"]},
            }
        },
        createdAt: {type: "string", format: "date-time"},
        createdBy: {type: ["null", "string"]},
        lastModifiedAt: {type: "string", format: "date-time"},
        lastModifiedBy: {type: ["null", "string"]},
    }
};

const postMockData = {
    name: "Test Linktype",
    description: "string string",
    left: {
        name: "Left",
        pluralName: "Lefts",
        objectTypeId: "415d423b-95a1-45a6-b1f0-197923b29b70",
        propertyTypeId: "90a5914b-758b-4724-81b4-25ddd6a5e8a7",
        cardinality: "One",
    },
    right: {
        name: "Right",
        pluralName: "Rights",
        objectTypeId: "1dc9fbe4-91a7-4f4a-b804-c1d7cb9f9e5f",
        propertyTypeId: "ce5a22bc-b587-4f4d-bc21-518e11f63f41",
        cardinality: "Many",
    }
}

const putMockData = {
    id: '',
    name: "Test Linktype",
    description: "string string",
    left: {
        name: "Right",
        pluralName: "Rights",
        objectTypeId: "90a5914b-758b-4724-81b4-25ddd6a5e8a7",
        propertyTypeId: "e8556fcb-5940-401d-b7a1-a9765fee1f2c",
        cardinality: "Many",
    },
    right: {
        name: "Left",
        pluralName: "Lefts",
        objectTypeId: "1dc9fbe4-91a7-4f4a-b804-c1d7cb9f9e5f",
        propertyTypeId: "d05937c4-f51f-4403-b0d8-39cccc37f77b",
        cardinality: "One",
    }
}


describe(" ONTOLOGY::LINKTYPE", () => {
    beforeEach(() => {
        allure.epic("Ontology");
        allure.feature("Linktype API Tests");
        allure.owner("QA Team");
    });
describe("LinkType API Test Suite", () => {
    allure.feature("LinkType Createion");
    test("1.1 Create a new LinkType - Verify successful creation", async () => {
    
        allure.story("Create LinkType");
        allure.description("Create a new LinkType and store the ID for further steps.");

        const response = await createLinkType(postMockData);
        putMockData.id = response.json;

        allure.parameter("HTTP Status", response.statusCode);
        allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
    });

    test("1.2. Retrieve LinkType - Validate schema and response data", async () => {
    
        allure.story("Get LinkType");
        allure.description("Retrieve a LinkType and validate against expected JSON schema.");

        const response = await getLinkType(putMockData.id);

        allure.parameter("LinkType ID", putMockData.id);
        allure.parameter("HTTP Status", response.statusCode);
        allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();

        const validate = ajv.compile(linkTypeSchema);
        const isValid = validate(response.body);
        expect(isValid).toBe(true);

        // Matching values
        expect(response.body.id).toBe(putMockData.id);
        expect(response.body.name).toBe(postMockData.name);
        expect(response.body.description).toBe(postMockData.description);
    });

    test("1.3. Update the LinkType - Verify update is successful", async () => {
    
        allure.story("Update LinkType");
        allure.description("Update LinkType using new values and validate status.");

        const response = await updateLinkType(putMockData);

        allure.parameter("LinkType ID", putMockData.id);
        allure.parameter("HTTP Status", response.statusCode);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
    });

    test("1.4. Retrieve updated LinkType - Validate schema and updated values", async () => {
    
        allure.story("Get Updated LinkType");
        allure.description("Validate updated LinkType fields and ensure schema matches.");

        const response = await getLinkType(putMockData.id);

        allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });
        allure.parameter("HTTP Status", response.statusCode);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();

        const validate = ajv.compile(linkTypeSchema);
        const isValid = validate(response.body);
        expect(isValid).toBe(true);
    });

    test("1.5. Delete the LinkType - Verify deletion is successful", async () => {
    
        allure.story("Delete LinkType");
        allure.description("Delete the LinkType and ensure deletion is successful.");

        const response = await deleteLinkType(putMockData.id);

        allure.parameter("LinkType ID", putMockData.id);
        allure.parameter("HTTP Status", response.statusCode);
        allure.attachment("Response Body", response.body, { contentType: allure.ContentType.JSON });

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
    });

    test("1.6. Retrieve LinkType after deletion - Verify it no longer exists", async () => {
    
        allure.story("Get Deleted LinkType");
        allure.description("Ensure that deleted LinkType cannot be fetched.");

        const response = await getLinkType(putMockData.id);

        allure.parameter("LinkType ID", putMockData.id);
        allure.parameter("HTTP Status", response.statusCode);

        expect(response.statusCode).toBe(204);
        expect(response.body).toBeDefined();
    });
});
describe("Test Suite: Retrieving Paginated LinkTypes", () => {
    allure.feature("LinkType Retrieval");

    test("2.1 Valid Request - Get default paginated link types", async () => {
        allure.feature("LinkType Pagination");
        allure.story("Default pagination");
        allure.description("Fetch first page of link types with default pagination params.");

        const response = await getLinkTypesWithPagination();

        allure.attachment("Response Body", response.json, { contentType: allure.ContentType.JSON });
        allure.parameter("HTTP Status", response.statusCode);

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.items).toBeInstanceOf(Array);
        expect(response.json.items.length).toBeGreaterThan(0);
    });

    test("2.2 With Specific Relations - Get link types filtered by relation type", async () => {
        allure.feature("LinkType Pagination");
        allure.story("Filter by relation types");

        const response = await getLinkTypesWithPagination(["OneToOne", "ManyToMany", "OneToMany", "ManyToOne"]);

        allure.attachment("Response Body", response.json, { contentType: allure.ContentType.JSON });

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.items).toBeInstanceOf(Array);
    });

    test("2.3 With Search Term - Get filtered link types", async () => {
        allure.feature("LinkType Pagination");
        allure.story("Search");

        const response = await getLinkTypesWithPagination([], 1, 20, "Test");

        allure.attachment("Response Body", response.json, { contentType: allure.ContentType.JSON });

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.items).toBeInstanceOf(Array);
    });

    test("2.4 Custom Page & Size - Get paginated link types with page=2 & size=10", async () => {
        allure.feature("LinkType Pagination");
        allure.story("Custom page & size");

        const response = await getLinkTypesWithPagination([], 2, 10);

        allure.parameter("Page", 2);
        allure.parameter("PageSize", 10);
        allure.attachment("Response Body", response.json, { contentType: allure.ContentType.JSON });

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.items).toBeInstanceOf(Array);
    });

    test("2.5 Empty Response Scenario - Search for a non-existent link type", async () => {
        allure.feature("LinkType Pagination");
        allure.story("Search with no results");

        const response = await getLinkTypesWithPagination([], 1, 20, "NonExistentName_qwgdbauyhgoibqw");

        allure.attachment("Response Body", response.json, { contentType: allure.ContentType.JSON });

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.items.length).toBe(0);
    });
});
describe("Test Suite: Retrieving LinkTypes by ObjectTypeId", () => {
     allure.feature("LinkType Retrieving by ObjectType");
    test("3.1 Valid Request - Get link types by valid objectTypeId", async () => {
        allure.feature("LinkType by ObjectType");
        allure.story("Valid objectTypeId");

        const objectTypeId = "415d423b-95a1-45a6-b1f0-197923b29b70";
        const response = await getLinkTypesByObjectTypeId(objectTypeId);

        allure.parameter("ObjectType ID", objectTypeId);
        allure.attachment("Response Body", response.json, { contentType: allure.ContentType.JSON });

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
    });

    test("3.2 Missing ObjectTypeId - Send request without objectTypeId", async () => {
        allure.feature("LinkType by ObjectType");
        allure.story("Missing objectTypeId");

        const response = await getLinkTypesByObjectTypeId("");

        allure.attachment("Response Body", response.json, { contentType: allure.ContentType.JSON });

        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
    });

    test("3.3 Invalid ObjectTypeId - Send request with an invalid objectTypeId", async () => {
        allure.feature("LinkType by ObjectType");
        allure.story("Invalid objectTypeId");

        const response = await getLinkTypesByObjectTypeId("InvalidObjectTypeId");

        allure.parameter("ObjectType ID", "InvalidObjectTypeId");
        allure.attachment("Response Body", response.json, { contentType: allure.ContentType.JSON });

        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
    });
});
});