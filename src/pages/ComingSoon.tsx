import { Link } from 'react-router-dom'
import styled from 'styled-components'
import foxWhite from '../assets/brand/fox-white.png'

interface ComingSoonProps {
  title: string
  message?: string
}

/** Stand-in for pages we haven't built yet, so nav links never 404. */
export default function ComingSoon({
  title,
  message = "We're building this page next.",
}: ComingSoonProps) {
  return (
    <Wrap>
      <Fox src={foxWhite} alt="" />
      <h1>{title}</h1>
      <p>{message}</p>
      <BackLink to="/">Back to home</BackLink>
    </Wrap>
  )
}

const Wrap = styled.section`
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 0.75rem;
  min-height: 100vh;
  padding: 6rem ${({ theme }) => theme.gutter} 4rem;
  text-align: center;

  h1 {
    font-size: clamp(1.8rem, 3vw, 3rem);
    font-weight: 600;
  }

  p {
    font-weight: 300;
    opacity: 0.75;
  }
`

const Fox = styled.img`
  width: clamp(72px, 8vw, 120px);
  height: auto;
  margin-bottom: 0.75rem;
`

const BackLink = styled(Link)`
  margin-top: 1rem;
  padding: 0.8em 2em;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
  font-weight: 500;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`
