const generateUniqueId = (existingIds: string[]): string => {
    let newId: string;
    do {
        newId = Math.random().toString(36).substr(2, 9); // Random 9-character string
    } while (existingIds.includes(newId));
    return newId;
};

export { generateUniqueId };
