import pactum from "pactum";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function randomString(length: number, onlyString = true) {
    let result = length < 8 ? '' : 'test ';
    const characters = onlyString ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    length = length < 8 ? length : length - 5;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function randomIntBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getCountOfFiles(projectId: any) {
    const res = await pactum.spec()
        .get('http://5.182.26.202:5051/api/ProjectExplorer?ResourceTypes=3&ResourceTypes=4')
        .withHeaders({
            'Content-Type': 'application/json',
            'ProjectId': projectId
        })
        .expectStatus(200)
        .returns('res.body');

    const response = typeof res === 'string' ? JSON.parse(res) : res;
    const dashboards = response.counts.resources.Dashboard;
    const analysis = response.counts.resources.Analysis;
    const folders = response.counts.folder;
    console.log(`Dashboards: ${dashboards}, Analysis: ${analysis}, Folders: ${folders}`);
    console.log(`Dashboards: ${dashboards}, Analysis: ${analysis}, Folders: ${folders}`);
    let total: any;
    total = dashboards + analysis + folders;
    return {dashboards, analysis, folders, total};
}

async function ProjectExplorer(projectId: any, folderId: null, foldersOnly: null, searchTerm: null, resourceTypes: null) {
    const spec = pactum.spec()
        .get('http://5.182.26.202:5051/api/ProjectExplorer')
        .withHeaders('ProjectId', projectId)
        .expectStatus(200);

    if (foldersOnly !== null) {
        spec.withQueryParams('FoldersOnly', foldersOnly);
    }
    if (searchTerm !== null) {
        spec.withQueryParams('SearchTerm', searchTerm);
    }
    if (folderId !== null) {
        spec.withQueryParams('FolderId', folderId);
    }
    if (resourceTypes !== null) {
        spec.withQueryParams('ResourceTypes', resourceTypes);
    }

    return spec.returns('res.body');
}

async function deleteAll(nameSpaceID: any, projectId: any) {
    const res = await pactum.spec()
        .get('http://5.182.26.202:5051/api/ProjectExplorer?ResourceTypes=3&ResourceTypes=4')
        .withHeaders({
            'Content-Type': 'application/json',
            'ProjectId': projectId
        })
        .expectStatus(200)
        .returns('res.body');

    const response = typeof res === 'string' ? JSON.parse(res) : res;

    function collectItemIds(items: { id: string, children?: { id: string, children?: any[] }[] }[]): string[] {
        let ids: string[] = [];
        for (let i = 0; i < items.length && i < 5; i++) {
            let item = items[i];
            ids.push(item.id);
            if (item.children && item.children.length > 0) {
                ids = ids.concat(collectItemIds(item.children));
            }
        }
        return ids;
    }

    let itemIds = collectItemIds(response.items);

    const deletePromises = itemIds.map(itemId => {
        console.log("ItemID => " + itemId);
        return pactum.spec()
            .delete(`http://5.182.26.202:5051/api/Analysis`)
            .withQueryParams('id', itemId)
            .withHeaders({
                'Content-Type': 'application/json',
                'ProjectId': projectId,
            })
            .expectStatus(204)
    });

    await Promise.all(deletePromises);

    for (let itemId of itemIds) {
        await pactum.spec()
            .delete(`http://5.182.26.202:5051/api/Dashboard`)
            .withQueryParams('id', itemId)
            .withHeaders({
                'Content-Type': 'application/json',
                'ProjectId': projectId,
            })
            .expectStatus(204)
    }

    for (let itemId of itemIds) {
        await pactum.spec()
            .delete(`https://phoenix-dev.datamicron.com/api/Folder`)
            .withQueryParams('id', itemId)
            .withHeaders({
                'Content-Type': 'application/json',
                'ProjectId': projectId,
            })
            .expectStatus(204)
    }


    await pactum.spec()
        .delete(`https://phoenix-dev.datamicron.com/api/Project/${projectId}`)
        .expectStatus(204)


    const resp = await pactum.spec()
        .delete(`https://phoenix-dev.datamicron.com/api/Namespace/${nameSpaceID}`)
        .expectStatus(204)

}

const InvalidValues = {
    empty: '',
    namespaceId: 'z281a5d4-ecf4-47e2-ba45-a76f6ba6ba0z',
}

export {randomString, randomIntBetween, sleep, getCountOfFiles, ProjectExplorer, deleteAll, InvalidValues};
