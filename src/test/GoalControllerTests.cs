using System.Threading.Tasks;
using Xunit;
using Microsoft.AspNetCore.Http;

public class GoalControllerTests
{
    private readonly FakeCollections collections;

    public GoalControllerTests()
    {
        collections = new();
    }

    [Fact]
    public async Task GetForUser()
    {
        // Arrange
        var goals = collections.GetGoals();
        var users = collections.GetUsers();
        IGoalsService goalsService = new FakeGoalsService(goals, goals[0]);
        IUsersService usersService = new FakeUsersService(users, users[0]);
        GoalController controller = new(goalsService, usersService);

        var httpContext = new DefaultHttpContext();
        controller.ControllerContext.HttpContext = httpContext;

        // Act
        var result = await controller.GetForUser(goals[0].UserId!);

        // Assert
        Assert.NotNull(result);
        Assert.NotEmpty(result); // Ensure goals exist

        Assert.All(result!, goal =>
        {
            Assert.IsAssignableFrom<Goal>(goal);
            Assert.Equal(goals[0].UserId, goal.UserId);
        });
    }
}
