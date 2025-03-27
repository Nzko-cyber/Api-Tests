import pactum from 'pactum';

const BASE_URL = "https://phoenix-dev.datamicron.com/api/project-explorer/api/Resource";
const projectId = "79eb5496-9516-4318-ada4-60284b379ed2";
const datasetId = "a3e55cc6-3c58-492a-8345-b10e5fdd0e74";

async function getFolderId(datasetId, projectId) {
    const response = await pactum.spec()
        .get(`${BASE_URL}/search`)
        .withQueryParams({SearchResourceType: "Datasets", SearchTerm: "users2"})
        .withHeaders({"ProjectId": projectId})
        .expectStatus(200)
        .returns("datasets.items[0].folderId");

    return response;
}

async function updateResourceFolderId(datasetId, projectId, folderId) {
    const newFolderId = folderId === "bcdcf852-4b50-4bd8-8ed8-b8c38a91dda7"
        ? "3ac540d6-5303-4dcc-8366-b21a8904ec20"
        : "bcdcf852-4b50-4bd8-8ed8-b8c38a91dda7";

    await pactum.spec()
        .put(`${BASE_URL}/updateResourceFolderId`)
        .withHeaders({"ProjectId": projectId, "Content-Type": "application/json-patch+json"})
        .withJson({id: datasetId, folderId: newFolderId})
        .expectStatus(204);

    return newFolderId;
}

describe("API Tests - Update Resource Folder ID", () => {
    let originalFolderId;

    it("✅ Should fetch the current folderId", async () => {
        originalFolderId = await getFolderId(datasetId, projectId);
        expect(originalFolderId).toBeDefined();
        console.log(`Current folderId: ${originalFolderId}`);
    });

    it("✅ Should update folderId successfully", async () => {
        const updatedFolderId = await updateResourceFolderId(datasetId, projectId, originalFolderId);
        expect(updatedFolderId).not.toBe(originalFolderId);
        console.log(`Updated folderId: ${updatedFolderId}`);
    });

    it("✅ Should verify the folderId is updated", async () => {
        const newFolderId = await getFolderId(datasetId, projectId);
        expect(newFolderId).not.toBe(originalFolderId);
        console.log(`Verified updated folderId: ${newFolderId}`);
    });

    it("✅ Should revert folderId to original value", async () => {
        await updateResourceFolderId(datasetId, projectId, await getFolderId(datasetId, projectId));
        const revertedFolderId = await getFolderId(datasetId, projectId);
        expect(revertedFolderId).toBe(originalFolderId);
        console.log(`Reverted folderId: ${revertedFolderId}`);
    });
});
