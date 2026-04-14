import { useState, useRef, useCallback } from 'react'
import { locale } from '@/lib/locale'
import { services } from '@/lib/services'
import { CheckIcon, ArrowRightIcon, PhoneIcon, ServiceIcon, ShieldIcon, ClockIcon, StarIcon } from './Icons'

interface LeadFormProps {
  preselectedService?: string
  town?: string
}

// SVG icons for services (visual grid, not dropdown)
const serviceIcons: Record<string, string> = {
  emergency: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
  bathroom: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
  boilerInstall: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z',
  boilerRepair: 'M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085',
  drains: 'M12 2.25c0 0-7.5 7.5-7.5 12.75a7.5 7.5 0 0015 0C19.5 9.75 12 2.25 12 2.25z',
  leaks: 'M12 2.25c0 0-7.5 7.5-7.5 12.75a7.5 7.5 0 0015 0C19.5 9.75 12 2.25 12 2.25z',
  wetRoom: 'M12 2.25c0 0-7.5 7.5-7.5 12.75a7.5 7.5 0 0015 0C19.5 9.75 12 2.25 12 2.25z',
  centralHeating: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z',
  underfloor: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z',
  gasSafety: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
}

// Conditional fields per service
const conditionalFields: Record<string, { label: string; options: string[] }[]> = {
  boilerRepair: [
    { label: 'Boiler Brand', options: ['Worcester Bosch', 'Vaillant', 'Baxi', 'Ideal', 'Viessmann', 'Other / Not Sure'] },
    { label: 'Fault Type', options: ['No heating', 'No hot water', 'Leaking', 'Strange noise', 'Error code', 'Not sure'] },
    { label: 'Boiler Age', options: ['Under 5 years', '5-10 years', '10-15 years', '15+ years', 'Not sure'] },
  ],
  boilerInstall: [
    { label: 'Current Boiler Type', options: ['Combi boiler', 'System boiler', 'Back boiler', 'No boiler currently', 'Not sure'] },
    { label: 'Preferred Brand', options: ['Worcester Bosch', 'Vaillant', 'Baxi', 'Ideal', 'No preference'] },
  ],
  drains: [
    { label: 'Drain Location', options: ['Kitchen', 'Bathroom', 'Outside', 'Multiple drains', 'Not sure'] },
    { label: 'Severity', options: ['Slow draining', 'Fully blocked', 'Overflowing', 'Bad smell'] },
  ],
  leaks: [
    { label: 'Leak Location', options: ['Under sink', 'Ceiling', 'Wall', 'Radiator', 'Pipe', 'Not visible'] },
    { label: 'Water Turned Off?', options: ['Yes', 'No', 'Not sure how'] },
  ],
  emergency: [
    { label: 'Type of Emergency', options: ['Burst pipe', 'Major leak', 'Flooding', 'No hot water', 'Gas smell', 'Other'] },
    { label: 'Water Turned Off?', options: ['Yes', 'No', 'Not sure how'] },
  ],
  bathroom: [
    { label: 'Project Type', options: ['Full bathroom refit', 'Shower replacement', 'Suite upgrade', 'Disability adaptation'] },
    { label: 'Current State', options: ['Need full strip-out', 'Partial renovation', 'New build / extension', 'Not sure yet'] },
  ],
  wetRoom: [
    { label: 'Room Size', options: ['Small (under 4sqm)', 'Medium (4-8sqm)', 'Large (8sqm+)', 'Not sure'] },
    { label: 'Access Needs', options: ['Level-access / mobility', 'Standard wet room', 'Both considered'] },
  ],
  centralHeating: [
    { label: 'System Type', options: ['Full new system', 'Upgrade existing', 'Add radiators', 'Smart controls'] },
    { label: 'Number of Radiators', options: ['1-5', '6-10', '11-15', '15+', 'Not sure'] },
  ],
  underfloor: [
    { label: 'System Preference', options: ['Wet (water-based)', 'Electric', 'No preference / advise me'] },
    { label: 'Floor Type', options: ['Tile', 'Wood', 'Concrete', 'Carpet', 'Mixed / Not sure'] },
  ],
  gasSafety: [
    { label: 'Property Type', options: ['Rental / landlord', 'Own home', 'Commercial', 'HMO'] },
    { label: 'Number of Gas Appliances', options: ['1', '2', '3', '4+'] },
  ],
}

