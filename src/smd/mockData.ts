import {PostSemanticModelRequest, PutSemanticModelRequest} from "./interfaces";

const imageUrl = "https://example.com/image.png";
const imageUrl2 = "https://example.com/image2.png";
const name = randomString(15);
const description = randomString(25);
const domain = "Finance";
const subDomain = "Risk Management";
const objectives = "Analyze financial risks and detect anomalies.";

function randomString(length: number, onlyString = false) {
    let result = length < 8 ? '' : 'test-';
    const characters = onlyString ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    length = length < 8 ? length : length - 5;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const mockSemanticModelPostRequest: PostSemanticModelRequest = {
    name: name,
    description: "string",
    extraPrompt: {
        domain: "Finance",
        subDomain: "Risk Management",
        objectives: "Analyze financial risks and detect anomalies.",
    },
    folderId: "19289305-46f2-417b-803c-44ce66c97832",
    imageUrl: imageUrl,
    objectTypes: [
        {id: "7fb97d6f-c0bb-4dd9-a70d-01daa3946fcb", name: "UserForTesting3"},
        {id: "75f7a78b-93da-43b9-b614-c5ab546f3bb2", name: "UserForTesting"},
        {id: "d070025f-c0eb-4d00-9780-8e90123c5614", name: "UserForTesting2"}
    ],
    projectId: "fa118425-239f-46e9-b1b2-e4e9c462a8b5"
};


export const mockSemanticModelPutRequest: PutSemanticModelRequest = {
    projectId: "fa118425-239f-46e9-b1b2-e4e9c462a8b5",
    id: "",
    name: name + "Updated",
    description: "This is the updated description",
    imageUrl: imageUrl2,
    extraPrompt: {
        domain: domain + "Updated",
        subDomain: subDomain + "Updated",
        objectives: objectives + "Updated",
    },
    objectTypes: [
        {id: "7fb97d6f-c0bb-4dd9-a70d-01daa3946fcb", name: "UserForTesting3"},
        {id: "75f7a78b-93da-43b9-b614-c5ab546f3bb2", name: "UserForTesting"},
        {id: "d070025f-c0eb-4d00-9780-8e90123c5614", name: "UserForTesting2"}
    ],
    layouts: [
        {
            name: "Layout1",
            description: "Layout1 description",
            objectTypes: [
                {id: "7fb97d6f-c0bb-4dd9-a70d-01daa3946fcb", name: "UserForTesting3"},
                {id: "75f7a78b-93da-43b9-b614-c5ab546f3bb2", name: "UserForTesting"},
                {id: "d070025f-c0eb-4d00-9780-8e90123c5614", name: "UserForTesting2"}
            ]
        },
    ]
};

  
