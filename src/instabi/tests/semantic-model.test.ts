import pactum from 'pactum';
import { getSemanticModel } from '../functions/semantic-model';

describe('API Tests for fetching Semantic Model', () => {

    const validSemanticModelId = '0f1d2941-6fde-4a54-9921-6c2ac381fd43';
    const validProjectId = 'fa118425-239f-46e9-b1b2-e4e9c462a8b5';

    it('should successfully fetch the semantic model with valid parameters', async () => {
        const response = await getSemanticModel(validSemanticModelId, validProjectId);
        expect(response.statusCode).toBe(200); 
        expect(response.body).toHaveProperty('id', validSemanticModelId);
    });

    it('should return 400 if SemanticModelId is missing', async () => {
        const response = await getSemanticModel('', validProjectId);
        expect(response.statusCode).toBe(400); 
    });

    it('should return 400 if ProjectId is missing', async () => {
        const response = await getSemanticModel(validSemanticModelId, '');
        expect(response.statusCode).toBe(400); 
    });

    it('should return 400 if SemanticModelId is invalid', async () => {
        const invalidSemanticModelId = 'invalid-id';
        const response = await getSemanticModel(invalidSemanticModelId, validProjectId);
        expect(response.statusCode).toBe(400); 
    });

    it('should return 400 if ProjectId is invalid', async () => {
        const invalidProjectId = 'invalid-project-id';
        const response = await getSemanticModel(validSemanticModelId, invalidProjectId);
        expect(response.statusCode).toBe(400); 
    });

    it('should return 400 for server errors', async () => {
        const response = await getSemanticModel('invalid-id', 'fa118425-239f-46e9-b1b2-e4e9c462a8b5');
        expect(response.statusCode).toBe(400); 
    });
});
