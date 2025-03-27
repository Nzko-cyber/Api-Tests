import { deleteSemanticModel, getSemanticModel, postSemanticModel, updateSemanticModel } from "../functions/SMD_util";
import { mockSemanticModelPostRequest, mockSemanticModelPutRequest } from "../mockData";

const projectId = "fa118425-239f-46e9-b1b2-e4e9c462a8b5";
let smdId: string;

describe("Semantic Model API Test Suite", () => {

    it("1. Create a new Semantic Model - Verify successful creation", async () => {
        allure.feature("Semantic Model");
        allure.story("Create");
        allure.description("Creates a new Semantic Model and verifies if ID is returned.");

        const response = await postSemanticModel(mockSemanticModelPostRequest);
        allure.attachment("Post Request Payload", JSON.stringify(mockSemanticModelPostRequest), 'application/json');
        allure.attachment("Response", JSON.stringify(response.json), 'application/json');

        expect(response.statusCode).toBe(200);
        expect(response.json).toBeDefined();
        smdId = response.json;
    });

    it("2. Update the created Semantic Model - Verify update is successful", async () => {
        allure.story("Update");
        allure.description("Updates the previously created Semantic Model.");

        mockSemanticModelPutRequest.id = smdId;
        const response = await updateSemanticModel(mockSemanticModelPutRequest);
        allure.attachment("Put Request Payload", JSON.stringify(mockSemanticModelPutRequest), 'application/json');
        expect(response.statusCode).toBe(204);
    });

    it("3. Retrieve the updated Semantic Model - Verify response schema and values", async () => {
        allure.story("Get");
        allure.description("Retrieves the updated Semantic Model and verifies all expected properties.");

        const response = await getSemanticModel(smdId, projectId);
        allure.attachment("Get Response", JSON.stringify(response.json), 'application/json');

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
        allure.story("Delete");
        allure.description("Deletes the Semantic Model and verifies it is no longer accessible.");

        const response = await deleteSemanticModel(smdId, projectId);
        expect(response.statusCode).toBe(204);

        const getResponse = await getSemanticModel(smdId, projectId);
        allure.attachment("Get After Deletion", JSON.stringify(getResponse.json), 'application/json');
        expect(getResponse.statusCode).toBe(400);
    });

});
