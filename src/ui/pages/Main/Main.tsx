import React from 'react'
import styled from 'styled-components'
import Drawer from '../../surfaces/drawer/Drawer'
import Navbar from '../../surfaces/navbar/Navbar'
import { media } from '../../utils/media'
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
          <LeftSection>
            <AccountsSection />
            <GoalsSection />
          </LeftSection>

          <RightSection>
            <TransactionsSection />
          </RightSection>
        </Content>
      </MainSection>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  background: rgb(var(--background));
  overflow: hidden;
`

const MainSection = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const Content = styled.div`
  flex: 1;
  display: flex;
  gap: 30px;
  padding: 25px;
  overflow-y: auto;

  ${media('<desktop')} {
    flex-direction: column;
    padding: 20px;
  }
`

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const RightSection = styled.div`
  width: 420px;
  display: flex;
  flex-direction: column;

  ${media('<desktop')} {
    width: 100%;
  }
`