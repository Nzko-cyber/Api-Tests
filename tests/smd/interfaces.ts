export interface PostSemanticModelRequest {
    name: string;
    description: string,
    extraPrompt: ExtraPromt;
    folderId: string;
    imageUrl: string;
    objectTypes: { id: string; name: string }[];
    projectId: string;
}

export interface ExtraPromt {
    domain: string;
    subDomain: string;
    objectives: string;
}

export interface PutSemanticModelRequest {
    projectId: string;
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    extraPrompt: {
        domain: string;
        subDomain: string;
        objectives: string;
    };
    objectTypes: {
        id: string;
        name: string;
    }[];
    layouts: {
        name: string;
        description: string;
        objectTypes: {
            id: string;
            name: string;
        }[];
    }[];
}

export interface GetObjectTypePaginationRequest {
    prjectId: string;
    isRecentlyViewed?: boolean;
    isRecentlyModified?: boolean;
    isFavourite?: boolean;
    statuses?: string[];
    visibilities?: string[];
    groupIds?: string[];
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
    orderType?: string;
    orderBy?: string;
}
  