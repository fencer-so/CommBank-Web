import React, { useEffect } from 'react'
import styled from 'styled-components'
import Drawer from '../../surfaces/drawer/Drawer'
import Navbar from '../../surfaces/navbar/Navbar'
import { media } from '../../utils/media'
import AccountsSection from './accounts/AccountsSection'
import GoalsSection from './goals/GoalsSection'
import TransactionsSection from './transactions/TransactionsSection'
import { useAppDispatch } from "../../../store/hooks"
import { setGoals } from "../../../store/goalsSlice"

export default function Main() {
  const dispatch = useAppDispatch()

useEffect(() => {
  fetch("http://localhost:3001/goals")
    .then(res => res.json())
    .then(data => {
      console.log("API DATA:", data)   // 👈 ADD THIS
      dispatch(setGoals(data))
    })
    .catch(err => console.error(err))
}, [dispatch])

  return (
    <Container>
      <Drawer />

      <MainSection>
        <Navbar />

        <Content>
          <Group>
            <AccountsSection />
            <GoalsSection />
          </Group>
          <TransactionsSection />
        </Content>
      </MainSection>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
  background-color: rgb(var(--background));
  overflow: hidden;
`

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 250px);
  height: 100%;

  ${media('<=tablet')} {
    width: 100%;
    overflow: scroll;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  justify-content: space-around;
  align-items: center;

  ${media('<desktop')} {
    flex-direction: column;
    justify-content: flex-start;
    flex-wrap: none;
    overflow-y: scroll;
  }
`

const Group = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;

  ${media('<=tablet')} {
    width: 100%;
    justify-content: flex-start;
  }
`
