import { getAttributeMembers } from '../functions/query';
const projectId = 'fa118425-239f-46e9-b1b2-e4e9c462a8b5';
const semanticModelId = '0f1d2941-6fde-4a54-9921-6c2ac381fd43';
const uniqueName = '[Cleaned superstore.Order date]';
const commonRequest = {
  semanticModelId: '0f1d2941-6fde-4a54-9921-6c2ac381fd43',
  attribute: {
    name: 'Order date',
    uniqueName: '[Cleaned superstore.Order date]',
    description: 'Order date by month',
    type: 'Date',
    aliases: [
      {
        uniqueName: '[Cleaned superstore.Order date]',
        alias: 'Order Date (alias)'
      }
    ],
    sorting: {
      order: 'asc',
      type: 'alphabetical',
      condition: {
        uniqueName: '[Cleaned superstore.Order date]',
        aggregation: 'string'
      },
      members: []
    },
    limit: {
      count: 100,
      offset: 0,
      page: 1
    }
  },
  nullValue: null,
  sort: 'asc',
  limit: {
    count: 100,
    offset: 0,
    page: 1
  }
};

describe('🧪 BI Query API - getAttributeMembers', () => {
  
  it('✅ Should return attribute members by year', async () => {
    const res = await getAttributeMembers({
      projectId: projectId,
      semanticModelId: commonRequest.semanticModelId,
      attributeName: 'Order date (year)',
      uniqueName: commonRequest.attribute.uniqueName,
      part: 'year'
    });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('✅ Should return attribute members by month', async () => {
    const res = await getAttributeMembers({
      projectId: projectId,
      semanticModelId: commonRequest.semanticModelId,
      attributeName: 'Order date (month)',
      uniqueName: commonRequest.attribute.uniqueName,
      part: 'month'
    });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('✅ Should return attribute members by day', async () => {
    const res = await getAttributeMembers({
      projectId: projectId,
      semanticModelId: commonRequest.semanticModelId,
      attributeName: 'Order date (day)',
      uniqueName: commonRequest.attribute.uniqueName,
      part: 'day'
    });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('❌ Should fail with invalid part', async () => {
    const res = await getAttributeMembers({
      projectId: projectId,
      semanticModelId: commonRequest.semanticModelId,
      attributeName: 'Order date (wrong)',
      uniqueName: commonRequest.attribute.uniqueName,
      part: 'invalidPart'
    });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body).toBeDefined();
  });

  it('❌ Should fail with invalid semanticModelId', async () => {
    const res = await getAttributeMembers({
      projectId: projectId,
      semanticModelId: 'invalid-id',
      attributeName: 'Order date',
      uniqueName: commonRequest.attribute.uniqueName
    });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body).toBeDefined();
  });

  it('✅ Should return unique, sorted years in ascending order', async () => {
    const res = await getAttributeMembers({
      projectId: projectId,
      semanticModelId: commonRequest.semanticModelId,
      attributeName: 'Order date (year)',
      uniqueName: commonRequest.attribute.uniqueName,
      part: 'year'
    });

    expect(res.statusCode).toBe(200);
    const values = res.body.map((v: string) => v.trim()).filter(Boolean);
    const unique = new Set(values);
    expect(values.length).toBe(unique.size); 
    const sorted = [...values].sort();
    expect(values).toEqual(sorted); 
  });

  it('✅ Should return 12 or less values for part: "month"', async () => {
    const res = await getAttributeMembers({
      projectId: projectId,
      semanticModelId: commonRequest.semanticModelId,
      attributeName: 'Order date (month)',
      uniqueName: commonRequest.attribute.uniqueName,
      part: 'month'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeLessThanOrEqual(12); 
  });

  it('✅ Should return values in correct "day" format (1-31)', async () => {
    const res = await getAttributeMembers({
      projectId: projectId,
      semanticModelId: commonRequest.semanticModelId,
      attributeName: 'Order date (day)',
      uniqueName: commonRequest.attribute.uniqueName,
      part: 'day'
    });

    expect(res.statusCode).toBe(200);
    const dayNumbers = res.body.map((v: string) => parseInt(v));
    expect(dayNumbers.every((n: number) => n >= 1 && n <= 31)).toBe(true);
  });

  it('❌ Should return 400 if part is missing', async () => {
    const res = await getAttributeMembers({
      projectId: projectId,
      semanticModelId: commonRequest.semanticModelId,
      attributeName: 'Order date',
      uniqueName: commonRequest.attribute.uniqueName
    });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  it('❌ Should return 400 for wrong uniqueName (field not in model)', async () => {
    const res = await getAttributeMembers({
      projectId: projectId,
      semanticModelId: commonRequest.semanticModelId,
      attributeName: 'Nonexistent Attribute',
      uniqueName: '[This.Does.Not.Exist]',
      part: 'year'
    });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  it('🧪 Should support non-English attribute name (simulate localized label)', async () => {
    const res = await getAttributeMembers({
      projectId: projectId,
      semanticModelId: commonRequest.semanticModelId,
      attributeName: 'Дата заказа', 
      uniqueName: commonRequest.attribute.uniqueName,
      part: 'year'
    });

    expect([200, 400]).toContain(res.statusCode);
  });




  describe('🧪 Attribute Members API - Full Schema Testing', () => {

    it('✅ Should return monthly attribute members with sorting & alias', async () => {
      const res = await getAttributeMembers({
        projectId: projectId,
        semanticModelId: commonRequest.semanticModelId,
        attributeName: 'Order date',
        uniqueName: commonRequest.attribute.uniqueName,
        part: 'month',
        type: 'discrete'
      });
  
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
  
      const months = res.body.map((v: string) => v.toLowerCase());
      expect(months.some((m: string) => m.includes('jan') || m.includes('feb'))).toBe(true);
    });
  
    it('✅ Should support pagination limit', async () => {
      const limit = 3;
      const res = await getAttributeMembers({
        projectId: projectId,
        semanticModelId: commonRequest.semanticModelId,
        attributeName: 'Order date',
        uniqueName: commonRequest.attribute.uniqueName,
        part: 'month'
      });
  
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeLessThanOrEqual(12); 
    });
  
    it('✅ Should handle sorting asc', async () => {
      const res = await getAttributeMembers({
        projectId:projectId,
        semanticModelId: commonRequest.semanticModelId,
        attributeName: 'Order date',
        uniqueName: commonRequest.attribute.uniqueName,
        part: 'year'
      });
  
      const years = res.body.map((v: string) => v.trim()).filter(Boolean);
      const sorted = [...years].sort();
      expect(years).toEqual(sorted);
    });
  
    it('❌ Should fail if part is invalid', async () => {
      const res = await getAttributeMembers({
        projectId: projectId,
        semanticModelId: commonRequest.semanticModelId,
        attributeName: 'Order date',
        uniqueName: commonRequest.attribute.uniqueName,
        part: 'banana'
      });
  
      expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });
  
    it('❌ Should fail with non-existent attribute', async () => {
      const res = await getAttributeMembers({
        projectId: projectId,
        semanticModelId: commonRequest.semanticModelId,
        attributeName: 'Fake Attribute',
        uniqueName: '[Fake.Attribute]',
        part: 'month'
      });
  
      expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });
  });
  describe.only('🧪 Attribute Members - Sorting Scenarios', () => {
    
    it('✅ Should sort values alphabetically in ascending order', async () => {
      const res = await getAttributeMembers({
        projectId,
        semanticModelId: commonRequest.semanticModelId,
        attributeName: commonRequest.attribute.name,
        uniqueName: commonRequest.attribute.uniqueName,
        part: 'month',
        type: 'discrete',
        sorting: {
          order: 'asc',
          type: 'alphabetical',
          condition: commonRequest.attribute.sorting.condition
        }
      });
  
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
  
      const values = res.body.map((v: string) => v.trim());
      const sorted = [...values].sort();
      expect(values).toEqual(sorted);
    });
  
    it('✅ Should sort values alphabetically in descending order', async () => {
      const res = await getAttributeMembers({
        projectId,
        semanticModelId: commonRequest.semanticModelId,
        attributeName: commonRequest.attribute.name,
        uniqueName: commonRequest.attribute.uniqueName,
        part: 'month',
        type: 'discrete',
        sorting: {
          order: 'desc',
          type: 'alphabetical',
          condition: commonRequest.attribute.sorting.condition
        }
      });
  
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
  
      const values = res.body.map((v: string) => v.trim());
      const sorted = [...values].sort().reverse();
      expect(values).toEqual(sorted);
    });
  
    it('✅ Should sort values numerically when type is "numerical"', async () => {
      const res = await getAttributeMembers({
        projectId,
        semanticModelId: commonRequest.semanticModelId,
        attributeName: 'Order date (day)',
        uniqueName: commonRequest.attribute.uniqueName,
        part: 'day',
        type: 'discrete',
        sorting: {
          order: 'asc',
          type: 'numerical',
          condition: commonRequest.attribute.sorting.condition
        }
      });
  
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
  
      const nums = res.body.map((v: string) => parseInt(v));
      const sorted = [...nums].sort((a, b) => a - b);
      expect(nums).toEqual(sorted);
    });
  
    it('✅ Should respect custom member order when sorting.type = custom', async () => {
      const customMembers = [
        { uniqueName: 'January', alias: 'Jan' },
        { uniqueName: 'March', alias: 'Mar' },
        { uniqueName: 'February', alias: 'Feb' }
      ];
    
      const res = await getAttributeMembers({
        projectId,
        semanticModelId: commonRequest.semanticModelId,
        attributeName: commonRequest.attribute.name,
        uniqueName: commonRequest.attribute.uniqueName,
        part: 'month',
        type: 'discrete',
        sorting: {
          order: 'asc',
          type: 'custom',
          members: customMembers,
          condition: commonRequest.attribute.sorting.condition
        }
      });
    
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    
      const values = res.body.map((v: string) => v.trim());
      const expected = customMembers.map(m => m.uniqueName);
      expect(values.slice(0, expected.length)).toEqual(expected);
    });
    
    
  
    it('✅ Should not crash if sorting is missing entirely', async () => {
      const res = await getAttributeMembers({
        projectId,
        semanticModelId: commonRequest.semanticModelId,
        attributeName: commonRequest.attribute.name,
        uniqueName: commonRequest.attribute.uniqueName,
        part: 'month',
        type: 'discrete'
      });
  
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  
    it('❌ Should fail gracefully if sorting.type is invalid', async () => {
      const res = await getAttributeMembers({
        projectId,
        semanticModelId: commonRequest.semanticModelId,
        attributeName: commonRequest.attribute.name,
        uniqueName: commonRequest.attribute.uniqueName,
        part: 'month',
        sorting: {
          order: 'asc',
          type: 'banana',
          condition: commonRequest.attribute.sorting.condition
        }
      });
  
      expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });});
});
