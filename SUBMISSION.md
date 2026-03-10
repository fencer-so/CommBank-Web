# CommBank Goal Tracker – Submission (single file)

## Pull request(s)

- **commbank-web:** <!-- After creating the PR on GitHub, replace with your link, e.g. https://github.com/effileo/commbank-web/pull/1 -->
- **commbank-server:** <!-- e.g. https://github.com/effileo/commbank-server/pull/1 -->

---

## 1. Overview

This document contains the **summary**, **Postman test proof**, and **full source patch** for the frontend tasks (goal model, icon on card, emoji picker, goal manager add/change icons, PUT in lib, pickEmojiOnClick). It also documents **coverage of the GetGoalsForUser route** (backend test in the commbank-server repo).

---

## 2. What was implemented

| Area | Change |
|------|--------|
| **Goal model** | Added `icon: string \| null` in `src/api/types.ts` |
| **Goal card** | Display icon on card in `GoalCard.tsx` |
| **Emoji picker** | `EmojiPicker.tsx` – theme from Redux, `onClick(emoji, event)` |
| **Goal manager** | "Add icon" / "Change icon", `pickEmojiOnClick` calls `updateGoalApi` |
| **API lib** | `updateGoal(goalId, updatedGoal)` sends PUT to `/api/Goal/{id}` |
| **Scripts** | `npx react-scripts`; React types aligned to v17 |

---

## 2b. GetGoalsForUser route – covered by backend test

The **GetGoalsForUser** route is covered by a unit test in the **commbank-server** repo:

- **Repo:** commbank-server  
- **File:** `CommBank.Tests\GoalControllerTests.cs`  
- **Test:** `GetForUser()`

The test follows the task spec: **Arrange/Act** mirror the existing `Get` test (FakeCollections, FakeGoalsService, FakeUsersService, GoalController, HttpContext); **Act** calls `controller.GetForUser(userId)`; **Assert** checks that `result` is not null and that each returned goal is assignable from `Goal` and has the expected `UserId`. All 11 tests in the solution pass (`dotnet test` in commbank-server).

---

## 3. Postman test – emoji persists after refresh

**Request:** `GET http://localhost:11366/api/Goal/User/62a29c15f4605c4c9fa7f306`  
**User ID** from `src/data/user.ts`.

**Result (200 OK):** Goals returned with `icon` field. Example:

```json
[
  {
    "id": "69b03a47b53ab9e2b144138c",
    "name": null,
    "icon": "😂",
    "targetAmount": 0,
    "targetDate": "2026-03-10T15:35:35.602Z",
    "balance": 0,
    "created": "2026-03-10T15:35:35.617Z",
    "transactionIds": null,
    "tagIds": null,
    "userId": "62a29c15f4605c4c9fa7f306"
  },
  {
    "id": "69b03b1ab53ab9e2b144138d",
    "name": null,
    "icon": "😀",
    "targetAmount": 0,
    "targetDate": "2026-03-10T15:39:06.134Z",
    "balance": 0,
    "created": "2026-03-10T15:39:06.139Z",
    "transactionIds": null,
    "tagIds": null,
    "userId": "62a29c15f4605c4c9fa7f306"
  }
]
```

Icons (e.g. 😂 and 😀) are stored by the API and returned on GET, so they persist after client refresh.

---

## 4. How to apply the patch

From the **commbank-web** repo root run:

```bash
git apply task2.patch
```

(Or apply the patch content below manually.)

---

## 5. Full patch (source only)

