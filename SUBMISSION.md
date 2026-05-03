# Goal Icon Feature Submission

This file contains the modified code for the Goal Icon feature.

## 1. package.json
```json
{
  "name": "commbank-web",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@date-io/date-fns": "^1.3.13",
    "@fortawesome/free-regular-svg-icons": "^6.1.1",
    "@fortawesome/free-solid-svg-icons": "^6.1.1",
    "@fortawesome/react-fontawesome": "^0.1.18",
    "@material-ui/core": "^4.12.4",
    "@material-ui/pickers": "^3.3.10",
    "@reduxjs/toolkit": "^1.5.1",
    "@types/emoji-mart": "^3.0.5",
    "@types/node": "^17.0.41",
    "@types/react": "^16.9.0",
    "@types/react-redux": "^7.1.7",
    "axios": "^1.15.2",
    "css-in-js-media": "^2.0.1",
    "date-fns": "^2.28.0",
    "emoji-mart": "^3.0.1",
    "file-loader": "^6.2.0",
    "prettier": "^2.6.2",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-redux": "^7.2.0",
    "react-scripts": "5.0.1",
    "sass": "^1.52.3",
    "styled-components": "^5.3.5",
    "typescript": "^4.7.3",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "format": "prettier --config .prettierrc 'src/**/*.ts*' --write"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@types/emoji-mart": "^3.0.9",
    "@types/react-dom": "^18.0.5",
    "@types/styled-components": "^5.1.25"
  }
}
```

## 2. src/api/types.ts
```typescript
export interface Account {
  id: string
  number: number
  name: string
  balance: number
  accountType: AccountType
  applicationId: string
  transactionIds: string[]
}

export interface Application {
  id: string
  created: Date
  modified: Date
  accountType: AccountType
  applicationStatus: ApplicationStatus
  userId: string
}

export interface Goal {
  id: string
  name: string
  targetAmount: number
  balance: number
  targetDate: Date
  created: Date
  accountId: string
  transactionIds: string[]
  tagIds: string[]
  publicIcon?: string
}

export interface Tag {
  id: string
  name: string
}

export interface Transaction {
  id: string
  transactionType: 'Debit' | 'Credit' | 'Transfer'
  amount: number
  dateTime: Date
  goalId?: string
  description: string
  tagIds: string[]
}

export interface User {
  id: string
  name: string
  email: string
  applicationIds: string[]
}

export enum AccountType {
  GoalSaver,
  NetBankSaver,
}

export enum ApplicationStatus {
  Received,
  Assigned,
  UnderReview,
  Approved,
  Rejected,
}

export type ModalContent = Goal
export type ModalType = 'Goal'
```

## 3. src/ui/pages/Main/goals/GoalCard.tsx
```typescript
import React from 'react'
import styled from 'styled-components'
import { selectGoalsMap } from '../../../../store/goalsSlice'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import {
  setContent as setContentRedux,
  setIsOpen as setIsOpenRedux,
  setType as setTypeRedux
} from '../../../../store/modalSlice'
import { Card } from '../../../components/Card'

type Props = { id: string }

export default function GoalCard(props: Props) {
  const dispatch = useAppDispatch()

  const goal = useAppSelector(selectGoalsMap)[props.id]

  const onClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    dispatch(setContentRedux(goal))
    dispatch(setTypeRedux('Goal'))
    dispatch(setIsOpenRedux(true))
  }

  const asLocaleDateString = (date: Date) => new Date(date).toLocaleDateString()

  return (
    <Container key={goal.id} onClick={onClick}>
      {goal.publicIcon && <GoalIcon>{goal.publicIcon}</GoalIcon>}
      <TargetAmount>${goal.targetAmount}</TargetAmount>
      <TargetDate>{asLocaleDateString(goal.targetDate)}</TargetDate>
    </Container>
  )
}

const Container = styled(Card)`
  display: flex;
  flex-direction: column;
  min-height: 140px;
  min-width: 140px;
  width: 33%;
  cursor: pointer;
  margin-left: 2rem;
  margin-right: 2rem;
  border-radius: 2rem;

  align-items: center;
`
const TargetAmount = styled.h2`
  font-size: 2rem;
`

const TargetDate = styled.h4`
  color: rgba(174, 174, 174, 1);
  font-size: 1rem;
