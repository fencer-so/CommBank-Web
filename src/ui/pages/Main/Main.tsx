import React from 'react'
import styled from 'styled-components'
import Drawer from '../../surfaces/drawer/Drawer'
import Navbar from '../../surfaces/navbar/Navbar'
import AccountsSection from './accounts/AccountsSection'
import GoalsSection from './goals/GoalsSection'
import TransactionsSection from './transactions/TransactionsSection'

export default function Main() {
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
  min-width: 0;
  height: 100%;
  overflow: auto;

  @media (max-width: 768px) {
    width: 100%;
    -webkit-overflow-scrolling: touch;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  min-width: 0;
  height: 100%;
  justify-content: space-around;
  align-items: center;

  @media (max-width: 600px) {
    flex-direction: column;
    justify-content: flex-start;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
`

const Group = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  align-items: center;
  justify-content: center;

  @media (max-width: 600px) {
    width: 100%;
    justify-content: flex-start;
  }
`
