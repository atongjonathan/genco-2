import { createFileRoute } from '@tanstack/react-router'
import ContentHeader from './-components/ContentHeader'
import Content from './-components/Content'

export const Route = createFileRoute('/_authenticated/_app/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <ContentHeader />
        <Content />
    </>
  )
}
