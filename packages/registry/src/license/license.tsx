import { Mail, MessageCircle } from 'lucide-react'
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export type LicenseConfig = {
  appName: string
  appId: string
  priceId: string
  price: number
  payUrl: string
  appDescription?: string
  supportUrl?: string
}

export async function createCheckout(config: Pick<LicenseConfig, 'payUrl' | 'appId' | 'priceId'>): Promise<string> {
  const res = await fetch(`${config.payUrl}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: config.appId,
      price_id: config.priceId,
      success_url: window.location.origin,
      cancel_url: window.location.href,
    }),
  })
  const { url } = await res.json()
  if (!url) throw new Error('No checkout URL')
  return url
}

export async function verifySession(config: Pick<LicenseConfig, 'payUrl' | 'appId'>, sessionId: string): Promise<boolean> {
  const res = await fetch(`${config.payUrl}/api/entitlement?app=${config.appId}&session=${encodeURIComponent(sessionId)}`)
  const { paid } = await res.json()
  return !!paid
}

export async function restoreByEmail(config: Pick<LicenseConfig, 'payUrl' | 'appId'>, email: string): Promise<boolean> {
  const res = await fetch(`${config.payUrl}/api/entitlement?app=${config.appId}&email=${encodeURIComponent(email)}`)
  const { paid } = await res.json()
  return !!paid
}

type StoredIdentity = { type: 'session'; value: string } | { type: 'email'; value: string }

function readIdentity(key: string): StoredIdentity | null {
  const raw = localStorage.getItem(key)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed?.type === 'session' || parsed?.type === 'email') {
      return parsed as StoredIdentity
    }
  } catch {}
  localStorage.removeItem(key)
  return null
}

type Callback = () => void | Promise<void>

type LicenseCtx = {
  licensed: boolean
  paywallOpen: boolean
  paywallReason?: string
  openPaywall: (reason?: string) => void
  closePaywall: () => void
  startCheckout: () => Promise<void>
  restoreByEmail: (email: string) => Promise<boolean>
  onBeforeCheckout: (fn: Callback) => void
  onPaymentSuccess: (fn: Callback) => void
  requireLicense: () => Promise<boolean>
  revoke: () => void
  _config: LicenseConfig
}

const Ctx = createContext<LicenseCtx | null>(null)

export function useLicense() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLicense must be used inside <LicenseProvider>')
  return ctx
}

export function Paywall() {
  const { paywallOpen, paywallReason, closePaywall, restoreByEmail, startCheckout, _config } = useLicense()
  const { appName, appDescription, price, supportUrl } = _config

  const [step, setStep] = useState<'choose' | 'restore' | 'restored'>('choose')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | undefined>()

  async function handleBuy() {
    setSubmitting(true)
    try {
      await startCheckout()
    } catch {
      setError("Couldn't start checkout. Please try again.")
      setSubmitting(false)
    }
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      closePaywall()
      setStep('choose')
      setEmail('')
      setError(undefined)
    }
  }

  async function handleRestore() {
    setSubmitting(true)
    setError(undefined)
    const ok = await restoreByEmail(email)
    setSubmitting(false)
    if (ok) {
      setStep('restored')
    } else {
      setError("We couldn't find a purchase for that email.")
    }
  }

  return (
    <Drawer open={paywallOpen} onOpenChange={handleOpenChange}>
      <DrawerContent className='max-w-lg mx-auto'>
        <DrawerHeader className='flex flex-col items-center px-6 pt-6 pb-2'>
          <DrawerTitle className='text-3xl font-bold'>{step === 'choose' ? `Unlock ${appName}` : step === 'restore' ? 'Restore your purchase' : 'License restored'}</DrawerTitle>
          <DrawerDescription className='text-base'>
            {step === 'choose' ? (paywallReason ?? appDescription ?? `Unlock ${appName} to continue.`) : step === 'restore' ? `Enter the email you used when you bought ${appName}` : `You're all set — enjoy ${appName}.`}
          </DrawerDescription>
        </DrawerHeader>

        <div className='px-6 pb-10 pt-4'>
          {step === 'choose' && (
            <div className='flex flex-col gap-6'>
              <Button className='w-full h-14 rounded-full text-base font-semibold cursor-pointer' disabled={submitting} onClick={handleBuy}>
                Buy —{' '}
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(price)}{' '}
                one time
              </Button>

              <div className='flex items-center justify-center gap-3 text-sm'>
                <Button type='button' onClick={() => setStep('restore')} variant='outline' className='rounded-full flex-1'>
                  <Mail className='size-4' />
                  Already bought?
                </Button>
                {supportUrl && (
                  <a href={supportUrl} target='_blank' rel='noopener noreferrer' className={cn(buttonVariants({ variant: 'outline' }), 'rounded-full flex-1')}>
                    <MessageCircle className='size-4' />
                    Need help?
                  </a>
                )}
              </div>
            </div>
          )}

          {step === 'restored' && (
            <div className='flex flex-col gap-3'>
              <Button className='w-full h-14 rounded-full text-base font-semibold' onClick={closePaywall}>
                Done
              </Button>
            </div>
          )}

          {step === 'restore' && (
            <div className='flex flex-col gap-3'>
              <Input type='email' inputMode='email' autoComplete='email' placeholder='alice@example.com' value={email} onChange={(e) => setEmail(e.target.value)} className='h-12 rounded-full px-4' />
              <Button className='w-full h-14 rounded-full text-base font-semibold' disabled={!email || submitting} onClick={handleRestore}>
                {submitting ? 'Checking…' : 'Restore'}
              </Button>
              {error && <p className='text-destructive text-xs text-center'>{error}</p>}
              <Button
                type='button'
                variant='ghost'
                className='w-full text-sm text-muted-foreground'
                onClick={() => {
                  setStep('choose')
                  setError(undefined)
                }}
              >
                Back
              </Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export function LicenseProvider({
  children,
  appName,
  appId,
  priceId,
  price,
  payUrl,
  appDescription,
  supportUrl,
}: {
  children: ReactNode
} & LicenseConfig) {
  const config = useMemo<LicenseConfig>(
    () => ({
      appName,
      appId,
      priceId,
      price,
      payUrl,
      appDescription,
      supportUrl,
    }),
    [appName, appId, priceId, price, payUrl, appDescription, supportUrl],
  )
  const key = `paid:${appId}`

  const [licensed, setLicensed] = useState(() => readIdentity(key) !== null)
  const [paywallOpen, setPaywallOpen] = useState(false)
  const [paywallReason, setPaywallReason] = useState<string>()
  const beforeCheckoutRef = useRef<Callback | undefined>(undefined)
  const paymentSuccessRef = useRef<Callback | undefined>(undefined)

  const unlock = useCallback(
    (identity: StoredIdentity) => {
      localStorage.setItem(key, JSON.stringify(identity))
      setLicensed(true)
      paymentSuccessRef.current?.()
    },
    [key],
  )

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id')
    if (sessionId && !licensed) {
      verifySession(config, sessionId).then((paid) => {
        if (paid) {
          unlock({ type: 'session', value: sessionId })
          window.history.replaceState({}, '', window.location.pathname)
        }
      })
    }
  }, [config, licensed, unlock])

  const value: LicenseCtx = {
    _config: config,
    licensed,
    paywallOpen,
    paywallReason,
    openPaywall: (reason) => {
      setPaywallReason(reason)
      setPaywallOpen(true)
    },
    closePaywall: () => setPaywallOpen(false),
    startCheckout: async () => {
      await beforeCheckoutRef.current?.()
      window.location.href = await createCheckout(config)
    },
    restoreByEmail: async (email) => {
      const ok = await restoreByEmail(config, email)
      if (ok) unlock({ type: 'email', value: email })
      return ok
    },
    onBeforeCheckout: (fn) => {
      beforeCheckoutRef.current = fn
    },
    onPaymentSuccess: (fn) => {
      paymentSuccessRef.current = fn
    },
    requireLicense: async () => {
      const identity = readIdentity(key)
      const paid = identity ? await (identity.type === 'session' ? verifySession(config, identity.value) : restoreByEmail(config, identity.value)) : false
      if (!paid) {
        localStorage.removeItem(key)
        setLicensed(false)
      }
      return paid
    },
    revoke: () => {
      localStorage.removeItem(key)
      setLicensed(false)
    },
  }

  return (
    <Ctx.Provider value={value}>
      {children}
      <Paywall />
    </Ctx.Provider>
  )
}
