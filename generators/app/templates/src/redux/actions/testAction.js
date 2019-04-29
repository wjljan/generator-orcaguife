export const testActionTypes = {
    SET_A: 'SET_A',
    SET_B: 'SET_B',
};

export default {
    setA: category => ({
        type: testActionTypes.SET_A,
        category
    }),

    setB: (category, index) => ({
        type: testActionTypes.SET_B,
        category,
        index
    }),
};