import Ajv from "ajv";
import addFormats from "ajv-formats";
import {spec} from 'pactum';

const ajv = new Ajv();
addFormats(ajv);
const baseUrl = 'https://phoenix-dev.datamicron.com/api/ontology/api';
const objectTypeId = "415d423b-95a1-45a6-b1f0-197923b29b70";

export async function createLinkType(data: any) {
    try {
        const response = await spec()
            .post(`${baseUrl}/LinkType`)
            .withHeaders({
                "Content-Type": "application/json",
            })
            .withJson(data)
            .toss();
        return response;
    } catch (error) {
        return {error: true, message: (error as Error).message, details: error};
    }
}

export async function updateLinkType(data: any) {
    try {
        const response = await spec()
            .put(`${baseUrl}/LinkType`)
            .withHeaders({
                "Content-Type": "application/json",
            })
            .withJson(data)
            .toss();
        return response;
    } catch (error) {
        return {error: true, message: (error as Error).message, details: error};
    }
}

export async function deleteLinkType(linkTypeId: string) {
    try {
        const response = await spec()
            .delete(`${baseUrl}/LinkType`)
            .withHeaders({
                "Content-Type": "application/json",
            })
            .withQueryParams('id', linkTypeId)
            .toss();
        return response;
    } catch (error) {
        return {error: true, message: (error as Error).message, details: error};
    }
}

export async function getLinkType(linkTypeId: string) {
    try {
        const response = await spec()
            .get(`${baseUrl}/LinkType`)
            .withHeaders({
                "Content-Type": "application/json",
            })
            .withQueryParams('id', linkTypeId)
            .toss();
        return response;
    } catch (error) {
        return {error: true, message: (error as Error).message, details: error};
    }
}

export async function getLinkTypesWithPagination(
    relations: string[] = [],
    pageNumber: number = 1,
    pageSize: number = 20,
    searchTerm: string = ""
) {
    try {
        const response = await spec()
            .get(`${baseUrl}/LinkType/getWithPagination`)
            .withQueryParams("Relations", relations)
            .withQueryParams("PageNumber", pageNumber)
            .withQueryParams("PageSize", pageSize)
            .withQueryParams("SearchTerm", searchTerm)
            .toss();

        return response;
    } catch (error) {
        return {error: true, message: (error as Error).message, details: error};
    }
}

export async function getLinkTypesByObjectTypeId(objectTypeId: string) {
    try {
        const response = await spec()
            .get(`${baseUrl}/LinkType/byObjectTypeId`)
            .withQueryParams("objectTypeId", objectTypeId)
            .toss();

        return response;
    } catch (error) {
        return {error: true, message: (error as Error).message, details: error};
    }
}
