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



describe("LinkType API Test Suite", () => {
    test("1. Create a new LinkType - Verify successful creation", async () => {
        const response = await createLinkType(postMockData);
        putMockData.id = response.json;
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
    });

    test("2. Retrieve LinkType - Validate schema and response data", async () => {
        const response = await getLinkType(putMockData.id);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();

        const validate = ajv.compile(linkTypeSchema);
        const isValid = validate(response.body);
        expect(isValid).toBe(true);

        expect(response.body.id).toBe(putMockData.id);
        expect(response.body.name).toBe(postMockData.name);
        expect(response.body.description).toBe(postMockData.description);

        expect(response.body.left.name).toBe(postMockData.left.name);
        expect(response.body.left.pluralName).toBe(postMockData.left.pluralName);
        expect(response.body.left.objectTypeId).toBe(postMockData.left.objectTypeId);
        expect(response.body.left.propertyTypeId).toBe(postMockData.left.propertyTypeId);
        expect(response.body.left.cardinality).toBe(postMockData.left.cardinality);

        expect(response.body.right.name).toBe(postMockData.right.name);
        expect(response.body.right.pluralName).toBe(postMockData.right.pluralName);
        expect(response.body.right.objectTypeId).toBe(postMockData.right.objectTypeId);
        expect(response.body.right.propertyTypeId).toBe(postMockData.right.propertyTypeId);
        expect(response.body.right.cardinality).toBe(postMockData.right.cardinality);
    });

    test("3. Update the LinkType - Verify update is successful", async () => {
        const response = await updateLinkType(putMockData);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
    });

    test("4. Retrieve updated LinkType - Validate schema and updated values", async () => {
        const response = await getLinkType(putMockData.id);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();

        const validate = ajv.compile(linkTypeSchema);
        const isValid = validate(response.body);
        expect(isValid).toBe(true);

        expect(response.body.id).toBe(putMockData.id);
        expect(response.body.name).toBe(putMockData.name);
        expect(response.body.description).toBe(putMockData.description);

        expect(response.body.left.name).toBe(putMockData.left.name);
        expect(response.body.left.pluralName).toBe(putMockData.left.pluralName);
        expect(response.body.left.objectTypeId).toBe(putMockData.left.objectTypeId);
        expect(response.body.left.propertyTypeId).toBe(putMockData.left.propertyTypeId);
        expect(response.body.left.cardinality).toBe(putMockData.left.cardinality);

        expect(response.body.right.name).toBe(putMockData.right.name);
        expect(response.body.right.pluralName).toBe(putMockData.right.pluralName);
        expect(response.body.right.objectTypeId).toBe(putMockData.right.objectTypeId);
        expect(response.body.right.propertyTypeId).toBe(putMockData.right.propertyTypeId);
        expect(response.body.right.cardinality).toBe(putMockData.right.cardinality);
    });

    test("5. Delete the LinkType - Verify deletion is successful", async () => {
        const response = await deleteLinkType(putMockData.id);
        console.log(response.json);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
    });

    test("6. Retrieve LinkType after deletion - Verify it no longer exists", async () => {
        const response = await getLinkType(putMockData.id);
        expect(response.statusCode).toBe(204);
        expect(response.body).toBeDefined();
    });
});


describe("Test Suite: Retrieving Paginated LinkTypes", () => {

    test("2.1 Valid Request - Get default paginated link types", async () => {
        const response = await getLinkTypesWithPagination();

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.items).toBeInstanceOf(Array);
        expect(response.json.items.length).toBeGreaterThan(0);
    });

    test("2.2 With Specific Relations - Get link types filtered by relation type", async () => {
        const response = await getLinkTypesWithPagination(["OneToOne", "ManyToMany", "OneToMany", "ManyToOne"]);

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.items).toBeInstanceOf(Array);
    });

    test("2.3 With Search Term - Get filtered link types", async () => {
        const response = await getLinkTypesWithPagination([], 1, 20, "Test");

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.items).toBeInstanceOf(Array);
    });

    test("2.4 Custom Page & Size - Get paginated link types with page=2 & size=10", async () => {
        const response = await getLinkTypesWithPagination([], 2, 10);

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.items).toBeInstanceOf(Array);
    });

    test("2.5 Empty Response Scenario - Search for a non-existent link type", async () => {
        const response = await getLinkTypesWithPagination([], 1, 20, "NonExistentName_qwgdbauyhgoibqw");

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        expect(response.json.items.length).toBe(0);
    });

});


describe("Test Suite: Retrieving LinkTypes by ObjectTypeId", () => {

    test("3.1 Valid Request - Get link types by valid objectTypeId", async () => {
        const objectTypeId = "415d423b-95a1-45a6-b1f0-197923b29b70"; // Replace with a valid objectTypeId
        const response = await getLinkTypesByObjectTypeId(objectTypeId);
        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
    });

    test("3.2 Missing ObjectTypeId - Send request without objectTypeId", async () => {
        const response = await getLinkTypesByObjectTypeId("");
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
    });

    test("3.3 Invalid ObjectTypeId - Send request with an invalid objectTypeId", async () => {
        const response = await getLinkTypesByObjectTypeId("InvalidObjectTypeId");
        expect(response.statusCode).toBe(400);
        expect(response.json.errors).toBeDefined();
    });
});

