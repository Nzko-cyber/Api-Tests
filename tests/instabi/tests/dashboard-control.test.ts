import {
    createDashboardControl,
    deleteDashboardControl,
    getDashboardControl,
    getDashboardControlList,
    updateDashboardControl
} from '../functions/dashboard-control';
import {randomString, sleep} from '../../utils';
import {CreateDashboardControlRequest} from '../analysisInterface';

const environment = {
    validProjectID: '5c5c800c-ac58-464c-91cc-cff7a3a0f3d1',
    invalidProjectID: 'invalid-project-id',
    dashboardID: '690e7278-39bb-40e3-bfa7-69e998dab45a',
    dashboardTabID: "9a334b74-9c3f-4160-a40c-81aeb727be9e",
    dashboardControlID: '',
    duplicateName: 'test 123',
    invalidName: "invalid contol name"
};

describe(' INSTABI::DASHBOARD_CONTROL', () => {
    beforeEach(() => {
        allure.epic('Instabi');
        allure.feature('Dashboard Control API Tests');
        allure.owner('QA Team');
    });

    describe('API Tests - Creating Dashboard_Control (POST)', () => {
        allure.feature('Dashboard Control Creation');

        it('✅ Create DashboardControl with valid data', async () => {
            allure.story('Create DashboardControl with valid data');
            allure.description('This test validates the creation of a DashboardControl with valid and complete input data.');

            const postData: CreateDashboardControlRequest = {
                projectId: environment.validProjectID,
                name: `area-chart-control`,
                title: 'Area Chart',
                dashboardId: environment.dashboardID,
                dashboardTabId: environment.dashboardTabID,
                type: 'Charts',
                location: {x: 0, y: 0},
                size: {width: 5, height: 2},
                settings: {
                    category: 'General',
                    items: [
                        {name: 'Title', type: 'String', value: 'Title'},
                        {name: 'Show title', type: 'Boolean', value: true},
                    ],
                },
                features: {
                    data: {datasetType: 'Categorical'},
                    cluster: {enabled: true},
                    queryAreas: [
                        {
                            name: 'Categories',
                            type: 'RowAxis',
                            fields: {attribute: {enabled: true, min: 1, max: 1}, measure: {enabled: false}}
                        },
                        {
                            name: 'Values',
                            type: 'ColumnAxis',
                            fields: {attribute: {enabled: false}, measure: {enabled: true, min: 1}}
                        },
                    ],
                },
            };

            const response = await createDashboardControl(postData);
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            environment.dashboardControlID = response.body;

            console.log(`✅ Created DashboardControl ID: ${environment.dashboardControlID}`);
            await sleep(1000);
        });

        it('❌ Create DashboardControl with empty ProjectId', async () => {
            allure.story('Create DashboardControl with empty ProjectId');
            allure.description('This test checks error handling when ProjectId is not provided.');

            const postData: CreateDashboardControlRequest = {
                projectId: '',
                name: `area-chart-control`,
                title: 'Area Chart',
                dashboardId: environment.dashboardID,
                dashboardTabId: environment.dashboardTabID,
                type: 'Cluster',
                location: {x: 0, y: 0},
                size: {width: 5, height: 2},
                settings: {
                    category: 'General',
                    items: [
                        {name: 'Title', type: 'String', value: 'Title'},
                        {name: 'Show title', type: 'Boolean', value: true},
                    ],
                },
                features: {
                    data: {datasetType: 'Categorical'},
                    cluster: {enabled: true},
                    queryAreas: [
                        {
                            name: 'Categories',
                            type: 'RowAxis',
                            fields: {attribute: {enabled: true, min: 1, max: 1}, measure: {enabled: false}}
                        },
                        {
                            name: 'Values',
                            type: 'ColumnAxis',
                            fields: {attribute: {enabled: false}, measure: {enabled: true, min: 1}}
                        },
                    ],
                },
            };

            const response = await createDashboardControl(postData);
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`❌ Expected error: ${response.message}`);
            await sleep(1000);
        });

        it('❌ Create DashboardControl with invalid Projectid', async () => {
            allure.story('Create DashboardControl with invalid ProjectId');
            allure.description('This test verifies error handling for an invalid ProjectId.');

            const postData: CreateDashboardControlRequest = {
                projectId: 'invalid-project-id',
                name: `area-chart-control`,
                title: 'Area Chart',
                dashboardId: environment.dashboardID,
                dashboardTabId: environment.dashboardTabID,
                type: 'Charts',
                location: {x: 0, y: 0},
                size: {width: 5, height: 2},
                settings: {
                    category: 'General',
                    items: [
                        {name: 'Title', type: 'String', value: 'Title'},
                        {name: 'Show title', type: 'Boolean', value: true},
                    ],
                },
                features: {
                    data: {datasetType: 'Categorical'},
                    cluster: {enabled: true},
                    queryAreas: [
                        {
                            name: 'Categories',
                            type: 'RowAxis',
                            fields: {attribute: {enabled: true, min: 1, max: 1}, measure: {enabled: false}}
                        },
                        {
                            name: 'Values',
                            type: 'ColumnAxis',
                            fields: {attribute: {enabled: false}, measure: {enabled: true, min: 1}}
                        },
                    ],
                },
            };

            const response = await createDashboardControl(postData);
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`❌ Created DashboardControl ID: ${environment.dashboardControlID}`);
            await sleep(1000);
        });

        it("❌ Create DashboardControl with excessively long values", async () => {
            allure.story('Create DashboardControl with excessively long name');
            allure.description('This test checks validation when control name exceeds character limit.');

            const postData: CreateDashboardControlRequest = {
                projectId: environment.validProjectID,
                name: "a".repeat(256),
                title: "Area Chart",
                dashboardId: environment.dashboardID,
                dashboardTabId: environment.dashboardTabID,
                type: "Charts",
                location: {x: 0, y: 0},
                size: {width: 5, height: 2},
                settings: {
                    category: "General",
                    items: [
                        {name: "Title", type: "String", value: "Title"},
                        {name: "Show title", type: "Boolean", value: true},
                    ],
                },
                features: {
                    data: {datasetType: "Categorical"},
                    cluster: {enabled: true},
                    queryAreas: [
                        {
                            name: "Categories",
                            type: "RowAxis",
                            fields: {attribute: {enabled: true, min: 1, max: 1}, measure: {enabled: false}}
                        },
                        {
                            name: "Values",
                            type: "ColumnAxis",
                            fields: {attribute: {enabled: false}, measure: {enabled: true, min: 1}}
                        },
                    ],
                },
            };

            const response = await createDashboardControl(postData);
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
        });

        it("❌ Create DashboardControl without required fields", async () => {
            allure.story('Create DashboardControl without required fields');
            allure.description('This test ensures validation fails when required fields are missing.');

            const postData: any = {
                projectId: environment.validProjectID,
                title: "Area Chart",
                dashboardId: environment.dashboardID,
                dashboardTabId: environment.dashboardTabID,
                location: {x: 0, y: 0},
                settings: {
                    category: "General",
                    items: [
                        {name: "Title", type: "String", value: "Title"},
                        {name: "Show title", type: "Boolean", value: true},
                    ],
                },
                features: {
                    data: {datasetType: "Categorical"},
                    cluster: {enabled: true},
                    queryAreas: [
                        {
                            name: "Categories",
                            type: "RowAxis",
                            fields: {attribute: {enabled: true, min: 1, max: 1}, measure: {enabled: false}}
                        },
                        {
                            name: "Values",
                            type: "ColumnAxis",
                            fields: {attribute: {enabled: false}, measure: {enabled: true, min: 1}}
                        },
                    ],
                },
            };

            const response = await createDashboardControl(postData);
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);

            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
        });
        it("❌ Create DashboardControl without DashboardId", async () => {
            allure.story('Create DashboardControl without DashboardId');
            allure.description('This test checks validation when DashboardId is not provided.');

            const postData: CreateDashboardControlRequest = {
                projectId: environment.validProjectID,
                name: "area-chart-control",
                title: "Area Chart",
                dashboardId: "",
                dashboardTabId: environment.dashboardTabID,
                type: "Charts",
                location: {x: 0, y: 0},
                size: {width: 5, height: 2},
                settings: {
                    category: "General",
                    items: [
                        {name: "Title", type: "String", value: "Title"},
                        {name: "Show title", type: "Boolean", value: true},
                    ],
                },
                features: {
                    data: {datasetType: "Categorical"},
                    cluster: {enabled: true},
                    queryAreas: [
                        {
                            name: "Categories",
                            type: "RowAxis",
                            fields: {attribute: {enabled: true, min: 1, max: 1}, measure: {enabled: false}}
                        },
                        {
                            name: "Values",
                            type: "ColumnAxis",
                            fields: {attribute: {enabled: false}, measure: {enabled: true, min: 1}}
                        },
                    ],
                },
            };

            const response = await createDashboardControl(postData);
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toBeDefined();
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
        });

        it("❌ Create DashboardControl without DashboardTabId", async () => {
            allure.story('Create DashboardControl without DashboardTabId');
            allure.description('This test checks validation when DashboardTabId is not provided.');

            const postData: CreateDashboardControlRequest = {
                projectId: environment.validProjectID,
                name: "area-chart-control",
                title: "Area Chart",
                dashboardId: environment.dashboardID,
                dashboardTabId: "",
                type: "Charts",
                location: {x: 0, y: 0},
                size: {width: 5, height: 2},
                settings: {
                    category: "General",
                    items: [
                        {name: "Title", type: "String", value: "Title"},
                        {name: "Show title", type: "Boolean", value: true},
                    ],
                },
                features: {
                    data: {datasetType: "Categorical"},
                    cluster: {enabled: true},
                    queryAreas: [
                        {
                            name: "Categories",
                            type: "RowAxis",
                            fields: {attribute: {enabled: true, min: 1, max: 1}, measure: {enabled: false}}
                        },
                        {
                            name: "Values",
                            type: "ColumnAxis",
                            fields: {attribute: {enabled: false}, measure: {enabled: true, min: 1}}
                        },
                    ],
                },
            };

            const response = await createDashboardControl(postData);
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toBeDefined();
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
        });

        it("❌ Create DashboardControl with invalid DashboardId", async () => {
            allure.story('Create DashboardControl with invalid DashboardId');
            allure.description('This test checks validation with an invalid DashboardId.');

            const postData: CreateDashboardControlRequest = {
                projectId: environment.validProjectID,
                name: "area-chart-control",
                title: "Area Chart",
                dashboardId: "invalid-dashboard-id",
                dashboardTabId: environment.dashboardTabID,
                type: "Charts",
                location: {x: 0, y: 0},
                size: {width: 5, height: 2},
                settings: {
                    category: "General",
                    items: [
                        {name: "Title", type: "String", value: "Title"},
                        {name: "Show title", type: "Boolean", value: true},
                    ],
                },
                features: {
                    data: {datasetType: "Categorical"},
                    cluster: {enabled: true},
                    queryAreas: [
                        {
                            name: "Categories",
                            type: "RowAxis",
                            fields: {attribute: {enabled: true, min: 1, max: 1}, measure: {enabled: false}}
                        },
                        {
                            name: "Values",
                            type: "ColumnAxis",
                            fields: {attribute: {enabled: false}, measure: {enabled: true, min: 1}}
                        },
                    ],
                },
            };

            const response = await createDashboardControl(postData);
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toBeDefined();
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
        });

        it("❌ Create DashboardControl with invalid DashboardTabId", async () => {
            allure.story('Create DashboardControl with invalid DashboardTabId');
            allure.description('This test checks validation with an invalid DashboardTabId.');

            const postData: CreateDashboardControlRequest = {
                projectId: environment.validProjectID,
                name: "area-chart-control",
                title: "Area Chart",
                dashboardId: environment.dashboardID,
                dashboardTabId: "invalid-dashboard-tab-id",
                type: "Charts",
                location: {x: 0, y: 0},
                size: {width: 5, height: 2},
                settings: {
                    category: "General",
                    items: [
                        {name: "Title", type: "String", value: "Title"},
                        {name: "Show title", type: "Boolean", value: true},
                    ],
                },
                features: {
                    data: {datasetType: "Categorical"},
                    cluster: {enabled: true},
                    queryAreas: [
                        {
                            name: "Categories",
                            type: "RowAxis",
                            fields: {attribute: {enabled: true, min: 1, max: 1}, measure: {enabled: false}}
                        },
                        {
                            name: "Values",
                            type: "ColumnAxis",
                            fields: {attribute: {enabled: false}, measure: {enabled: true, min: 1}}
                        },
                    ],
                },
            };

            const response = await createDashboardControl(postData);
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toBeDefined();
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
        });

        it("✅ Create DashboardControl without settings and features", async () => {
            allure.story('Create DashboardControl without settings and features');
            allure.description('This test validates creating a control without settings and features fields (null values).');

            const postData: CreateDashboardControlRequest = {
                projectId: environment.validProjectID,
                name: "area-chart-control",
                title: "Area Chart",
                dashboardId: environment.dashboardID,
                dashboardTabId: environment.dashboardTabID,
                type: "Charts",
                location: {x: 0, y: 0},
                size: {width: 5, height: 2},
                settings: null,
                features: null,
            };

            const response = await createDashboardControl(postData);
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            console.log(`✅ DashboardControl created without settings and features, ID: ${response.body.id}`);
        });

        it("❌ Create DashboardControl with duplicate name", async () => {
            allure.story('Create DashboardControl with duplicate name');
            allure.description('This test checks error response when trying to create a control with a name that already exists.');

            const postData: CreateDashboardControlRequest = {
                projectId: environment.validProjectID,
                name: environment.duplicateName,
                title: "Area Chart",
                dashboardId: environment.dashboardID,
                dashboardTabId: environment.dashboardTabID,
                type: "Charts",
                location: {x: 0, y: 0},
                size: {width: 5, height: 2},
                settings: {
                    category: "General",
                    items: [
                        {name: "Title", type: "String", value: "Title"},
                        {name: "Show title", type: "Boolean", value: true},
                    ],
                },
                features: {
                    data: {datasetType: "Categorical"},
                    cluster: {enabled: true},
                    queryAreas: [
                        {
                            name: "Categories",
                            type: "RowAxis",
                            fields: {attribute: {enabled: true, min: 1, max: 1}, measure: {enabled: false}}
                        },
                        {
                            name: "Values",
                            type: "ColumnAxis",
                            fields: {attribute: {enabled: false}, measure: {enabled: true, min: 1}}
                        },
                    ],
                },
            };

            const response = await createDashboardControl(postData);
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toBeDefined();
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
        });

        it("❌ Create DashboardControl with invalid location coordinates", async () => {
            allure.story('Create DashboardControl with invalid coordinates');
            allure.description('This test checks validation when location coordinates (x/y) are negative.');

            const postData: CreateDashboardControlRequest = {
                projectId: environment.validProjectID,
                name: "area-chart-control" + randomString(3),
                title: "Area Chart",
                dashboardId: environment.dashboardID,
                dashboardTabId: environment.dashboardTabID,
                type: "Charts",
                location: {x: -10, y: -5},
                size: {width: 5, height: 2},
                settings: {
                    category: "General",
                    items: [
                        {name: "Title", type: "String", value: "Title"},
                        {name: "Show title", type: "Boolean", value: true},
                    ],
                },
                features: {
                    data: {datasetType: "Categorical"},
                    cluster: {enabled: true},
                    queryAreas: [
                        {
                            name: "Categories",
                            type: "RowAxis",
                            fields: {attribute: {enabled: true, min: 1, max: 1}, measure: {enabled: false}}
                        },
                        {
                            name: "Values",
                            type: "ColumnAxis",
                            fields: {attribute: {enabled: false}, measure: {enabled: true, min: 1}}
                        },
                    ],
                },
            };

            const response = await createDashboardControl(postData);
            allure.attachment('Response Body', response.body, { contentType: allure.ContentType.JSON });
            allure.parameter("HTTP Status", response.statusCode);
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toBeDefined();
            console.log(`✅ Expected Error: ${JSON.stringify(response.body.errors)}`);
        });
    });


  describe('API Tests - Updating ObjectType (PUT)', () => {
    allure.feature('Dashboard Control Update');

    it('✅ Update DashboardControl with valid data', async () => {
        allure.story('Update DashboardControl with valid data');
        allure.description('This test validates successful update of a DashboardControl with valid payload.');

        const response = await updateDashboardControl(
            environment.validProjectID,
            {
                id: environment.dashboardControlID,
                name: `Updated-Control-${randomString(3)}`,
                title: 'Updated Area Chart',
                dashboardId: environment.dashboardID,
                dashboardTabId: environment.dashboardTabID,
                type: 'Charts',
                location: {x: 1, y: 1},
                size: {width: 6, height: 3},
                settings: null,
                features: null,
            }
        );

        allure.parameter("HTTP Status", response.statusCode);
        allure.attachment('Response Body', response, { contentType: allure.ContentType.JSON });

        expect(response).toBeDefined();
        expect(response.statusCode).toBe(204);
        console.log(`✅ Updated DashboardControl ID: ${environment.dashboardControlID}`);
        await sleep(1000);
    });

    it('❌ Update DashboardControl with invalid ProjectId', async () => {
        allure.story('Update DashboardControl with invalid ProjectId');
        allure.description('This test checks error handling for an invalid ProjectId during update.');

        const updatedData = {
            id: environment.dashboardControlID,
            name: `Updated-Control-${randomString(3)}`,
            title: 'Updated Area Chart',
            dashboardId: environment.dashboardID,
            dashboardTabId: environment.dashboardTabID,
            type: 'Charts',
            location: {x: 1, y: 1},
            size: {width: 6, height: 3},
            settings: null,
            features: null,
        };

        const response = await updateDashboardControl(environment.invalidProjectID, updatedData);

        allure.parameter("HTTP Status", response.statusCode);
        allure.attachment('Response Body', response, { contentType: allure.ContentType.JSON });

        expect(response).toBeDefined();
        expect(response.statusCode).toBe(400);
        console.log(`✅ Updated DashboardControl with invalid ProjectId`);
        await sleep(1000);
    });

    it('❌ Update DashboardControl with empty ProjectId', async () => {
        allure.story('Update DashboardControl with empty ProjectId');
        allure.description('This test checks validation when ProjectId is not provided.');

        const updatedData = {
            id: environment.dashboardControlID,
            name: `Updated-Control-${randomString(3)}`,
            title: 'Updated Area Chart',
            dashboardId: environment.dashboardID,
            dashboardTabId: environment.dashboardTabID,
            type: 'Charts',
            location: {x: 1, y: 1},
            size: {width: 6, height: 3},
            settings: null,
            features: null,
        };

        const response = await updateDashboardControl('', updatedData);

        allure.parameter("HTTP Status", response.statusCode);
        allure.attachment('Response Body', response, { contentType: allure.ContentType.JSON });

        expect(response).toBeDefined();
        expect(response.statusCode).toBe(400);
        console.log(`✅ Updated DashboardControl with empty ProjectId`);
        await sleep(1000);
    });

    it('❌ Update DashboardControl with empty DashboardControlId', async () => {
        allure.story('Update DashboardControl with empty DashboardControlId');
        allure.description('This test checks validation when the DashboardControlId is empty.');

        const updatedData = {
            id: '',
            name: `Updated-Control-${randomString(3)}`,
            title: 'Updated Area Chart',
            dashboardId: environment.dashboardID,
            dashboardTabId: environment.dashboardTabID,
            type: 'Charts',
            location: {x: 1, y: 1},
            size: {width: 6, height: 3},
            settings: null,
            features: null,
        };

        const response = await updateDashboardControl(environment.validProjectID, updatedData);

        allure.parameter("HTTP Status", response.statusCode);
        allure.attachment('Response Body', response, { contentType: allure.ContentType.JSON });

        expect(response).toBeDefined();
        expect(response.statusCode).toBe(400);
        console.log(`✅ Updated DashboardControl with empty DashboardControlId`);
        await sleep(1000);
    });

    it('❌ Update DashboardControl with invalid DashboardControlId', async () => {
        allure.story('Update DashboardControl with invalid DashboardControlId');
        allure.description('This test checks behavior when an invalid DashboardControlId is used.');

        const updatedData = {
            id: 'invalid-id',
            name: `Updated-Control-${randomString(3)}`,
            title: 'Updated Area Chart',
            dashboardId: environment.dashboardID,
            dashboardTabId: environment.dashboardTabID,
            type: 'Charts',
            location: {x: 1, y: 1},
            size: {width: 6, height: 3},
            settings: null,
            features: null,
        };

        const response = await updateDashboardControl(environment.validProjectID, updatedData);

        allure.parameter("HTTP Status", response.statusCode);
        allure.attachment('Response Body', response, { contentType: allure.ContentType.JSON });

        expect(response).toBeDefined();
        expect(response.statusCode).toBe(400);
        console.log(`✅ Updated DashboardControl with invalid DashboardControlId`);
        await sleep(1000);
    });

    it('❌ Try updating location and size to negative values', async () => {
        allure.story('Update DashboardControl with negative coordinates');
        allure.description('This test ensures that the API correctly rejects negative values for location and size.');

        const updatedData = {
            id: environment.dashboardControlID,
            name: `Updated-Control-${randomString(3)}`,
            title: 'Updated Area Chart',
            dashboardId: environment.dashboardID,
            dashboardTabId: environment.dashboardTabID,
            type: 'Charts',
            location: {x: -100, y: -100},
            size: {width: -100, height: -100},
            settings: null,
            features: null,
        };

        const response = await updateDashboardControl(environment.validProjectID, updatedData);

        allure.parameter("HTTP Status", response.statusCode);
        allure.attachment('Response Body', response, { contentType: allure.ContentType.JSON });

        expect(response).toBeDefined();
        expect(response.statusCode).toBe(400);
        console.log(`✅ Updated DashboardControl with negative location and size`);
        await sleep(1000);
    });
});