```patch
diff --git a/package.json b/package.json
index 87958ce..7c97338 100644
--- a/package.json
+++ b/package.json
@@ -12,9 +12,9 @@
     "@reduxjs/toolkit": "^1.5.1",
     "@types/emoji-mart": "^3.0.5",
     "@types/node": "^17.0.41",
-    "@types/react": "^16.9.0",
+    "@types/react": "^17.0.0",
     "@types/react-redux": "^7.1.7",
-    "axios": "^0.27.2",
+    "axios": "^1.13.6",
     "css-in-js-media": "^2.0.1",
     "date-fns": "^2.28.0",
     "emoji-mart": "^3.0.1",
@@ -30,10 +30,10 @@
     "web-vitals": "^2.1.4"
   },
   "scripts": {
-    "start": "react-scripts start",
-    "build": "react-scripts build",
-    "test": "react-scripts test",
-    "eject": "react-scripts eject",
+    "start": "npx react-scripts start",
+    "build": "npx react-scripts build",
+    "test": "npx react-scripts test",
+    "eject": "npx react-scripts eject",
     "format": "prettier --config .prettierrc 'src/**/*.ts*' --write"
   },
   "eslintConfig": {
@@ -56,7 +56,7 @@
   },
   "devDependencies": {
     "@types/emoji-mart": "^3.0.9",
-    "@types/react-dom": "^18.0.5",
+    "@types/react-dom": "^17.0.0",
     "@types/styled-components": "^5.1.25"
   }
-}
\ No newline at end of file
+}
diff --git a/src/api/types.ts b/src/api/types.ts
index f75edad..8cbabc0 100644
--- a/src/api/types.ts
+++ b/src/api/types.ts
@@ -27,6 +27,7 @@ export interface Goal {
   accountId: string
   transactionIds: string[]
   tagIds: string[]
+  icon: string | null
 }
 
 export interface Tag {
diff --git a/src/ui/features/goalmanager/AddIconButton.tsx b/src/ui/features/goalmanager/AddIconButton.tsx
index d0c8c2c..c4a34ad 100644
--- a/src/ui/features/goalmanager/AddIconButton.tsx
+++ b/src/ui/features/goalmanager/AddIconButton.tsx
@@ -21,11 +21,14 @@ export default function AddIconButton(props: Props) {
 }
 
 const Container = styled.div`
+  display: flex;
   flex-direction: row;
-  align-items: flex-end;
+  align-items: center;
 `
 const Text = styled.span`
   margin-left: 0.6rem;
   font-size: 1.5rem;
   color: rgba(174, 174, 174, 1);
