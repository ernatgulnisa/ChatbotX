import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import BotBuilderPage from "./pages/BotBuilderPage"
import ClientsPage from "./pages/ClientsPage"
import ChatPage from "./pages/ChatPage"
import ChatsPage from "./pages/ChatsPage"
import BroadcastPage from "./pages/BroadcastPage"
import CalendarPage from "./pages/CalendarPage"
import SettingsPage from "@/pages/SettingsPage"
import DealsPage from "@/pages/DealsPage"
import { Sidebar } from "@/components/layout/Sidebar"

function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/bots" element={<BotBuilderPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/chat/:clientId" element={<ChatPage />} />
          <Route path="/chats" element={<ChatsPage />} />
          <Route path="/chats/:clientId" element={<ChatsPage />} />
          <Route path="/marketing" element={<BroadcastPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/deals" element={<DealsPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