describe('API Tests - Get Dashboard Contril', () => {
    allure.feature('Dashboard Control Retrive');
    it('❌ Get DashboardControl with valid ID', async () => {
        allure.story('Get DashboardControl with valid ID');
        allure.description('This test ensures that the API correctly retrieves a dashboard control with a valid ID.');

        const response = await getDashboardControl(
            environment.validProjectID,
            environment.dashboardControlID
        );

        allure.parameter('HTTP Status', response.statusCode);
        allure.attachment('Response Body', response, { contentType: allure.ContentType.JSON });

        expect(response).toBeDefined();
        expect(response.statusCode).toBe(200);
        console.log(`✅ Retrieved DashboardControl ID: ${environment.dashboardControlID}`);
        await sleep(1000);
    });

    it('❌ Get DashboardControl with invalid ID', async () => {
        allure.story('Get DashboardControl with invalid ID');
        allure.description('This test ensures that the API correctly rejects an invalid dashboard control ID.');

        const response = await getDashboardControl(
            environment.validProjectID,
            'invalid-id'
        );

        allure.parameter('HTTP Status', response.statusCode);
        allure.attachment('Response Body', response, { contentType: allure.ContentType.JSON });

        expect(response.statusCode).toBe(400);
        console.log(`✅ Retrieved DashboardControl with invalid ID`);
        await sleep(1000);
    });

    it('❌ Get DashboardControl with empty ID', async () => {
        allure.story('Get DashboardControl with empty ID');
        allure.description('This test ensures that the API correctly handles an empty ID for dashboard control.');

        const response = await getDashboardControl(
            environment.validProjectID,
            ''
        );

        allure.parameter('HTTP Status', response.statusCode);
        allure.attachment('Response Body', response, { contentType: allure.ContentType.JSON });

        expect(response.statusCode).toBe(400);
        console.log(`✅ Retrieved DashboardControl with empty ID`);
        await sleep(1000);
    });

    it('✅ Get DashboardControl by ID', async () => {
        allure.story('Get DashboardControl by ID');
        allure.description('This test retrieves a dashboard control using a valid ID.');

        const response = await getDashboardControl(environment.validProjectID, environment.dashboardControlID);
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(200);

        console.log(`✅ Retrieved DashboardControl: ${response.name}, ID: ${response.id}`);
        await sleep(1000);
    });
});

    describe('Get DashboardControl List by DashboadrdId', () => {
    it('✅ Get DashboardControl List by DashboardId', async () => {
        allure.story('Get DashboardControl List by DashboardId');
        allure.description('This test retrieves the list of dashboard controls for a valid dashboard ID.');

        const response = await getDashboardControlList(environment.validProjectID, environment.dashboardID);
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(200);
        console.log(`✅ Retrieved DashboardControl List`);
        await sleep(2000);

});


    it('✅ Get DashboardControl List by invalid DashboardId', async () => {
        allure.story('Get DashboardControl List by invalid DashboardId');
        allure.description('This test ensures that the API correctly handles an invalid dashboard ID.');

        const response = await getDashboardControlList(environment.validProjectID, environment.dashboardTabID);
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(200);
        console.log(`✅ Retrieved DashboardControl List by DashboardTabId`);
        await sleep(2000);
    });
});