`

const GoalIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 0.5rem;
`
```

## 4. src/ui/features/goalmanager/GoalManager.tsx
```typescript
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import { faDollarSign, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import 'date-fns'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { updateGoal as updateGoalApi } from '../../../api/lib'
import { Goal } from '../../../api/types'
import { selectGoalsMap, updateGoal as updateGoalRedux } from '../../../store/goalsSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import DatePicker from '../../components/DatePicker'
import { Theme } from '../../components/Theme'
import EmojiPicker from '../../components/EmojiPicker'
import { BaseEmoji } from 'emoji-mart'
import { faSmile } from '@fortawesome/free-solid-svg-icons'

type Props = { goal: Goal }
export function GoalManager(props: Props) {
  const dispatch = useAppDispatch()

  const goal = useAppSelector(selectGoalsMap)[props.goal.id]

  const [name, setName] = useState<string | null>(null)
  const [targetDate, setTargetDate] = useState<Date | null>(null)
  const [targetAmount, setTargetAmount] = useState<number | null>(null)
  const [publicIcon, setPublicIcon] = useState<string | null>(null)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

  useEffect(() => {
    setName(props.goal.name)
    setTargetDate(props.goal.targetDate)
    setTargetAmount(props.goal.targetAmount)
    setPublicIcon(props.goal.publicIcon ?? null)
  }, [
    props.goal.id,
    props.goal.name,
    props.goal.targetDate,
    props.goal.targetAmount,
    props.goal.publicIcon,
  ])

  useEffect(() => {
    setName(goal.name)
  }, [goal.name])

  const updateNameOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextName = event.target.value
    setName(nextName)
    const updatedGoal: Goal = {
      ...props.goal,
      name: nextName,
    }
    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(props.goal.id, updatedGoal)
  }

  const updateTargetAmountOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextTargetAmount = parseFloat(event.target.value)
    setTargetAmount(nextTargetAmount)
    const updatedGoal: Goal = {
      ...props.goal,
      name: name ?? props.goal.name,
      targetDate: targetDate ?? props.goal.targetDate,
      targetAmount: nextTargetAmount,
    }
    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(props.goal.id, updatedGoal)
  }

  const pickDateOnChange = (date: MaterialUiPickersDate) => {
    if (date != null) {
      setTargetDate(date)
      const updatedGoal: Goal = {
        ...props.goal,
        name: name ?? props.goal.name,
        targetDate: date ?? props.goal.targetDate,
        targetAmount: targetAmount ?? props.goal.targetAmount,
      }
      dispatch(updateGoalRedux(updatedGoal))
      updateGoalApi(props.goal.id, updatedGoal)
    }
  }

  const pickEmojiOnClick = (emoji: BaseEmoji) => {
    const nextIcon = emoji.native
    setPublicIcon(nextIcon)
    setIsEmojiPickerOpen(false)
    const updatedGoal: Goal = {
      ...props.goal,
      name: name ?? props.goal.name,
      targetDate: targetDate ?? props.goal.targetDate,
      targetAmount: targetAmount ?? props.goal.targetAmount,
      publicIcon: nextIcon,
    }
    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(props.goal.id, updatedGoal)
  }

  const toggleEmojiPicker = () => setIsEmojiPickerOpen(!isEmojiPickerOpen)

  return (
    <GoalManagerContainer>
      <IconAndNameWrapper>
        <EmojiPickerWrapper>
          <EmojiPickerContainer isOpen={isEmojiPickerOpen} hasIcon={!!publicIcon}>
            <EmojiPicker onClick={pickEmojiOnClick} />
          </EmojiPickerContainer>
          <AddIconButtonContainer shouldShow={!publicIcon} onClick={toggleEmojiPicker}>
            <FontAwesomeIcon icon={faSmile} size="2x" />
          </AddIconButtonContainer>
          <GoalIconContainer shouldShow={!!publicIcon} onClick={toggleEmojiPicker}>
            {publicIcon}
          </GoalIconContainer>
        </EmojiPickerWrapper>
        <NameInput value={name ?? ''} onChange={updateNameOnChange} />
      </IconAndNameWrapper>

      <Group>
        <Field name="Target Date" icon={faCalendarAlt} />
        <Value>
          <DatePicker value={targetDate} onChange={pickDateOnChange} />
        </Value>
      </Group>

      <Group>
        <Field name="Target Amount" icon={faDollarSign} />
        <Value>
          <StringInput value={targetAmount ?? ''} onChange={updateTargetAmountOnChange} />
        </Value>
      </Group>

      <Group>
        <Field name="Balance" icon={faDollarSign} />
        <Value>
          <StringValue>{props.goal.balance}</StringValue>
        </Value>
      </Group>

      <Group>
        <Field name="Date Created" icon={faCalendarAlt} />
        <Value>
          <StringValue>{new Date(props.goal.created).toLocaleDateString()}</StringValue>
        </Value>
      </Group>
    </GoalManagerContainer>
  )
}