// Cost estimates per service
const costEstimates: Record<string, { range: string; note: string }> = {
  emergency: { range: '£100 - £400', note: 'No call-out fee. Final cost depends on work needed.' },
  bathroom: { range: '£4,000 - £15,000', note: 'Includes full design, supply and fit.' },
  boilerInstall: { range: '£2,500 - £4,500', note: 'Includes boiler, installation and warranty.' },
  boilerRepair: { range: '£150 - £500', note: 'Diagnosis fee included. Parts extra if needed.' },
  drains: { range: '£80 - £250', note: 'CCTV survey included on blockages.' },
  leaks: { range: '£100 - £500', note: 'Non-invasive detection. Repair cost depends on access.' },
  wetRoom: { range: '£6,000 - £12,000', note: 'Includes full waterproofing and tiling.' },
  centralHeating: { range: '£3,000 - £6,000', note: 'Full system with smart controls.' },
  underfloor: { range: '£3,000 - £8,000', note: 'Depends on system type and area size.' },
  gasSafety: { range: '£60 - £90', note: 'CP12 certificate. Same-day service available.' },
}

export default function LeadForm({ preselectedService, town }: LeadFormProps) {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [lookingUpPostcode, setLookingUpPostcode] = useState(false)
  const [photos, setPhotos] = useState<File[]>([])
  const [photoPreview, setPhotoPreview] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
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
    smsOptIn: true,
    conditionalAnswers: {} as Record<string, string>,
  })

  const update = (field: string, value: string | boolean) => setForm(prev => ({ ...prev, [field]: value }))
  const updateConditional = (field: string, value: string) =>
    setForm(prev => ({ ...prev, conditionalAnswers: { ...prev.conditionalAnswers, [field]: value } }))

  // Postcode to town auto-detect
  const lookupPostcode = useCallback(async (postcode: string) => {
    const cleaned = postcode.replace(/\s/g, '').toUpperCase()
    if (cleaned.length < 5) return
    setLookingUpPostcode(true)
    try {
      const res = await fetch(`https://api.postcodes.io/postcodes/${cleaned}`)
      const data = await res.json()
      if (data.status === 200 && data.result) {
        const town = data.result.admin_ward || data.result.admin_district || ''
        update('town', town)
      }
    } catch {
      // Silent fail — town field stays as-is
    } finally {
      setLookingUpPostcode(false)
    }
  }, [])

  // Photo handling
  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (photos.length + files.length > 5) return
    setPhotos(prev => [...prev, ...files])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => setPhotoPreview(prev => [...prev, ev.target?.result as string])
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (idx: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx))
    setPhotoPreview(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'conditionalAnswers') {
          formData.append(k, JSON.stringify(v))
        } else {
          formData.append(k, String(v))
        }
      })
      photos.forEach(p => formData.append('photos', p))

      await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          photoCount: photos.length,
        }),
      })
      setSubmitted(true)
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  const currentService = services.find(s => s.key === form.service)
  const estimate = form.service ? costEstimates[form.service] : null
  const fields = form.service ? conditionalFields[form.service] || [] : []

  // Success state
  if (submitted) {
    return (
      <div className="bg-navy-800 border border-green-500/30 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckIcon className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Quote Request Received</h3>
        <p className="text-slate-400 mb-4">
          We&apos;ll match you with a qualified local plumber
          {form.urgency === 'emergency' ? ' within 15 minutes' : ' within 30 minutes'}.
          {form.smsOptIn && ' Check your phone for confirmation.'}
        </p>
        {estimate && (
          <div className="bg-navy-900/50 border border-white/5 rounded-xl p-4 mt-4">
            <p className="text-sm text-slate-400">Estimated cost range</p>
            <p className="text-xl font-bold text-blue-400">{estimate.range}</p>
            <p className="text-xs text-slate-500 mt-1">{estimate.note}</p>
          </div>
        )}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`tel:${locale.phoneTel}`}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <PhoneIcon className="w-4 h-4" />
            Call Now for Faster Response
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-navy-800 border border-white/10 rounded-2xl p-6 md:p-8">
      {/* Progress bar */}
      <div className="flex gap-2 mb-2">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex-1">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${s <= step ? 'bg-blue-500' : 'bg-white/10'}`} />
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-500 mb-6">
        <span className={step >= 1 ? 'text-blue-400' : ''}>Service</span>
        <span className={step >= 2 ? 'text-blue-400' : ''}>Details</span>
        <span className={step >= 3 ? 'text-blue-400' : ''}>Contact</span>
      </div>

      {/* Trust bar */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-6 text-xs text-slate-400">
        <span className="flex items-center gap-1"><ShieldIcon className="w-3.5 h-3.5 text-green-400" /> Gas Safe Registered</span>
        <span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5 text-blue-400" /> Avg. response: 12 min</span>
        <span className="flex items-center gap-1"><StarIcon className="w-3.5 h-3.5 text-yellow-400" /> 4.8/5 from 2,847 reviews</span>
      </div>

      <h3 className="text-lg font-bold text-white mb-1">
        {step === 1 && 'What do you need?'}
        {step === 2 && 'Job Details'}
        {step === 3 && 'Your Details'}
      </h3>
      <p className="text-slate-400 text-sm mb-6">
        {step === 1 && 'Select your service and urgency level'}
        {step === 2 && 'Help us understand the job so we can give an accurate quote'}
        {step === 3 && 'Nearly done — so we can send your free quotes'}
      </p>

      {/* ============ STEP 1: Service + Urgency ============ */}
      {step === 1 && (
        <div className="space-y-5">
          {!preselectedService && (
            <div>
              <label className="block text-sm text-slate-300 mb-3">Service Required</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {services.map(s => (
                  <button
                    key={s.key}
                    onClick={() => update('service', s.key)}
                    className={`relative p-3 rounded-xl border text-left transition-all group ${
                      form.service === s.key
                        ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/30'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
                      form.service === s.key ? 'bg-blue-500/20' : 'bg-white/5 group-hover:bg-white/10'
                    }`}>
                      <ServiceIcon service={s.icon} className={`w-5 h-5 ${form.service === s.key ? 'text-blue-400' : 'text-slate-400'}`} />
                    </div>
                    <div className={`text-sm font-medium leading-tight ${form.service === s.key ? 'text-blue-400' : 'text-slate-300'}`}>
                      {s.name}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{s.priceRange}</div>
                    {form.service === s.key && (
                      <div className="absolute top-2 right-2">
                        <CheckIcon className="w-4 h-4 text-blue-400" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {preselectedService && currentService && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex items-center gap-3">
              <ServiceIcon service={currentService.icon} className="w-6 h-6 text-blue-400" />
              <div>
                <div className="text-sm font-medium text-white">{currentService.name}</div>
                <div className="text-xs text-slate-400">{currentService.priceRange}</div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm text-slate-300 mb-3">How urgent is this?</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'emergency', label: 'Emergency', sub: 'Within hours', color: 'red' },
                { value: 'soon', label: 'This Week', sub: 'Not urgent', color: 'yellow' },
                { value: 'planning', label: 'Planning', sub: 'Getting quotes', color: 'green' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => update('urgency', opt.value)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    form.urgency === opt.value
                      ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/30'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full mx-auto mb-2 ${
                    opt.color === 'red' ? 'bg-red-400' :
                    opt.color === 'yellow' ? 'bg-yellow-400' : 'bg-green-400'
                  }`} />
                  <div className={`text-sm font-medium ${form.urgency === opt.value ? 'text-blue-400' : 'text-slate-300'}`}>
                    {opt.label}
                  </div>
                  <div className="text-xs opacity-60 mt-0.5 text-slate-400">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {form.urgency === 'emergency' && (
            <a
              href={`tel:${locale.phoneTel}`}
              className="flex items-center justify-center gap-2 w-full bg-red-500/20 border border-red-500/30 text-red-300 py-3 rounded-xl text-sm font-medium hover:bg-red-500/30 transition-colors"
            >
              <PhoneIcon className="w-4 h-4" />
              Need help now? Call {locale.phone}
            </a>
          )}

          <button
            onClick={() => setStep(2)}
            disabled={!form.service || !form.urgency}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
          >
            Continue <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ============ STEP 2: Details ============ */}
      {step === 2 && (
        <div className="space-y-5">
          {/* Conditional fields for selected service */}
          {fields.map(field => (
            <div key={field.label}>
              <label className="block text-sm text-slate-300 mb-2">{field.label}</label>
              <div className="flex flex-wrap gap-2">
                {field.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => updateConditional(field.label, opt)}
                    className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                      form.conditionalAnswers[field.label] === opt
                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                        : 'border-white/10 hover:border-white/20 text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Property Type */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">Property Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { value: 'House', icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' },
                { value: 'Flat', icon: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21' },
                { value: 'Bungalow', icon: 'M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m-7.5 0H3.375c-.621 0-1.125-.504-1.125-1.125V9.75M21.75 9.75v10.125c0 .621-.504 1.125-1.125 1.125H15.75m-7.5 0h7.5M12 2.25l9 7.5-1.5 0M12 2.25l-9 7.5 1.5 0' },
                { value: 'Commercial', icon: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15' },
              ].map(type => (
                <button
                  key={type.value}
                  onClick={() => update('propertyType', type.value)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    form.propertyType === type.value
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-white/10 hover:border-white/20 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <svg className={`w-5 h-5 mx-auto mb-1 ${form.propertyType === type.value ? 'text-blue-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={type.icon} />
                  </svg>
                  <div className="text-xs font-medium">{type.value}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Postcode with auto-lookup */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">Postcode</label>
            <div className="relative">
              <input
                type="text"
                value={form.postcode}
                onChange={e => {
                  update('postcode', e.target.value)
                  if (e.target.value.replace(/\s/g, '').length >= 5) {
                    lookupPostcode(e.target.value)
                  }
                }}
                placeholder="e.g. SW1A 1AA"
                className="w-full bg-navy-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 placeholder:text-slate-500"
              />
              {lookingUpPostcode && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            {form.town && !town && (
              <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                <CheckIcon className="w-3 h-3" /> {form.town}
              </p>
            )}
          </div>

          {/* Budget for premium services */}
          {(form.service === 'bathroom' || form.service === 'wetRoom' || form.service === 'centralHeating' || form.service === 'underfloor' || form.service === 'boilerInstall') && (
            <div>
              <label className="block text-sm text-slate-300 mb-2">Budget Range</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'under-3k', label: `Under ${locale.currency}3,000` },
                  { value: '3k-5k', label: `${locale.currency}3,000 - ${locale.currency}5,000` },
                  { value: '5k-10k', label: `${locale.currency}5,000 - ${locale.currency}10,000` },
                  { value: '10k-plus', label: `${locale.currency}10,000+` },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => update('budget', opt.value)}
                    className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                      form.budget === opt.value
                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                        : 'border-white/10 hover:border-white/20 text-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Photo upload */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Photos of the job <span className="text-slate-500">(optional, up to 5)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {photoPreview.map((src, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(idx)}
                    className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center text-xs rounded-bl-lg"
                  >
                    X
                  </button>
                </div>
              ))}
              {photos.length < 5 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 rounded-lg border-2 border-dashed border-white/10 hover:border-blue-500/30 flex flex-col items-center justify-center text-slate-500 hover:text-blue-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                  </svg>
                  <span className="text-[10px] mt-0.5">Add</span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoAdd}
              className="hidden"
            />
            <p className="text-xs text-slate-500 mt-1">Photos help plumbers give more accurate quotes</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">Describe the job <span className="text-slate-500">(optional)</span></label>
            <textarea
              value={form.description}
              onChange={e => update('description', e.target.value)}
              rows={3}
              placeholder="Tell us more about what you need..."
              className="w-full bg-navy-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 placeholder:text-slate-500 resize-none"
            />
          </div>

          {/* Cost estimate teaser */}
          {estimate && (
            <div className="bg-navy-900/50 border border-blue-500/10 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-blue-400 text-lg font-bold">{locale.currency}</span>
              </div>
              <div>
                <p className="text-sm text-white font-medium">Typical cost: {estimate.range}</p>
                <p className="text-xs text-slate-400">{estimate.note}</p>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="px-4 py-3.5 border border-white/10 rounded-xl text-slate-300 text-sm hover:bg-white/5 transition-colors">Back</button>
            <button
              onClick={() => setStep(3)}
              disabled={!form.postcode}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              Continue <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============ STEP 3: Contact Details ============ */}
      {step === 3 && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-slate-300 mb-2">Your Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              placeholder="Full name"
              className="w-full bg-navy-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
              placeholder="07xxx xxxxxx"
              className="w-full bg-navy-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-navy-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 placeholder:text-slate-500"
            />
          </div>

          {/* Preferred callback time */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">Best time to call you?</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'asap', label: 'ASAP' },
                { value: 'morning', label: 'Morning' },
                { value: 'afternoon', label: 'Afternoon' },
                { value: 'evening', label: 'Evening' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => update('preferredTime', opt.value)}
                  className={`py-2 rounded-lg border text-xs font-medium transition-all ${
                    form.preferredTime === opt.value
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-white/10 hover:border-white/20 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* SMS opt-in */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 transition-all shrink-0 ${
              form.smsOptIn ? 'bg-blue-500 border-blue-500' : 'border-white/20 group-hover:border-white/40'
            }`} onClick={() => update('smsOptIn', !form.smsOptIn)}>
              {form.smsOptIn && <CheckIcon className="w-3 h-3 text-white" />}
            </div>
            <span className="text-sm text-slate-400" onClick={() => update('smsOptIn', !form.smsOptIn)}>
              Text me plumber details via SMS <span className="text-slate-500">(98% of quotes are read within 3 minutes via SMS)</span>
            </span>
          </label>

          {/* Summary */}
          <div className="bg-navy-900/50 border border-white/5 rounded-xl p-4 space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Quote Summary</p>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Service</span>
              <span className="text-white font-medium">{currentService?.name || form.service}</span>
            </div>
            {form.town && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Area</span>
                <span className="text-white">{form.town}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Urgency</span>
              <span className="text-white capitalize">{form.urgency}</span>
            </div>
            {estimate && (
              <div className="flex justify-between text-sm border-t border-white/5 pt-2 mt-2">
                <span className="text-slate-400">Est. Cost</span>
                <span className="text-blue-400 font-medium">{estimate.range}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button onClick={() => setStep(2)} className="px-4 py-3.5 border border-white/10 rounded-xl text-slate-300 text-sm hover:bg-white/5 transition-colors">Back</button>
            <button
              onClick={handleSubmit}
              disabled={!form.name || !form.phone || submitting}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>Get Free Quotes</>
              )}
            </button>
          </div>

          <p className="text-xs text-slate-500 text-center">
            By submitting, you agree to receive quotes from local plumbers. No obligation, 100% free.
          </p>
        </div>
      )}

      {/* Mobile call CTA - fixed to bottom on mobile */}
      {form.urgency === 'emergency' && step > 1 && (
        <div className="mt-4 md:hidden">
          <a
            href={`tel:${locale.phoneTel}`}
            className="flex items-center justify-center gap-2 w-full bg-red-500 text-white py-3 rounded-xl text-sm font-medium"
          >
            <PhoneIcon className="w-4 h-4" />
            Emergency? Call Now
          </a>
        </div>
      )}
    </div>
  )
}