describe('API Tests - Deleting Dashboard (Delete)', () => {
    allure.feature('Dashboard Control Delete');

    it('✅ Delete DashboardControl with valid data', async () => {
        allure.story('Delete DashboardControl with valid data');
        allure.description('This test ensures that the API correctly deletes a dashboard control using a valid ID.');

        const response = await deleteDashboardControl(environment.validProjectID, environment.dashboardControlID);
        console.log(`✅ Deleted DashboardControl ID: ${environment.dashboardControlID}`);
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(204);

        await sleep(1000);
    });

    it('❌ Delete DashboardControl with empty dashboardControlId', async () => {
        allure.story('Delete DashboardControl with empty dashboardControlId');
        allure.description('This test ensures that the API rejects a request to delete a dashboard control with an empty ID.');

        const response = await deleteDashboardControl(environment.validProjectID, '');
        console.log(`✅ Attempted to delete DashboardControl with empty ID`);
        expect(response.statusCode).toBe(400);

        await sleep(1000);
    });

    it('❌ Delete DashboardControl with invalid dashboardControlId', async () => {
        allure.story('Delete DashboardControl with invalid dashboardControlId');
        allure.description('This test ensures that the API correctly rejects a request to delete a dashboard control with an invalid ID.');

        const response = await deleteDashboardControl(environment.validProjectID, 'invalid-id');
        console.log(`✅ Attempted to delete DashboardControl with invalid ID`);
        expect(response.statusCode).toBe(400);

        await sleep(1000);
    });

    it('❌ Delete DashboardControl with invalid ProjectId', async () => {
        allure.story('Delete DashboardControl with invalid ProjectId');
        allure.description('This test ensures that the API correctly rejects a request to delete a dashboard control with an invalid project ID.');

        const response = await deleteDashboardControl(environment.invalidProjectID, environment.dashboardControlID);
        expect(response.statusCode).toBe(400);

        console.log(`✅ Attempted to delete DashboardControl with invalid ProjectId`);
        await sleep(1000);
    });

    it('❌ Delete DashboardControl with empty ProjectId', async () => {
        allure.story('Delete DashboardControl with empty ProjectId');
        allure.description('This test ensures that the API correctly handles requests to delete a dashboard control with an empty project ID.');

        const response = await deleteDashboardControl('', environment.dashboardControlID);
        expect(response.statusCode).toBe(400);

        console.log(`✅ Attempted to delete DashboardControl with empty ProjectId`);
        await sleep(1000);
    });

});
});