
const nested = {
    
}

const queries = {
    getCurrentUser: async (_, payload, context) => {
        if(!context.validAuth) throw new Error("Not authenticated");

        const user = await UserService.getUserByIdentifier(context.id);
        return user;
    }
};

const mutations = {

};

export const resolvers = { queries, mutations, nested };