+  text-decoration: underline;
+  cursor: pointer;
 `
diff --git a/src/ui/features/goalmanager/GoalManager.tsx b/src/ui/features/goalmanager/GoalManager.tsx
index 0779dda..93df74e 100644
--- a/src/ui/features/goalmanager/GoalManager.tsx
+++ b/src/ui/features/goalmanager/GoalManager.tsx
@@ -1,6 +1,7 @@
 import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
 import { faDollarSign, IconDefinition } from '@fortawesome/free-solid-svg-icons'
 import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
+import { BaseEmoji } from 'emoji-mart'
 import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
 import 'date-fns'
 import React, { useEffect, useState } from 'react'
@@ -10,7 +11,11 @@ import { Goal } from '../../../api/types'
 import { selectGoalsMap, updateGoal as updateGoalRedux } from '../../../store/goalsSlice'
 import { useAppDispatch, useAppSelector } from '../../../store/hooks'
 import DatePicker from '../../components/DatePicker'
+import EmojiPicker from '../../components/EmojiPicker'
 import { Theme } from '../../components/Theme'
+import { media } from '../../utils/media'
+import AddIconButton from './AddIconButton'
+import GoalIcon from './GoalIcon'
 
 type Props = { goal: Goal }
 export function GoalManager(props: Props) {
@@ -21,21 +26,37 @@ export function GoalManager(props: Props) {
   const [name, setName] = useState<string | null>(null)
   const [targetDate, setTargetDate] = useState<Date | null>(null)
   const [targetAmount, setTargetAmount] = useState<number | null>(null)
+  const [icon, setIcon] = useState<string | null>(null)
+  const [emojiPickerIsOpen, setEmojiPickerIsOpen] = useState(false)
 
   useEffect(() => {
     setName(props.goal.name)
     setTargetDate(props.goal.targetDate)
     setTargetAmount(props.goal.targetAmount)
-  }, [
-    props.goal.id,
-    props.goal.name,
-    props.goal.targetDate,
-    props.goal.targetAmount,
-  ])
+    setIcon(props.goal.icon ?? null)
+  }, [props.goal.id])
 
-  useEffect(() => {
-    setName(goal.name)
-  }, [goal.name])
+  const hasIcon = () => icon != null
+
+  const addIconOnClick = (event: React.MouseEvent) => {
+    event.stopPropagation()
+    setEmojiPickerIsOpen(true)
+  }
+
+  const pickEmojiOnClick = (emoji: BaseEmoji, event: React.MouseEvent) => {
+    event.stopPropagation()
+    setIcon(emoji.native)
+    setEmojiPickerIsOpen(false)
+    const updatedGoal: Goal = {
+      ...props.goal,
+      icon: emoji.native ?? props.goal.icon,
+      name: name ?? props.goal.name,
+      targetDate: targetDate ?? props.goal.targetDate,
+      targetAmount: targetAmount ?? props.goal.targetAmount,
+    }
+    dispatch(updateGoalRedux(updatedGoal))
+    updateGoalApi(props.goal.id, updatedGoal)
+  }
 
   const updateNameOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
     const nextName = event.target.value
@@ -79,6 +100,25 @@ export function GoalManager(props: Props) {
     <GoalManagerContainer>
       <NameInput value={name ?? ''} onChange={updateNameOnChange} />
 
+      <IconGroup>
+        <IconLabel>Icon</IconLabel>
+        <IconControls>
+          <GoalIconContainer shouldShow={hasIcon()}>
+            <GoalIcon icon={goal.icon ?? null} onClick={addIconOnClick} />
+            <ChangeIconHint onClick={addIconOnClick}>Change icon</ChangeIconHint>
+          </GoalIconContainer>
+          <AddIconButton hasIcon={hasIcon()} onClick={addIconOnClick} />
+        </IconControls>
+      </IconGroup>
+
+      <EmojiPickerContainer
+        isOpen={emojiPickerIsOpen}
+        hasIcon={hasIcon()}
+        onClick={(event) => event.stopPropagation()}
+      >
+        <EmojiPicker onClick={pickEmojiOnClick} />
+      </EmojiPickerContainer>
+
       <Group>
         <Field name="Target Date" icon={faCalendarAlt} />
         <Value>
@@ -115,6 +155,67 @@ type AddIconButtonContainerProps = { shouldShow: boolean }
 type GoalIconContainerProps = { shouldShow: boolean }
 type EmojiPickerContainerProps = { isOpen: boolean; hasIcon: boolean }
 
+const IconGroup = styled.div`
+  display: flex;
+  flex-direction: column;
+  align-items: flex-start;
+  width: 100%;
+  margin-top: 1.25rem;
+  margin-bottom: 1.25rem;
+  gap: 0.75rem;
+`
+
+const IconLabel = styled.span`
+  font-size: 1.8rem;
+  color: rgba(174, 174, 174, 1);
+  font-weight: normal;
+`
+
+const IconControls = styled.div`
+  display: flex;
+  flex-direction: row;
+  flex-wrap: wrap;
+  align-items: center;
+  gap: 1rem;
+`
+
+const GoalIconContainer = styled.div<GoalIconContainerProps>`
+  display: ${(props) => (props.shouldShow ? 'flex' : 'none')};
+  flex-direction: column;
+  align-items: flex-start;
+  gap: 0.5rem;
+`
+
+const ChangeIconHint = styled.button`
+  background: none;
+  border: none;
+  padding: 0;
+  font-size: 1.4rem;
+  color: rgba(174, 174, 174, 1);
+  cursor: pointer;
+  text-decoration: underline;
+  font-family: inherit;
+
+  &:hover {
+    color: ${({ theme }: { theme: Theme }) => theme.text};
+  }
+`
+
+const EmojiPickerContainer = styled.div<EmojiPickerContainerProps>`
+  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
+  position: absolute;
+  top: ${(props) => (props.hasIcon ? '10rem' : '2rem')};
+  left: 0;
+  z-index: 10;
+
+  ${media('<tablet')} {
+    top: ${(props) => (props.hasIcon ? '8rem' : '1.5rem')};
+    left: 0;
+    right: 0;
+    justify-content: center;
+  }
+`
+
 const Field = (props: FieldProps) => (
   <FieldContainer>
     <FontAwesomeIcon icon={props.icon} size="2x" />
@@ -135,18 +236,35 @@ const GoalManagerContainer = styled.div`
 const Group = styled.div`
   display: flex;
   flex-direction: row;
+  flex-wrap: wrap;
   width: 100%;
   margin-top: 1.25rem;
   margin-bottom: 1.25rem;
+  gap: 0.5rem;
+
+  ${media('<tablet')} {
+    flex-direction: column;
+    align-items: flex-start;
+  }
 `
 const NameInput = styled.input`
   display: flex;
+  width: 100%;
+  max-width: 100%;
   background-color: transparent;
   outline: none;
   border: none;
   font-size: 4rem;
   font-weight: bold;
   color: ${({ theme }: { theme: Theme }) => theme.text};
+
+  ${media('<desktop')} {
+    font-size: 3rem;
+  }
+
+  ${media('<tablet')} {
+    font-size: 2rem;
+  }
 `
 
 const FieldName = styled.h1`
@@ -160,10 +278,15 @@ const FieldContainer = styled.div`
   flex-direction: row;
   align-items: center;
   width: 20rem;
