export type ExternalBusiness = {
    id: string;
    name: string;
    code: string;
    address: string;
};

export type CreateExternalBusinessPayload = {
    name: string;
    code: string;
    address: string;
};
