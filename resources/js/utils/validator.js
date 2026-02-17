export const isValidStudentId = (text) => {
    return /^\d{4}-\d-\d{5}$/.test(text);
};
