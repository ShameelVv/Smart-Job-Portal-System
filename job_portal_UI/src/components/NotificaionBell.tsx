import { useState, useEffect, useRef } from "react"
import api from "../api/api"

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Notification {
  id: number
  message: string
  is_read: boolean
  created_at: string
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

function NotificationBell() {

  // useState — stores the list of notifications from API
  const [notifications, setNotifications] = useState<Notification[]>([])

  // useState — controls whether the dropdown is open or closed
  const [open, setOpen] = useState<boolean>(false)

  // useRef — used to detect clicks outside the dropdown to close it
  // useRef gives you a reference to a real DOM element
  // It does NOT cause a re-render when it changes (unlike useState)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Derived state — count of unread notifications for the badge
  const unreadCount = notifications.filter(n => !n.is_read).length

  // useEffect — fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications()
  }, [])

  // useEffect — close dropdown when user clicks outside it
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // dropdownRef.current is the actual div element
      // .contains() checks if the click was inside or outside
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await api.get("notifications/", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setNotifications(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem("token")
      await api.patch(`notifications/${id}/read/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      // Update local state — mark this notification as read
      // without refetching from API (faster UX)
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      )
    } catch (err) {
      console.log(err)
    }
  }

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token")
      await api.patch("notifications/read-all/", {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      // Mark all as read in local state
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    } catch (err) {
      console.log(err)
    }
  }

  // When a new WebSocket notification comes in, refetch the list
  // This is called from DashboardLayout when socket.onmessage fires
  // We expose this via window so DashboardLayout can call it
  useEffect(() => {
    (window as any).refreshNotifications = fetchNotifications
  }, [])

  return (
    // useRef attached here — dropdownRef.current = this div
    <div ref={dropdownRef} className="relative z-50">

      {/* ── Bell Button ─────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-violet-50 transition-all"
      >
        <span className="text-xl">🔔</span>

        {/* Unread count badge — only shows when there are unread notifications */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dropdown Inbox ──────────────────────────────────────────── */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-violet-100 z-50 animate-fade-in">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-bold text-gray-800">
              Notifications {unreadCount > 0 && (
                <span className="text-xs text-violet-600 font-semibold ml-1">
                  ({unreadCount} new)
                </span>
              )}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-violet-600 hover:text-violet-800 font-semibold transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto ">
            {notifications.length === 0 ? (
              <div className="px-4 py-4 text-center text-gray-400 text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.map((n: Notification) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 transition-colors
                    ${n.is_read ? "bg-white" : "bg-violet-50"}
                  `}
                >
                  {/* Message */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-relaxed ${n.is_read ? "text-gray-500" : "text-gray-800 font-medium"}`}
                      style={{ fontFamily: "Inter, sans-serif" }}>
                      {n.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                      {new Date(n.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>

                  {/* Mark as read tick button */}
                  {!n.is_read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      title="Mark as read"
                      className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-violet-300 hover:bg-violet-600 hover:border-violet-600 flex items-center justify-center transition-all group"
                    >
                      <span className="text-xs text-violet-400 group-hover:text-white">✓</span>
                    </button>
                  )}

                  {/* Already read indicator */}
                  {n.is_read && (
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-xs text-gray-400">✓</span>
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  )
}

export default NotificationBell