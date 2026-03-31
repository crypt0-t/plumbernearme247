import { useState } from 'react'
import { locale } from '@/lib/locale'
import { services } from '@/lib/services'
import { CheckIcon, ArrowRightIcon } from './Icons'

interface LeadFormProps {
  preselectedService?: string
  town?: string
}

export default function LeadForm({ preselectedService, town }: LeadFormProps) {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    service: preselectedService || '',
    urgency: '',
    propertyType: '',
    postcode: '',
    description: '',
    name: '',
    phone: '',
    email: '',
    budget: '',
    preferredTime: '',
    town: town || '',
  })

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async () => {
    try {
      await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSubmitted(true)
    } catch (e) {
      console.error(e)
    }
  }

  if (submitted) {
    return (
      <div className="bg-navy-800 border border-green-500/30 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckIcon className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Quote Request Received</h3>
        <p className="text-slate-400">We&apos;ll match you with a qualified local plumber within 30 minutes. Check your phone for confirmation.</p>
      </div>
    )
  }

  return (
    <div className="bg-navy-800 border border-white/10 rounded-2xl p-6 md:p-8">
      {/* Progress bar */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map(s => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? 'bg-blue-500' : 'bg-white/10'}`} />
        ))}
      </div>

      <h3 className="text-lg font-bold text-white mb-1">
        {step === 1 && 'What do you need?'}
        {step === 2 && 'Job Details'}
        {step === 3 && 'Your Details'}
      </h3>
      <p className="text-slate-400 text-sm mb-6">
        {step === 1 && 'Select your service and urgency level'}
        {step === 2 && 'Help us understand the job'}
        {step === 3 && 'So we can send you quotes'}
      </p>

      {/* Step 1: Service + Urgency */}
      {step === 1 && (
        <div className="space-y-4">
          {!preselectedService && (
            <div>
              <label className="block text-sm text-slate-300 mb-2">Service Required</label>
              <select
                value={form.service}
                onChange={e => update('service', e.target.value)}
                className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select a service...</option>
                {services.map(s => (
                  <option key={s.key} value={s.key}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm text-slate-300 mb-2">How urgent is this?</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'emergency', label: 'Emergency', sub: 'Within hours' },
                { value: 'soon', label: 'This Week', sub: 'Not urgent' },
                { value: 'planning', label: 'Planning', sub: 'Getting quotes' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => update('urgency', opt.value)}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    form.urgency === opt.value
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-white/10 hover:border-white/20 text-slate-300'
                  }`}
                >
                  <div className="text-sm font-medium">{opt.label}</div>
                  <div className="text-xs opacity-60 mt-0.5">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!form.service || !form.urgency}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            Continue <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Property + Postcode + Description */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-2">Property Type</label>
            <div className="grid grid-cols-2 gap-2">
              {['House', 'Flat', 'Bungalow', 'Commercial'].map(type => (
                <button
                  key={type}
                  onClick={() => update('propertyType', type)}
                  className={`p-3 rounded-lg border text-sm transition-all ${
                    form.propertyType === type
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-white/10 hover:border-white/20 text-slate-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Postcode</label>
            <input
              type="text"
              value={form.postcode}
              onChange={e => update('postcode', e.target.value)}
              placeholder="e.g. SW1A 1AA"
              className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 focus:outline-none placeholder:text-slate-500"
            />
          </div>

          {form.service === 'bathroom' || form.service === 'wetRoom' ? (
            <div>
              <label className="block text-sm text-slate-300 mb-2">Budget Range</label>
              <select
                value={form.budget}
                onChange={e => update('budget', e.target.value)}
                className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select budget range...</option>
                <option value="under-5k">Under {locale.currency}5,000</option>
                <option value="5k-8k">{locale.currency}5,000 - {locale.currency}8,000</option>
                <option value="8k-12k">{locale.currency}8,000 - {locale.currency}12,000</option>
                <option value="12k-plus">{locale.currency}12,000+</option>
              </select>
            </div>
          ) : null}

          <div>
            <label className="block text-sm text-slate-300 mb-2">Describe the job (optional)</label>
            <textarea
              value={form.description}
              onChange={e => update('description', e.target.value)}
              rows={3}
              placeholder="Tell us about the job..."
              className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 focus:outline-none placeholder:text-slate-500 resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="px-4 py-3 border border-white/10 rounded-lg text-slate-300 text-sm hover:bg-white/5">Back</button>
            <button
              onClick={() => setStep(3)}
              disabled={!form.postcode}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              Continue <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Contact Details */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-2">Your Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              placeholder="Full name"
              className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 focus:outline-none placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
              placeholder={locale.country === 'uk' ? '07xxx xxxxxx' : '(555) 123-4567'}
              className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 focus:outline-none placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              placeholder="you@email.com"
              className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 focus:outline-none placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Preferred Contact Time</label>
            <div className="grid grid-cols-3 gap-2">
              {['Morning', 'Afternoon', 'Anytime'].map(time => (
                <button
                  key={time}
                  onClick={() => update('preferredTime', time)}
                  className={`p-2 rounded-lg border text-sm transition-all ${
                    form.preferredTime === time
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-white/10 hover:border-white/20 text-slate-300'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setStep(2)} className="px-4 py-3 border border-white/10 rounded-lg text-slate-300 text-sm hover:bg-white/5">Back</button>
            <button
              onClick={handleSubmit}
              disabled={!form.name || !form.phone}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold text-sm transition-colors"
            >
              Get Free Quotes
            </button>
          </div>

          <p className="text-xs text-slate-500 text-center">
            By submitting, you agree to our privacy policy. We&apos;ll share your details with up to 3 qualified local plumbers.
          </p>
        </div>
      )}
    </div>
  )
}
