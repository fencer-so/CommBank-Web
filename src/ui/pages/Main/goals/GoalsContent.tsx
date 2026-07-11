import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useAppSelector } from '../../../../store/hooks'
import { selectGoalsMap } from '../../../../store/goalsSlice'
import { media } from '../../../utils/media'
import GoalCard from './GoalCard'
import { filterGoalsBySearch } from './filterGoals'

type Props = { ids: string[] | null }

export default function GoalsContent(props: Props) {
  const [search, setSearch] = useState('')
  const goalsMap = useAppSelector(selectGoalsMap)

  if (!props.ids) return null

  const filteredIds = useMemo(() => {
    const goals = props.ids.map((id) => goalsMap[id]).filter(Boolean)
    return filterGoalsBySearch(goals, search).map((goal) => goal.id)
  }, [goalsMap, props.ids, search])

  return (
    <Container>
      <SearchInput
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search goals"
        aria-label="Search goals"
      />
      <CardsContainer>
        {filteredIds.map((id) => (
          <GoalCard key={id} id={id} />
        ))}
      </CardsContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  padding: 2rem 4rem 4rem;

  ${media('<tablet')} {
    width: 100%;
    padding-left: 0;
    padding-right: 0;
  }
`

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(174, 174, 174, 0.4);
  border-radius: 999px;
  font-size: 1rem;
`

const CardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  overflow-x: auto;

  ${media('<tablet')} {
    padding-left: 0;
    padding-right: 0;
  }
`
