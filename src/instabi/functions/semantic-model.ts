import pactum from 'pactum';

export async function getSemanticModel(semanticModelId: string, projectId: string) {
    try {
        const response = await pactum.spec()
            .get(`https://phoenix-dev.datamicron.com/api/bi/api/SemanticModel?SemanticModelId=${semanticModelId}`)
            .withHeaders({
                'ProjectId': projectId
            })
            .toss();

        if (!response) {
            console.error("❌ No response received");
            return { error: true, message: 'No response received' };
        }

        // Логирование для проверки ответа
        console.log("Response body:", response.body);
        console.log("Response status:", response.status);

        return response;
    } catch (error: any) {
        console.error("❌ Error fetching Semantic Model:", error);
        return { error: true, message: error.message, details: error };
    }
}
