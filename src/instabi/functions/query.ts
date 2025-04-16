import pactum from 'pactum';
import { AttributeMemberRequest } from '../analysisInterface';

const BASE_URL = 'https://phoenix-dev.datamicron.com/api/bi/api/Query/getAttributeMembers';

export async function getAttributeMembers({
  projectId,
  semanticModelId,
  attributeName,
  uniqueName,
  part = 'year',
  type = 'discrete',
  sorting,
  limit
}: AttributeMemberRequest) {
  try {
    let normalizedSorting: any = undefined;

    if (sorting) {
      if (sorting.type === 'custom') {
        normalizedSorting = {
          order: sorting.order,
          type: sorting.type,
          members: sorting.members,
          condition: sorting.condition
        };
      } else {
        normalizedSorting = {
          order: sorting.order,
          type: sorting.type
        };
      }
    }

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
          uniqueName,
          description: null,
          type: 'Date',
          ...(normalizedSorting && { sorting: normalizedSorting }),
          ...(limit && { limit })
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
    return {
      error: true,
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}
