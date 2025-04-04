import pactum from 'pactum';

const BASE_URL = 'https://phoenix-dev.datamicron.com/api/bi/api/Expression/validate';

export async function validateExpression({
  projectId,
  semanticModelId,
  expression
}: {
  projectId: string;
  semanticModelId: string;
  expression: string;
}) {
  try {
    const response = await pactum.spec()
      .post(BASE_URL)
      .withHeaders({
        'ProjectId': projectId,
        'Content-Type': 'application/json-patch+json'
      })
      .withJson({
        expression,
        semanticModelId
      })
      .toss();

    console.log('✅ Validated expression:', expression, '| Result:', response.body);
    return response;
  } catch (error) {
    console.error('❌ Error validating expression:', expression, error);
    return { error: true, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}
