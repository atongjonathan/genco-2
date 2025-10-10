import { createFileRoute } from '@tanstack/react-router';
import Content from './-components/Content';
import ContentHeader from './-components/ContentHeader';

export const Route = createFileRoute('/_authenticated/_app/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <ContentHeader title="Dashboard" url="/" heading="" />
      <Content />
    </>
  );
}
