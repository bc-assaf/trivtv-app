export const load = async ({ cookies }) => {
    return {
        cookies: cookies.getAll(),
    };
};