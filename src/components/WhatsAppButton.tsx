'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'qimmo_wa_seen'
const WA_URL = 'https://wa.me/34609019160?text=Hola%2C%20me%20interesa%20informaci%C3%B3n'

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false)
  const [messageVisible, setMessageVisible] = useState(false)
  const [seen, setSeen] = useState(true) // optimistic: assume seen until we check localStorage

  // Check localStorage on mount
  useEffect(() => {
    const wasSeen = localStorage.getItem(STORAGE_KEY)
    if (!wasSeen) {
      setSeen(false)
    }
  }, [])

  // When chat opens: mark as seen and trigger message bubble after 600ms
  useEffect(() => {
    if (open) {
      if (!seen) {
        setSeen(true)
        localStorage.setItem(STORAGE_KEY, '1')
      }
      const timer = setTimeout(() => setMessageVisible(true), 600)
      return () => clearTimeout(timer)
    } else {
      // Reset message visibility when closed so it animates again if reopened
      // (only reset if we want to re-animate; keep visible once shown is also fine)
    }
  }, [open])

  const toggle = () => setOpen((prev) => !prev)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Chat dialog */}
      {open && (
        <div
          style={{
            width: 320,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: '#fff',
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: '#075E54',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img
                src="/quim.png"
                alt="Joaquín de Oses"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {/* Online dot */}
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 10,
                  height: 10,
                  backgroundColor: '#25D366',
                  borderRadius: '50%',
                  border: '2px solid #075E54',
                  display: 'block',
                }}
              />
            </div>

            {/* Name + status */}
            <div style={{ flex: 1 }}>
              <p
                style={{
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 14,
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Joaquín de Oses
              </p>
              <p
                style={{
                  color: '#9de1b3',
                  fontSize: 11,
                  margin: 0,
                  marginTop: 2,
                  lineHeight: 1,
                }}
              >
                En línea
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={toggle}
              aria-label="Cerrar chat"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#fff',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.8,
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
            </button>
          </div>

          {/* Chat area */}
          <div
            style={{
              backgroundColor: '#ECE5DD',
              padding: '16px 12px',
              minHeight: 120,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {/* Typing indicator or message bubble */}
            {!messageVisible ? (
              /* Typing indicator */
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
                <img
                  src="/quim.png"
                  alt=""
                  style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
                <div
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '0 12px 12px 12px',
                    padding: '10px 14px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
                    display: 'flex',
                    gap: 4,
                    alignItems: 'center',
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        backgroundColor: '#aaa',
                        display: 'block',
                        animation: 'waDot 1.2s infinite',
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                  <style>{`
                    @keyframes waDot {
                      0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
                      40% { transform: scale(1); opacity: 1; }
                    }
                  `}</style>
                </div>
              </div>
            ) : (
              /* Message bubble */
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 6,
                  animation: 'waFadeIn 0.3s ease',
                }}
              >
                <style>{`
                  @keyframes waFadeIn {
                    from { opacity: 0; transform: translateY(6px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
                <img
                  src="/quim.png"
                  alt=""
                  style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
                <div
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '0 16px 16px 16px',
                    padding: '10px 12px 6px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
                    maxWidth: 230,
                  }}
                >
                  <p
                    style={{
                      fontSize: 14,
                      color: '#111',
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    👋 Bienvenido a qimmo. ¿En qué te puedo ayudar?
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: '#999',
                      margin: 0,
                      marginTop: 4,
                      textAlign: 'right',
                    }}
                  >
                    Ahora
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              backgroundColor: '#fff',
              padding: '10px 12px',
              borderTop: '1px solid #f0f0f0',
            }}
          >
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                backgroundColor: '#25D366',
                color: '#fff',
                fontWeight: 600,
                fontSize: 14,
                padding: '10px 16px',
                borderRadius: 10,
                textDecoration: 'none',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#20c05c')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#25D366')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Abrir WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={toggle}
        aria-label="Abrir chat de WhatsApp"
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: '#25D366',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(37,211,102,0.4)',
          position: 'relative',
          transition: 'background-color 0.15s, transform 0.15s',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#20c05c'
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#25D366'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        {open ? (
          /* X icon when open */
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          /* WhatsApp icon when closed */
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}

        {/* Notification dot */}
        {!seen && !open && (
          <span
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 18,
              height: 18,
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              border: '2px solid #fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1,
            }}
          >
            1
          </span>
        )}
      </button>
    </div>
  )
}
