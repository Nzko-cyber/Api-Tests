import pactum from 'pactum';

const BASE_URL = 'https://phoenix-dev.datamicron.com/api/bi/api/Query/getAttributeMembers';

export async function getAttributeMembers({
  projectId,
  semanticModelId,
  attributeName,
  uniqueName,
  part = 'year',
  type = 'discrete'
}: {
  projectId: string;
  semanticModelId: string;
  attributeName: string;
  uniqueName: string;
  part?: 'year' | 'month' | 'day' | string;
  type?: 'discrete' | 'continuous' | string;
}) {
  try {
    const response = await pactum.spec()
      .post(BASE_URL)
      .withHeaders({
        'ProjectId': projectId,
        'Content-Type': 'application/json-patch+json'
      })
      .withJson({
        semanticModelId,
        attribute: {
          name: attributeName,
          uniqueName: uniqueName,
          description: null,
          type: 'Date'
        },
        definition: {
          type: 'dateTimeGranularity',
          dateTimeGranularity: {
            type,
            part
          }
        }
      })
      .toss();

    console.log(`✅ Attribute members fetched:`, response.body);
    return response;
  } catch (error) {
    console.error('❌ Failed to fetch attribute members:', error);
    return { error: true, message: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
}