+  min-width: 0;
 
   svg {
     color: rgba(174, 174, 174, 1);
   }
+
+  ${media('<tablet')} {
+    width: 100%;
+  }
 `
 const StringValue = styled.h1`
   font-size: 1.8rem;
@@ -181,4 +304,9 @@ const StringInput = styled.input`
 
 const Value = styled.div`
   margin-left: 2rem;
+
+  ${media('<tablet')} {
+    margin-left: 0;
+    width: 100%;
+  }
 `
diff --git a/src/ui/pages/Main/Main.tsx b/src/ui/pages/Main/Main.tsx
index 714f091..2a8faeb 100644
--- a/src/ui/pages/Main/Main.tsx
+++ b/src/ui/pages/Main/Main.tsx
@@ -2,7 +2,6 @@ import React from 'react'
 import styled from 'styled-components'
 import Drawer from '../../surfaces/drawer/Drawer'
 import Navbar from '../../surfaces/navbar/Navbar'
-import { media } from '../../utils/media'
 import AccountsSection from './accounts/AccountsSection'
 import GoalsSection from './goals/GoalsSection'
 import TransactionsSection from './transactions/TransactionsSection'
@@ -40,11 +39,13 @@ const MainSection = styled.div`
   display: flex;
   flex-direction: column;
   width: calc(100% - 250px);
+  min-width: 0;
   height: 100%;
+  overflow: auto;
 
