type PaginatedResponse<T> = {
    items?: T[],
    continuationToken?: string;
};

export default PaginatedResponse;
