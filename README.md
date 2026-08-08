# CommBank Goal Tracker

# Commonwealth Bank Software Engineering Virtual Experience (Forage)

## Overview

This project was completed as part of the **Commonwealth Bank Software Engineering Virtual Experience** on Forage. The simulation replicates the experience of working as a software engineer on an existing production-style codebase, where the goal is to implement a new feature while following real-world software development practices.

The project is a full-stack goal-tracking application that allows users to create and manage personal goals. My task was to extend the application by adding support for assigning emoji icons to individual goals.

---

## Project Objective

Implement an end-to-end feature that enables users to assign an emoji icon to each goal while maintaining compatibility with the existing application architecture.

Example:

| Goal | Icon |
|------|------|
| Save for Japan | ✈️ |
| Buy a Car | 🚗 |
| Emergency Fund | 💰 |
| Gym 3x/week | 💪 |

---

## Technologies Used

### Backend
- C#
- .NET
- MongoDB

### Frontend
- React
- TypeScript

### Development Tools
- Git & GitHub
- Axios
- REST APIs
- xUnit

---

## Features Implemented

### Backend Development
- Extended the `Goal` model by adding an optional `Icon` property.
- Updated the REST API to support storing and retrieving goal icons.
- Integrated MongoDB persistence for the new field.

### Frontend Development
- Added an emoji picker to the goal creation interface.
- Updated the UI to display icons alongside each goal.
- Managed the new application state using React and TypeScript.

### API Integration
- Connected the frontend to the updated backend using Axios.
- Sent icon data through API requests when creating or updating goals.
- Verified end-to-end functionality across the application.

### Testing
- Wrote unit tests using xUnit.
- Verified that the new functionality behaved correctly without affecting existing features.

### Version Control
- Used Git for source control.
- Created commits and a pull request following a collaborative development workflow.

---

## Skills Demonstrated

- Full-stack software development
- React & TypeScript
- C# and .NET development
- MongoDB integration
- REST API design and consumption
- Unit testing with xUnit
- Git version control
- Reading and extending an existing codebase
- Feature implementation in a production-style environment

---

## About the Simulation

Unlike a tutorial built from scratch, this virtual experience required working within an existing application, understanding its architecture, and implementing a production-ready feature while following professional software engineering practices similar to those used at Commonwealth Bank.
