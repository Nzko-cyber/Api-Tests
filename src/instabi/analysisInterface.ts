export interface SemanticModel {
    id: string;
    name: string;
}

export interface CreateAnalysisRequest {
    projectId?: string | null;
    name: string;
    folderId: string | null;
    description: string;
    activeDashboardId: string | null;
    semanticModels: SemanticModel[];
}

export interface CreateDashboardRequest {
    projectId: string;
    name: string;
    description: string;
    analysisId: string;
    type: string;
    withDefaultTab: boolean
}

export interface updateDashboard {
    id: string;
    name: string;
    folderId: string;
    description: string;
    type: string;
    semanticModelId: string;
    filters: string | null;
    activeTabId: string;
}

export interface Location {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export interface SettingItem {
    name: string;
    type: string;
    value: string | boolean;
}

export interface Settings {
    category: string;
    items: SettingItem[];
}

export interface QueryArea {
    name: string;
    type: string;
    fields: {
        attribute: { enabled: boolean; min?: number; max?: number };
        measure: { enabled: boolean; min?: number };
    };
}

export interface Features {
    data: { datasetType: string };
    cluster: { enabled: boolean };
    queryAreas: QueryArea[];
}

export interface CreateDashboardControlRequest {
    projectId: string | "" | null;
    name: string;
    title: string;
    dashboardId: string | "" | null;
    dashboardTabId: string | "" | null;
    type: string;
    location: Location;
    size: Size;
    settings: Settings | null;
    features: Features | null;
}

export interface updateDashboardControl {
    id: string;
    name: string;
    title: string;
    dashboardId: string;
    dashboardTabId: string;
    type: string;
    location: { x: number; y: number };
    size: { width: number; height: number };
    settings: string | null;
    features: string | null;
}

export type Sorting = {
    order: 'asc' | 'desc';
    type: 'alphabetical' | 'numerical' | 'custom' | string;
    condition?: {
      uniqueName: string;
      aggregation: string;
    };
    members?: { uniqueName: string; alias?: string }[];

  };
  
 export type AttributeMemberRequest = {
    projectId: string;
    semanticModelId: string;
    attributeName: string;
    uniqueName: string;
    part?: 'year' | 'month' | 'day' | string;
    type?: 'discrete' | 'continuous' | string;
    sorting?: Sorting;
    limit?: {
      count: number;
      offset?: number;
      page?: number;
    };
  };
  