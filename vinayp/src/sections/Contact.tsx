import { useRef, useState, type FormEvent } from 'react'
import { AlertCircle, ArrowUpRight, Check, Copy, Mail, Send } from 'lucide-react'
import { DevNote, GithubIcon, LinkedinIcon, Reveal, Section, SectionHeading } from '../components/ui'
import { contact } from '../config/site'

type Field = 'name' | 'email' | 'message'
type Errors = Partial<Record<Field, string>>
type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'success'; message: string }
  | { kind: 'info'; message: string }
  | { kind: 'error'; message: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(v: Record<Field, string>): Errors {
  const e: Errors = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your name (at least 2 characters).'
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address.'
  if (v.message.trim().length < 10) e.message = 'Your message should be at least 10 characters.'
  else if (v.message.length > 2000) e.message = 'Please keep your message under 2000 characters.'
  return e
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}

export function Contact() {
  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    if (!contact.email) return
    const ok = await copyText(contact.email)
    setCopied(ok)
    if (ok) window.setTimeout(() => setCopied(false), 2200)
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    // Honeypot: real people never fill this hidden field.
    if (String(data.get('company') ?? '').length > 0) return

    const values = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    }
    const errs = validate(values)
    setErrors(errs)
    const firstBad = (['name', 'email', 'message'] as Field[]).find((f) => errs[f])
    if (firstBad) {
      setStatus({ kind: 'error', message: 'Please fix the highlighted fields and try again.' })
      form.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus()
      return
    }

    // 1) A real delivery service is configured → send and report the true result.
    if (contact.formEndpoint) {
      setStatus({ kind: 'sending' })
      try {
        const res = await fetch(contact.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(values),
        })
        if (res.ok) {
          setStatus({ kind: 'success', message: 'Thanks — your message was sent. I’ll get back to you soon.' })
          form.reset()
        } else {
          let detail = ''
          try {
            const body = (await res.json()) as { errors?: { message?: string }[] }
            detail = body.errors?.map((x) => x.message).filter(Boolean).join(' ') ?? ''
          } catch {
            /* ignore non-JSON error bodies */
          }
          setStatus({
            kind: 'error',
            message: `The message could not be sent${detail ? ` (${detail})` : ''}. Please try again${contact.email ? ' or email me directly' : ''}.`,
          })
        }
      } catch {
        setStatus({
          kind: 'error',
          message: 'Network error — the message was not sent. Please check your connection and try again.',
        })
      }
      return
    }

    // 2) No service, but an email is known → open the visitor's mail app (nothing is sent yet).
    if (contact.email) {
      const subject = encodeURIComponent(`Portfolio message from ${values.name.trim()}`)
      const body = encodeURIComponent(`${values.message.trim()}\n\n— ${values.name.trim()} (${values.email.trim()})`)
      window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`
      setStatus({
        kind: 'info',
        message: 'Your email app should open with this message pre-filled. Nothing has been sent until you press send there.',
      })
      return
    }

    // 3) Nothing connected → be honest.
    setStatus({
      kind: 'error',
      message: 'This contact form is not connected to a delivery service yet, so the message was not sent.',
    })
  }

  const hasLinks = contact.email || contact.github || contact.linkedin
  const describe = (f: Field) => (errors[f] ? `err-${f}` : undefined)

  const inputCls = (f: Field) =>
    `w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-base text-bone placeholder:text-dim transition-colors focus:border-volt focus:outline-none focus:ring-2 focus:ring-volt/30 ${
      errors[f] ? 'border-red-400/70' : 'border-white/12'
    }`

  return (
    <Section id="contact" labelledBy="contact-title">
      <SectionHeading index="07" eyebrow="Contact" id="contact-title">
        Have an Interesting Idea? <span className="serif-accent">Let’s Connect.</span>
      </SectionHeading>

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <p className="max-w-md text-lg text-mute">
            Whether it’s a project, an internship conversation or just a technical idea worth
            exploring, I’d like to hear it.
          </p>

          <ul className="mt-10 space-y-3">
            {contact.email && (
              <li className="glass flex items-center justify-between gap-3 rounded-2xl p-4">
                <a href={`mailto:${contact.email}`} className="flex min-w-0 items-center gap-3">
                  <Mail size={18} className="shrink-0 text-volt" aria-hidden="true" />
                  <span className="truncate">{contact.email}</span>
                </a>
                <button
                  type="button"
                  onClick={onCopy}
                  className="inline-flex shrink-0 items-center gap-2 rounded-md border border-white/15 px-3.5 py-1.5 text-sm hover:bg-white/10"
                  aria-label={copied ? 'Email copied' : 'Copy email address'}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </li>
            )}
            {contact.github && (
              <li>
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="glass flex items-center justify-between rounded-2xl p-4 transition-colors hover:border-white/25"
                >
                  <span className="flex items-center gap-3">
                    <GithubIcon className="h-[18px] w-[18px] text-volt" /> GitHub
                  </span>
                  <ArrowUpRight size={16} className="text-mute" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            )}
            {contact.linkedin && (
              <li>
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="glass flex items-center justify-between rounded-2xl p-4 transition-colors hover:border-white/25"
                >
                  <span className="flex items-center gap-3">
                    <LinkedinIcon className="h-[18px] w-[18px] text-volt" /> LinkedIn
                  </span>
                  <ArrowUpRight size={16} className="text-mute" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            )}
          </ul>
          {!hasLinks && (
            <DevNote>
              No contact links configured. Copy .env.example to .env and set VITE_CONTACT_EMAIL,
              VITE_GITHUB_URL and VITE_LINKEDIN_URL.
            </DevNote>
          )}
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-7">
          <form
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            className="glass space-y-5 rounded-2xl p-6 sm:p-9 ticks"
            aria-label="Contact form"
          >
            {/* honeypot */}
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
              <label>
                Company
                <input type="text" name="company" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <div>
              <label htmlFor="cf-name" className="eyebrow mb-2 block">
                Name
              </label>
              <input
                id="cf-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                className={inputCls('name')}
                aria-invalid={!!errors.name}
                aria-describedby={describe('name')}
              />
              {errors.name && (
                <p id="err-name" className="mt-2 text-sm text-red-300">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="cf-email" className="eyebrow mb-2 block">
                Email
              </label>
              <input
                id="cf-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={inputCls('email')}
                aria-invalid={!!errors.email}
                aria-describedby={describe('email')}
              />
              {errors.email && (
                <p id="err-email" className="mt-2 text-sm text-red-300">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="cf-message" className="eyebrow mb-2 block">
                Message
              </label>
              <textarea
                id="cf-message"
                name="message"
                rows={6}
                placeholder="Tell me about your idea…"
                className={`${inputCls('message')} resize-y`}
                aria-invalid={!!errors.message}
                aria-describedby={describe('message')}
              />
              {errors.message && (
                <p id="err-message" className="mt-2 text-sm text-red-300">
                  {errors.message}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" className="btn btn-primary" disabled={status.kind === 'sending'}>
                {status.kind === 'sending' ? 'Sending…' : 'Send message'}
                <Send size={15} aria-hidden="true" />
              </button>
              {!contact.formEndpoint && (
                <p className="text-xs text-dim">
                  {contact.email
                    ? 'Opens your email app with the message pre-filled.'
                    : 'Form delivery is not configured yet.'}
                </p>
              )}
            </div>

            <div role="status" aria-live="polite" className="min-h-[1.5rem]">
              {status.kind === 'success' && (
                <p className="flex items-start gap-2 text-sm text-emerald-300">
                  <Check size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                  {status.message}
                </p>
              )}
              {status.kind === 'info' && (
                <p className="flex items-start gap-2 text-sm text-volt">
                  <Mail size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                  {status.message}
                </p>
              )}
              {status.kind === 'error' && (
                <p className="flex items-start gap-2 text-sm text-red-300">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                  {status.message}
                </p>
              )}
            </div>
            {!contact.formEndpoint && (
              <DevNote>Set VITE_CONTACT_ENDPOINT (e.g. a Formspree URL) to enable real delivery.</DevNote>
            )}
          </form>
        </Reveal>
      </div>
    </Section>
  )
}
