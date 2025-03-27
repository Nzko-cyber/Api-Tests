import {deleteSemanticModel, getSemanticModel, postSemanticModel, updateSemanticModel} from "./SMD_util";
import {mockSemanticModelPostRequest, mockSemanticModelPutRequest} from "./mockData";

const projectId = "fa118425-239f-46e9-b1b2-e4e9c462a8b5";
let smdId;


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