type FieldProps = { name: string; icon: IconDefinition }
type AddIconButtonContainerProps = { shouldShow: boolean }
type GoalIconContainerProps = { shouldShow: boolean }
type EmojiPickerContainerProps = { isOpen: boolean; hasIcon: boolean }

const Field = (props: FieldProps) => (
  <FieldContainer>
    <FontAwesomeIcon icon={props.icon} size="2x" />
    <FieldName>{props.name}</FieldName>
  </FieldContainer>
)

const GoalManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
  width: 100%;
  position: relative;
`

const Group = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
`
const NameInput = styled.input`
  display: flex;
  background-color: transparent;
  outline: none;
  border: none;
  font-size: 4rem;
  font-weight: bold;
  color: ${({ theme }: { theme: Theme }) => theme.text};
`

const FieldName = styled.h1`
  font-size: 1.8rem;
  margin-left: 1rem;
  color: rgba(174, 174, 174, 1);
  font-weight: normal;
`
const FieldContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 20rem;

  svg {
    color: rgba(174, 174, 174, 1);
  }
`
const StringValue = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
`
const StringInput = styled.input`
  display: flex;
  background-color: transparent;
  outline: none;
  border: none;
  font-size: 1.8rem;
  font-weight: bold;
  color: ${({ theme }: { theme: Theme }) => theme.text};
`

const Value = styled.div`
  margin-left: 2rem;
`

const IconAndNameWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 2rem;
`

const EmojiPickerWrapper = styled.div`
  position: relative;
  margin-right: 1.5rem;
`

const AddIconButtonContainer = styled.div<AddIconButtonContainerProps>`
  display: ${({ shouldShow }) => (shouldShow ? 'flex' : 'none')};
  cursor: pointer;
  color: rgba(174, 174, 174, 1);
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`

const GoalIconContainer = styled.div<GoalIconContainerProps>`
  display: ${({ shouldShow }) => (shouldShow ? 'flex' : 'none')};
  cursor: pointer;
  font-size: 3rem;
`

const EmojiPickerContainer = styled.div<EmojiPickerContainerProps>`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: absolute;
  top: 4rem;
  left: 0;
  z-index: 100;
`
```

## 5. backend: CommBank.Tests/GoalControllerTests.cs
```csharp
using CommBank.Controllers;
using CommBank.Services;
using CommBank.Models;
using CommBank.Tests.Fake;
using Microsoft.AspNetCore.Mvc;

namespace CommBank.Tests;

public class GoalControllerTests
{
    private readonly FakeCollections collections;

    public GoalControllerTests()
    {
        collections = new();
    }

    [Fact]
    public async void GetAll()
    {
        // Arrange
        var goals = collections.GetGoals();
        var users = collections.GetUsers();
        IGoalsService goalsService = new FakeGoalsService(goals, goals[0]);
        IUsersService usersService = new FakeUsersService(users, users[0]);
        GoalController controller = new(goalsService, usersService);

        // Act
        var httpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext();
        controller.ControllerContext.HttpContext = httpContext;
        var result = await controller.Get();

        // Assert
        var index = 0;
        foreach (Goal goal in result)
        {
            Assert.IsAssignableFrom<Goal>(goal);
            Assert.Equal(goals[index].Id, goal.Id);
            Assert.Equal(goals[index].Name, goal.Name);
            index++;
        }
    }

    [Fact]
    public async void Get()
    {
        // Arrange
        var goals = collections.GetGoals();
        var users = collections.GetUsers();
        IGoalsService goalsService = new FakeGoalsService(goals, goals[0]);
        IUsersService usersService = new FakeUsersService(users, users[0]);
        GoalController controller = new(goalsService, usersService);

        // Act
        var httpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext();
        controller.ControllerContext.HttpContext = httpContext;
        var result = await controller.Get(goals[0].Id!);

        // Assert
        Assert.IsAssignableFrom<Goal>(result.Value);
        Assert.Equal(goals[0], result.Value);
        Assert.NotEqual(goals[1], result.Value);
    }

    [Fact]
    public async void GetForUser()
    {
        // Arrange
        var goals = collections.GetGoals();
        var users = collections.GetUsers();
        IGoalsService goalsService = new FakeGoalsService(goals, goals[0]);
        IUsersService usersService = new FakeUsersService(users, users[0]);
        GoalController controller = new(goalsService, usersService);

        // Act
        var httpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext();
        controller.ControllerContext.HttpContext = httpContext;
        var result = await controller.GetForUser(users[0].Id!);

        // Assert
        Assert.IsAssignableFrom<List<Goal>>(result);
        Assert.Equal(goals.Count, result?.Count);
        Assert.Equal(goals[0].Id, result?[0].Id);
    }
}
```