-  ${media('<=tablet')} {
+  @media (max-width: 768px) {
     width: 100%;
-    overflow: scroll;
+    -webkit-overflow-scrolling: touch;
   }
 `
 
@@ -52,15 +53,16 @@ const Content = styled.div`
   display: flex;
   flex-direction: row;
   width: 100%;
+  min-width: 0;
   height: 100%;
   justify-content: space-around;
   align-items: center;
 
-  ${media('<desktop')} {
+  @media (max-width: 600px) {
     flex-direction: column;
     justify-content: flex-start;
-    flex-wrap: none;
-    overflow-y: scroll;
+    overflow-y: auto;
+    -webkit-overflow-scrolling: touch;
   }
 `
 
@@ -68,10 +70,11 @@ const Group = styled.div`
   display: flex;
   flex-direction: column;
   height: 100%;
+  min-width: 0;
   align-items: center;
   justify-content: center;
 
-  ${media('<=tablet')} {
+  @media (max-width: 600px) {
     width: 100%;
     justify-content: flex-start;
   }
diff --git a/src/ui/pages/Main/accounts/AccountsSection.tsx b/src/ui/pages/Main/accounts/AccountsSection.tsx
index 3543ba0..9af4658 100644
--- a/src/ui/pages/Main/accounts/AccountsSection.tsx
+++ b/src/ui/pages/Main/accounts/AccountsSection.tsx
@@ -43,4 +43,11 @@ const TopGroup = styled.div`
 const Img = styled.img`
   width: 350px;
   height: 209px;
+  max-width: 100%;
+  object-fit: contain;
+
+  ${media('<tablet')} {
+    width: 100%;
+    height: auto;
+  }
 `
diff --git a/src/ui/pages/Main/goals/GoalCard.tsx b/src/ui/pages/Main/goals/GoalCard.tsx
index e8f6d0a..f127472 100644
--- a/src/ui/pages/Main/goals/GoalCard.tsx
+++ b/src/ui/pages/Main/goals/GoalCard.tsx
@@ -1,6 +1,7 @@
 import React from 'react'
 import styled from 'styled-components'
 import { selectGoalsMap } from '../../../../store/goalsSlice'
+import { media } from '../../../utils/media'
 import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
 import {
   setContent as setContentRedux,
@@ -27,30 +28,44 @@ export default function GoalCard(props: Props) {
 
   return (
     <Container key={goal.id} onClick={onClick}>
+      {goal.icon != null && <Icon>{goal.icon}</Icon>}
       <TargetAmount>${goal.targetAmount}</TargetAmount>
       <TargetDate>{asLocaleDateString(goal.targetDate)}</TargetDate>
     </Container>
   )
 }
 
+const Icon = styled.h1`
+  font-size: 5.5rem;
+  ${media('<tablet')} {
+    font-size: 3.5rem;
+  }
+`
+
 const Container = styled(Card)`
   display: flex;
   flex-direction: column;
   min-height: 140px;
   min-width: 140px;
-  width: 33%;
+  flex: 0 0 auto;
+  width: 180px;
   cursor: pointer;
-  margin-left: 2rem;
-  margin-right: 2rem;
+  margin-left: 1rem;
+  margin-right: 1rem;
   border-radius: 2rem;
-
   align-items: center;
 `
 const TargetAmount = styled.h2`
   font-size: 2rem;
+  ${media('<tablet')} {
+    font-size: 1.5rem;
+  }
 `
 
 const TargetDate = styled.h4`
   color: rgba(174, 174, 174, 1);
   font-size: 1rem;
+  ${media('<tablet')} {
+    font-size: 0.85rem;
+  }
 `
diff --git a/src/ui/pages/Main/goals/GoalsContent.tsx b/src/ui/pages/Main/goals/GoalsContent.tsx
index 75c1f7f..78f4d3c 100644
--- a/src/ui/pages/Main/goals/GoalsContent.tsx
+++ b/src/ui/pages/Main/goals/GoalsContent.tsx
@@ -20,15 +20,15 @@ export default function GoalsContent(props: Props) {
 const Container = styled.div`
   display: flex;
   flex-direction: row;
+  flex-wrap: nowrap;
   justify-content: flex-start;
   width: 400px;
-  padding: 4rem;
+  padding: 2rem 4rem;
   overflow-x: auto;
+  -webkit-overflow-scrolling: touch;
 
   ${media('<tablet')} {
     width: 100%;
-
-    padding-left: 0;
-    padding-right: 0;
+    padding: 1rem 2rem;
   }
 `
diff --git a/src/ui/surfaces/modal/Modal.tsx b/src/ui/surfaces/modal/Modal.tsx
index 32cd963..77d8a72 100644
--- a/src/ui/surfaces/modal/Modal.tsx
+++ b/src/ui/surfaces/modal/Modal.tsx
@@ -1,6 +1,7 @@
 import React from 'react'
 import styled from 'styled-components'
 import { Goal } from '../../../api/types'
+import { media } from '../../utils/media'
 import { useAppSelector } from '../../../store/hooks'
 import { selectContent, selectIsOpen, selectType } from '../../../store/modalSlice'
 import { GoalManager } from '../../features/goalmanager/GoalManager'
@@ -28,9 +29,22 @@ export const Container = styled.div`
   width: 85%;
   max-width: 1000px;
   height: 85%;
-  max-width: 1000px;
+  max-height: 90vh;
   background-color: ${({ theme }) => theme.modalBackground};
   border-radius: 2rem;
-  padding: 8rem;
+  padding: 4rem 8rem;
   z-index: 100;
+  overflow-y: auto;
+
+  ${media('<desktop')} {
+    width: 90%;
+    padding: 3rem 4rem;
+  }
+
+  ${media('<tablet')} {
+    width: 95%;
+    max-height: 85vh;
+    padding: 2rem 1.5rem;
+    border-radius: 1rem;
+  }
 `
diff --git a/src/ui/surfaces/navbar/Navbar.tsx b/src/ui/surfaces/navbar/Navbar.tsx
index 35c8358..2577264 100644
--- a/src/ui/surfaces/navbar/Navbar.tsx
+++ b/src/ui/surfaces/navbar/Navbar.tsx
@@ -47,9 +47,18 @@ const Container = styled.div`
   justify-content: flex-end;
   position: sticky;
   top: 0;
-  padding: 1.5rem 1.5rem;
+  padding: 1.5rem;
   width: 100%;
+  min-width: 0;
   height: 8rem;
+  flex-shrink: 0;
+  background-color: ${({ theme }) => theme.background};
+  z-index: 1;
+
+  ${media('<tablet')} {
+    padding: 0.75rem 1rem;
+    height: 5rem;
+  }
 `
 
 const NavbarActions = styled.div`

```
