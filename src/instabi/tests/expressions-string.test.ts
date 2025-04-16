import { validateExpression } from '../functions/expressions';

const projectId = 'fa118425-239f-46e9-b1b2-e4e9c462a8b5';
const semanticModelId = '0f1d2941-6fde-4a54-9921-6c2ac381fd43';

describe('BI :: String Functions', () => {

  // describe('Function: Contains', () => {
  //   it('✅ Should return true when substring is present', async () => {
  //     const res = await validateExpression({
  //       projectId,
  //       semanticModelId,
  //       expression: `Contains("Superstore California", "California")`
  //     });
  //     expect(res.statusCode).toBe(200);
  //     expect(res.body.success).toBe(true);
  //     expect(res.body.dataType).toBe('Boolean');
  //   });

  //   it('✅ Should return false when substring is not present', async () => {
  //     const res = await validateExpression({
  //       projectId,
  //       semanticModelId,
  //       expression: `Contains("Superstore California", "Texas")`
  //     });
  //     expect(res.statusCode).toBe(200);
  //     expect(res.body.success).toBe(true);
  //     expect(res.body.dataType).toBe('Boolean');
  //   });

  //   it('❌ Should fail with number as substring input', async () => {
  //     const res = await validateExpression({
  //       projectId,
  //       semanticModelId,
  //       expression: `Contains("Test", 123)`
  //     });
  //     expect(res.body.success).toBe(false);
  //   });

  //   it('❌ Should fail with null input', async () => {
  //     const res = await validateExpression({
  //       projectId,
  //       semanticModelId,
  //       expression: `Contains(null, "A")`
  //     });
  //     expect(res.body.success).toBe(false);
  //   });
  // });

  // describe('Function: Concat', () => {
  //   it('✅ Should concat two stingrs', async () => {
  //     const res = await validateExpression({
  //       projectId,
  //       semanticModelId,
  //       expression: `Concat("Hello, ", "World!")`
  //     });
  //     expect(res.statusCode).toBe(200);
  //     expect(res.body.success).toBe(true);
  //     expect(res.body.dataType).toBe('String');
  //   });

  //   it('✅ Should concat string and number (auto-cast)', async () => {
  //     const res = await validateExpression({
  //       projectId,
  //       semanticModelId,
  //       expression: `Concat("Total: ", 100)`
  //     });
  //     expect(res.statusCode).toBe(200);
  //     expect(res.body.success).toBe(true);
  //     expect(res.body.dataType).toBe('String');
  //   });

  //   it('✅ Should concat field and string', async () => {
  //     const res = await validateExpression({
  //       projectId,
  //       semanticModelId,
  //       expression: `Concat([Cleaned superstore.City], " - City")`
  //     });
  //     expect(res.statusCode).toBe(200);
  //     expect(res.body.success).toBe(true);
  //     expect(res.body.dataType).toBe('String');
  //   });

  //   it('❌ Should fail with missing parameter', async () => {
  //     const res = await validateExpression({
  //       projectId,
  //       semanticModelId,
  //       expression: `Concat("OnlyOneArg")`
  //     });
  //     expect(res.body.success).toBe(false);
  //   });

  //   it('❌ Should fail with unsupported type (array)', async () => {
  //     const res = await validateExpression({
  //       projectId,
  //       semanticModelId,
  //       expression: `Concat(["One", "Two"], "Three")`
  //     });
  //     expect(res.body.success).toBe(false);
  //   });
  // });

  // describe.only('Function: EndsWith', () => {
  //   it('✅ Should return true if string ends with substring using Product Name', async () => {
  //     const res = await validateExpression({
  //       projectId,
  //       semanticModelId,
  //       expression: `EndsWith([Product Name], "Pen")`
  //     });
  //     expect(res.statusCode).toBe(200);
  //     expect(res.body.success).toBe(true);
  //     expect(res.body.dataType).toBe('Boolean');
  //   });

  //   it('✅ Should return false if string does not end with substring', async () => {
  //     const res = await validateExpression({
  //       projectId,
  //       semanticModelId,
  //       expression: `EndsWith([Product Name], "Laptop")`
  //     });
  //     expect(res.body.success).toBe(true);
  //     expect(res.body.dataType).toBe('Boolean');
  //   });

  //   it('❌ Should fail with numeric parameters', async () => {
  //     const res = await validateExpression({
  //       projectId,
  //       semanticModelId,
  //       expression: `EndsWith(12345, 45)`
  //     });
  //     expect(res.body.success).toBe(false);
  //   });
  // });

  // describe.only('Function: Find', () => {
  //   it('✅ Should return index of substring in Product Name (1-based)', async () => {
  //     const res = await validateExpression({
  //       projectId,
  //       semanticModelId,
  //       expression: `Find("pen", [Product Name])`
  //     });
  //     expect(res.body.success).toBe(true);
  //     expect(res.body.dataType).toBe('Number');
  //   });

  //   it('✅ Should return 0 if substring is not found', async () => {
  //     const res = await validateExpression({
  //       projectId,
  //       semanticModelId,
  //       expression: `Find("banana", [Product Name])`
  //     });
  //     expect(res.body.success).toBe(true);
  //     expect(res.body.dataType).toBe('Number');
  //     expect(res.body.result).toBe(0); // should return 0 if not found
  //   });

  //   it('✅ Should return case-sensitive index', async () => {
  //     const res = await validateExpression({
  //       projectId,
  //       semanticModelId,
  //       expression: `Find("Pen", [Product Name])`
  //     });
  //     expect(res.body.success).toBe(true);
  //     expect(res.body.dataType).toBe('Number');
  //   });

  //   it('❌ Should fail with null input', async () => {
  //     const res = await validateExpression({
  //       projectId,
  //       semanticModelId,
  //       expression: `Find(null, [Product Name])`
  //     });
  //     expect(res.body.success).toBe(false);
  //   });
  // });
  describe('Function: FindNth', () => { // not implemented yet
    it('✅ Should return index of nth occurrence of substring in Product Name', async () => {
      const res = await validateExpression({
        projectId,
        semanticModelId,
        expression: `FindNth( [Cleaned superstore.Region],"East", 2)`
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.dataType).toBe('Number');
      expect(res.body.result).toBeGreaterThan(0); // Checking if it returns a valid index
    });

    it('✅ Should return 0 if nth occurrence is not found', async () => {
      const res = await validateExpression({
        projectId,
        semanticModelId,
        expression: `FindNth("apple", [Product Name], 3)`
      });
      expect(res.body.success).toBe(true);
      expect(res.body.dataType).toBe('Number');
      expect(res.body.result).toBe(0); // Should return 0 if the nth occurrence does not exist
    });

    it('❌ Should fail with negative n value', async () => {
      const res = await validateExpression({
        projectId,
        semanticModelId,
        expression: `FindNth("o", [Product Name], -1)`
      });
      expect(res.body.success).toBe(false); // Invalid n value
    });

    it('❌ Should fail with null input', async () => {
      const res = await validateExpression({
        projectId,
        semanticModelId,
        expression: `FindNth(null, [Product Name], 1)`
      });
      expect(res.body.success).toBe(false); // Should fail with null substring
    });
  });

  
  // describe('Function: Left', () => { //не понятно, что за функция
  //   it('✅ Should return left part of string with valid length', async () => {
  //     const res = await validateExpression({
  //       projectId,
  //       semanticModelId,
  //       expression: `Left([Cleaned superstore.Region], 4)`
  //     });
  //     expect(res.statusCode).toBe(200);
  //     expect(res.body.success).toBe(true);
  //     expect(res.body.dataType).toBe('String');
  //     expect(res.body.result).toHaveLength(4); 
  //   });

  //   it('✅ Should return the entire string if length is greater than string length', async () => {
  //     const res = await validateExpression({
  //       projectId,
  //       semanticModelId,
  //       expression: `Left([Product Name], 50)`
  //     });
  //     expect(res.body.success).toBe(true);
  //     expect(res.body.dataType).toBe('String');
  //     expect(res.body.result).toBeDefined();
  //   });

  //   it('❌ Should fail with non-numeric length', async () => {
  //     const res = await validateExpression({
  //       projectId,
  //       semanticModelId,
  //       expression: `Left([Product Name], "ten")`
  //     });
  //     expect(res.body.success).toBe(false); 
  //   });

  //   it('❌ Should fail with null input', async () => {
  //     const res = await validateExpression({
  //       projectId,
  //       semanticModelId,
  //       expression: `Left(null, 5)`
  //     });
  //     expect(res.body.success).toBe(false); 
  //   });

  // });

  describe('Function: Length', () => {
    it('✅ Should return the correct length of the string in Product Name', async () => {
      const res = await validateExpression({
        projectId,
        semanticModelId,
        expression: `Length([Cleaned superstore.Region])` 
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.dataType).toBe('Number');
      expect(res.body.result).toBeGreaterThan(0); 
    });

    it('✅ Should return length 0 for empty string in Product Name', async () => {
      const res = await validateExpression({
        projectId,
        semanticModelId,
        expression: `Length("")` 
      });
      expect(res.body.success).toBe(true);
      expect(res.body.dataType).toBe('Number');
      expect(res.body.result).toBe(0); 
    });

    it('❌ Should fail with null input', async () => {
      const res = await validateExpression({
        projectId,
        semanticModelId,
        expression: `Length(null)`
      });
      expect(res.body.success).toBe(false); 
    });
  });

  describe('Function: Lower', () => {
    it('✅ Should convert Product Name to lowercase', async () => {
      const res = await validateExpression({
        projectId,
        semanticModelId,
        expression: `Lower([Cleaned superstore.Region])` 
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.dataType).toBe('String');
      expect(res.body.result).toBeDefined(); 
      expect(res.body.result).toBe(res.body.result.toLowerCase()); 
    });

    it('✅ Should return empty string for empty Product Name', async () => {
      const res = await validateExpression({
        projectId,
        semanticModelId,
        expression: `Lower("")` 
      });
      expect(res.body.success).toBe(true);
      expect(res.body.dataType).toBe('String');
      expect(res.body.result).toBe(""); 
    });

    it('❌ Should fail with null input for Lower', async () => {
      const res = await validateExpression({
        projectId,
        semanticModelId,
        expression: `Lower(null)`
      });
      expect(res.body.success).toBe(false);
    });

    it('❌ Should fail with non-string input for Lower', async () => {
      const res = await validateExpression({
        projectId,
        semanticModelId,
        expression: `Lower(12345)` 
      });
      expect(res.body.success).toBe(false); 
    });
  });

});
