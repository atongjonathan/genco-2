import { createFileRoute, Outlet } from '@tanstack/react-router'
import Header from './-components/Header'
import Sidebar from './-components/Sidebar'

export const Route = createFileRoute('/_authenticated/_app')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
     <div className="app-wrapper">
      <Header />
      <Sidebar />
      <Outlet />
    </div>
  )
}
