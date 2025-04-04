import { validateExpression } from '../functions/expressions';

const projectId = 'fa118425-239f-46e9-b1b2-e4e9c462a8b5';
const semanticModelId = '0f1d2941-6fde-4a54-9921-6c2ac381fd43';

describe('BI :: String Functions - Concat & Contains', () => {

  describe('Function: Contains', () => {
    it('✅ Should return true when substring is present', async () => {
      const res = await validateExpression({
        projectId,
        semanticModelId,
        expression: `Contains("Superstore California", "California")`
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.dataType).toBe('Boolean');
    });

    it('✅ Should return false when substring is not present', async () => {
      const res = await validateExpression({
        projectId,
        semanticModelId,
        expression: `Contains("Superstore California", "Texas")`
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.dataType).toBe('Boolean');
    });

    it('❌ Should fail with number as substring input', async () => {
      const res = await validateExpression({
        projectId,
        semanticModelId,
        expression: `Contains("Test", 123)`
      });
      expect(res.body.success).toBe(false);
    });

    it('❌ Should fail with null input', async () => {
      const res = await validateExpression({
        projectId,
        semanticModelId,
        expression: `Contains(null, "A")`
      });
      expect(res.body.success).toBe(false);
    });
  });

  // ✅ CONCAT
  describe('Function: Concat', () => {
    it('✅ Should concat two strings', async () => {
      const res = await validateExpression({
        projectId,
        semanticModelId,
        expression: `Concat("Hello, ", "World!")`
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.dataType).toBe('String');
    });

    it('✅ Should concat string and number (auto-cast)', async () => {
      const res = await validateExpression({
        projectId,
        semanticModelId,
        expression: `Concat("Total: ", 100)`
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.dataType).toBe('String');
    });

    it('✅ Should concat field and string', async () => {
      const res = await validateExpression({
        projectId,
        semanticModelId,
        expression: `Concat([Cleaned superstore.City], " - City")`
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.dataType).toBe('String');
    });

    it('❌ Should fail with missing parameter', async () => {
      const res = await validateExpression({
        projectId,
        semanticModelId,
        expression: `Concat("OnlyOneArg")`
      });
      expect(res.body.success).toBe(false);
    });

    it('❌ Should fail with unsupported type (array)', async () => {
      const res = await validateExpression({
        projectId,
        semanticModelId,
        expression: `Concat(["One", "Two"], "Three")`
      });
      expect(res.body.success).toBe(false);
    });
  });

});
