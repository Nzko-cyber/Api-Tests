import pactum from "pactum";
import '../../pactum.config';

let baseURL: string = '/project-explorer/api/File';

async function uploadFile(
    file: any,
    projectId: string | null = null
) {
    try {
        let spec = pactum.spec().post(`${baseURL}/upload`).withHeaders({'Content-Type': 'multipart/form-data'});

        if (projectId !== null) {
            spec.withHeaders('ProjectId', projectId);
        }

        if (file !== null) {
            spec.withFile('file', file);
        }

        const response = await spec.toss();
        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}

async function createFile(
    fileId: string | null = null,
    fileName: string | null = null,
    projectId: string | null = null,
    folderId: string | null = null,
    option: string | null = null
) {
    try {
        let bodyJson: any = {};

        if (fileId !== null) bodyJson.fileId = fileId;
        if (fileName !== null) bodyJson.fileName = fileName;
        if (folderId !== null) bodyJson.folderId = folderId;
        if (option !== null) bodyJson.option = option;

        let spec = pactum.spec().post(`${baseURL}`);

        if (projectId !== null) {
            spec.withHeaders('ProjectId', projectId);
        }

        if (Object.keys(bodyJson).length > 0) {
            spec.withJson(bodyJson);
        }

        const response = await spec.toss();
        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}

async function getFile(
    id: string | null = null,
    projectId: string | null = null
) {
    try {
        let spec = pactum.spec().get(`${baseURL}/download?Id=${id}`);

        if (projectId !== null) {
            spec.withHeaders('ProjectId', projectId);
        }

        const response = await spec.toss();
        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}

async function deleteFile(
    id: string | null = null,
    projectId: string | null = null
) {
    try {
        let spec = pactum.spec().delete(`/project-explorer/api/ProjectExplorer/DeleteResource?id=${id}`);

        if (projectId !== null) {
            spec.withHeaders('ProjectId', projectId);
        }

        const response = await spec.toss();
        return response;
    } catch (error) {
        return {error: true, message: error.message, details: error};
    }
}

export {
    uploadFile,
    createFile,
    getFile,
    deleteFile
}