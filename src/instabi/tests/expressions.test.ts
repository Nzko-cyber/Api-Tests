import { validateExpression } from '../functions/expressions'; // путь может отличаться

const projectId = 'fa118425-239f-46e9-b1b2-e4e9c462a8b5';
const semanticModelId = '0f1d2941-6fde-4a54-9921-6c2ac381fd43';

describe('BI :: Expression Validation :: DatePart Tests', () => {

  it('✅ Valid DatePart by year (basic)', async () => {
    const res = await validateExpression({
      projectId,
      semanticModelId,
      expression: `DatePart('year', [Cleaned superstore.Order date])`
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.dataType).toBe('Number');
  });

  it('✅ Valid DatePart by month with spaces', async () => {
    const res = await validateExpression({
      projectId,
      semanticModelId,
      expression: `DatePart(" month ", [Cleaned superstore.Order date])`
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('✅ Case-insensitive part: "YeAr"', async () => {
    const res = await validateExpression({
      projectId,
      semanticModelId,
      expression: `DatePart("YeAr", [Cleaned superstore.Order date])`
    });
    expect(res.body.success).toBe(true);
  });

  it('❌ Invalid part keyword', async () => {
    const res = await validateExpression({
      projectId,
      semanticModelId,
      expression: `DatePart("yeet", [Cleaned superstore.Order date])`
    });
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBeDefined();
  });

  it('❌ Invalid expression syntax', async () => {
    const res = await validateExpression({
      projectId,
      semanticModelId,
      expression: `DatePart("year" [Cleaned superstore.Order date])` // missing comma
    });
    expect(res.body.success).toBe(false);
  });

  it('❌ Missing field reference', async () => {
    const res = await validateExpression({
      projectId,
      semanticModelId,
      expression: `DatePart("month", )`
    });
    expect(res.body.success).toBe(false);
  });

  it('✅ Quoted field with escaped bracket', async () => {
    const res = await validateExpression({
      projectId,
      semanticModelId,
      expression: `DatePart("year", [Cleaned superstore.Order date])`
    });
    expect(res.body.success).toBe(true);
  });

const projectId = 'fa118425-239f-46e9-b1b2-e4e9c462a8b5';
const semanticModelId = '0f1d2941-6fde-4a54-9921-6c2ac381fd43';

describe('BI :: Expression Validation :: Extended DatePart Tests', () => {
  
  // ✅ VALID DatePart units
  const validParts = ['quarter', 'day', 'week', 'hour'];
  validParts.forEach((part) => {
    it(`✅ Should validate DatePart("${part}")`, async () => {
      const res = await validateExpression({
        projectId,
        semanticModelId,
        expression: `DatePart("${part}", [Cleaned superstore.Order date])`
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.dataType).toBe('Number');
    });
  });

  // ❌ Edge Cases — Invalid values
  it('❌ Should fail on DatePart(null)', async () => {
    const res = await validateExpression({
      projectId,
      semanticModelId,
      expression: `DatePart(null, [Cleaned superstore.Order date])`
    });
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBeDefined();
  });

  it('❌ Should fail on DatePart(0)', async () => {
    const res = await validateExpression({
      projectId,
      semanticModelId,
      expression: `DatePart(0, [Cleaned superstore.Order date])`
    });
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBeDefined();
  });

  it('❌ Should fail on DatePart(random string)', async () => {
    const res = await validateExpression({
      projectId,
      semanticModelId,
      expression: `DatePart("fancyStuff", [Cleaned superstore.Order date])`
    });
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBeDefined();
  });

  // ❌ Using a field from a different model (invalid semantic reference)
  it('❌ Should fail with field from unrelated model', async () => {
    const res = await validateExpression({
      projectId,
      semanticModelId,
      expression: `DatePart("year", [SalesData.OrderDate])`
    });
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBeDefined();
  });

});


});
