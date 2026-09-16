import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { LanguageProvider } from '@/context/LanguageProvider'
import { ThemeProvider } from '@/context/ThemeProvider'
import { MoodProvider } from '@/context/MoodProvider'
import { BreatheProvider } from '@/context/BreatheProvider'
import { Layout } from '@/components/Layout'
import Home from '@/pages/Home'
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"

// Route-based code-splitting: each section loads on demand (keeps the
// initial bundle light — all visuals are code-generated, so chunks stay small).
const News = lazy(() => import('@/pages/News'))
const MedicalTourism = lazy(() => import('@/pages/MedicalTourism'))
const Mind = lazy(() => import('@/pages/Mind'))
const Stories = lazy(() => import('@/pages/Stories'))
const Verified = lazy(() => import('@/pages/Verified'))
const Directory = lazy(() => import('@/pages/Directory'))
const Events = lazy(() => import('@/pages/Events'))
const Live = lazy(() => import('@/pages/Live'))
const Connect = lazy(() => import('@/pages/Connect'))
const AdminApp = lazy(() => import('@/pages/admin/AdminApp'))

/**
 * Routing contract (react-dev.md): NESTED-ROUTE pattern — Layout renders <Outlet/>
 * and all pages are children of `<Route element={<Layout/>}>`. Do not pass
 * <Routes> as Layout children.
 *
 * Page agents: replace ONLY your own file in src/pages/. Shared chrome
 * (Navbar/Footer/Layout/providers) is owned by the scaffold.
 */
export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <MoodProvider>
          <BreatheProvider>
            <Suspense fallback={null}>
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="news" element={<News />} />
                  <Route path="medical-tourism" element={<MedicalTourism />} />
                  <Route path="mind" element={<Mind />} />
                  <Route path="stories" element={<Stories />} />
                  <Route path="verified" element={<Verified />} />
                  <Route path="directory" element={<Directory />} />
                  <Route path="events" element={<Events />} />
                  <Route path="live" element={<Live />} />
                  <Route path="connect" element={<Connect />} />
                  <Route path="admin" element={<AdminApp />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BreatheProvider>
        </MoodProvider>
      </ThemeProvider>
    </LanguageProvider>
  )
}
