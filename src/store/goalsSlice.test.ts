import goalsReducer, { setGoals } from './goalsSlice';

describe('goalsSlice - GetGoalsForUser coverage', () => {
  it('should correctly handle setting fetched goals', () => {
    const initialState = {
      map: {},
      list: []
    };

    const mockFetchedGoals = [
      {
        id: "62a3f5e0102e921da1253d33",
        name: "Savings Goal",
        icon: "🚀"
      }
    ];

    const updatedState = goalsReducer(initialState as any, setGoals(mockFetchedGoals as any));

    expect(updatedState.list).toEqual(["62a3f5e0102e921da1253d33"]);
    expect(updatedState.map["62a3f5e0102e921da1253d33"].name).toBe("Savings Goal");
  });
});