using Xunit;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using YourNamespace.Controllers; // Replace with actual namespace
using YourNamespace.Models;
using YourNamespace.Services; // Services being tested

public class GoalControllerTests
{
    private readonly FakeCollections collections;

    public GoalControllerTests()
    {
        collections = new FakeCollections(); // Mock data collection
    }

    [Fact]
    public async Task GetForUser_ReturnsGoalsForUser()
    {
        // Arrange
        var goals = collections.GetGoals();  // Mock goals list
        var users = collections.GetUsers();  // Mock users list

        var goalsService = new FakeGoalsService(goals, goals[0]); // Inject fake service
        var usersService = new FakeUsersService(users, users[0]);

        var controller = new GoalController(goalsService, usersService);

        // Simulate HTTP context (needed for controller actions)
        var httpContext = new DefaultHttpContext();
        controller.ControllerContext.HttpContext = httpContext;

        // Act: Call the controller method with a userId
        var result = await controller.GetForUser(goals[0].UserId!);

        // Assert: Check the response is not null
        Assert.NotNull(result);

        // Assert: Validate each goal in the response
        foreach (Goal goal in result!)
        {
            Assert.IsAssignableFrom<Goal>(goal); // Check type
            Assert.Equal(goals[0].UserId, goal.UserId); // Check correct userId
        }
    }
}
