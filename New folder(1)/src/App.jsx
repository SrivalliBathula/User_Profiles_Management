import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'

/* ---------- Helper: localStorage simple wrapper ---------- */
const USER_KEY = 'um_users_v1'
function loadUsers(){
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch { return null }
}
function saveUsers(list){ try { localStorage.setItem(USER_KEY, JSON.stringify(list)) } catch {} }

/* ---------- Initial sample data (from your screenshots) ---------- */
const SAMPLE_USERS = [
  {
    id: '1',
    firstName: 'Dave',
    lastName: 'Richards',
    email: 'dave@mail.com',
    phone: '+91 8332883854',
    alternatePhone: '6332883554',
    address: 'Enter here',
    pincode: 'Enter here',
    country: 'Oximiclla country',
    state: 'Domictie state',
    gender: '',
    education: [
      {
        school: 'Lincoln College',
        degree: 'Bachelors in Techvisingy',
        course: 'Computer soencar engineering',
        year: 'Year of turthi',
        grade: ''
      }
    ],
    skills: 'MERN Stack, Technology, ng. MERN Stack',
    projects: '',
    experience: [
      { domain: 'Technalagr', subdomain: 'Duman', years: 'HERNS' }
    ],
    linkedin: 'Skadirc.com/in/ban',
    resume: 'myresume.pdf'
  },
  { id: '2', firstName: 'Abhishek', lastName: 'Hari', email: 'hari@mail.com', phone: '', education: [], skills:'', projects:'', experience:[], linkedin:'', resume:'' },
  { id: '3', firstName: 'Nishta', lastName: 'Gupta', email: 'nishta@mail.com', phone: '', education: [], skills:'', projects:'', experience:[], linkedin:'', resume:'' }
]

/* Preload sample into localStorage (only if empty) */
if (!loadUsers()) saveUsers(SAMPLE_USERS)

/* ---------- App ---------- */
export default function App(){
  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-6 max-w-6xl mx-auto">
        <Routes>
          <Route path="/" element={<UsersList />} />
          <Route path="/user/:id" element={<ProfileView />} />
        </Routes>
      </main>
    </div>
  )
}

/* ---------- Header ---------- */
function Header(){
  return (
    <header className="bg-white border-b py-4 mb-6">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-36 h-10 rounded border flex items-center justify-center text-sm font-semibold">LOGO</div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full" aria-label="notifications">🔔</button>
          <button className="p-2 rounded-full" aria-label="profile">👤</button>
        </div>
      </div>
    </header>
  )
}

/* ---------- Users List Page ---------- */
function UsersList(){
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  useEffect(()=>{
    setLoading(true)
    setTimeout(()=>{
      try {
        const saved = loadUsers()
        if (saved && Array.isArray(saved)) setUsers(saved)
        else { setUsers(SAMPLE_USERS); saveUsers(SAMPLE_USERS) }
      } catch(e){ setError('Failed to load users') }
      setLoading(false)
    }, 300)
  }, [])

  function handleDelete(id){
    if (!confirm('Delete this user?')) return
    const updated = users.filter(u => u.id !== id)
    setUsers(updated)
    saveUsers(updated)
  }

  function handleAdd(newUser){
    const u = { ...newUser, id: String(Date.now()), education: [], skills:'', projects:'', experience:[], linkedin:'', resume:'' }
    const updated = [...users, u]
    setUsers(updated)
    saveUsers(updated)
    setShowAdd(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Users</h2>
        <button onClick={()=>setShowAdd(true)} className="px-4 py-2 rounded bg-violet-600 text-white">+ Add user</button>
      </div>

      <div className="bg-white rounded-lg card-shadow overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 w-20">Sr. No</th>
              <th className="text-left p-4">User name</th>
              <th className="text-left p-4">E-mail</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={4} className="p-6 text-center">Loading users...</td></tr>}
            {error && <tr><td colSpan={4} className="p-6 text-center text-red-600">{error}</td></tr>}
            {!loading && !error && users.map((u, idx) => (
              <tr key={u.id} className="border-t">
                <td className="p-4 align-top">{idx + 1}</td>
                <td className="p-4 align-top">
                  <Link to={`/user/${u.id}`} className="hover:underline text-violet-700">{u.firstName} {u.lastName}</Link>
                </td>
                <td className="p-4 align-top">{u.email || '-'}</td>
                <td className="p-4 text-center">
                  <Link to={`/user/${u.id}`} title="View" className="mr-4">👁️</Link>
                  <button onClick={()=>handleDelete(u.id)} title="Delete">🗑️</button>
                </td>
              </tr>
            ))}
            {!loading && !error && users.length === 0 && (<tr><td colSpan={4} className="p-6 text-center">No users found</td></tr>)}
          </tbody>
        </table>
      </div>

      {showAdd && <AddUserPanel onClose={()=>setShowAdd(false)} onAdd={handleAdd} />}
    </div>
  )
}

/* ---------- Add User Slide Panel ---------- */
function AddUserPanel({ onClose, onAdd }){
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function change(e){ setForm(prev => ({ ...prev, [e.target.name]: e.target.value })) }

  async function submit(e){
    e.preventDefault()
    setError(null)
    if (!form.firstName || !form.email) { setError('Please provide name and email'); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 500))
    onAdd(form)
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="ml-auto w-full max-w-md bg-white p-6 card-shadow h-full overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add User</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm block mb-1">Name</label>
            <div className="flex gap-2">
              <input name="firstName" value={form.firstName} onChange={change} className="flex-1 border p-2 rounded" placeholder="First" />
              <input name="lastName" value={form.lastName} onChange={change} className="flex-1 border p-2 rounded" placeholder="Last" />
            </div>
          </div>

          <div>
            <label className="text-sm block mb-1">E-mail</label>
            <input name="email" value={form.email} onChange={change} className="w-full border p-2 rounded" placeholder="Type here" />
          </div>

          <div>
            <label className="text-sm block mb-1">Contact</label>
            <input name="phone" value={form.phone} onChange={change} className="w-full border p-2 rounded" placeholder="Type here" />
          </div>

          {error && <div className="text-red-600">{error}</div>}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-violet-600 text-white">{saving ? 'Adding...' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ---------- Profile View (route /user/:id) ---------- */
function ProfileView(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('basic') // 'basic' | 'education' | 'experience'
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})

  useEffect(()=> {
    setLoading(true)
    setTimeout(()=>{
      const all = loadUsers() || []
      const found = all.find(u => u.id === id)
      setUser(found || null)
      setForm(found ? clone(found) : {})
      setLoading(false)
    }, 200)
  }, [id])

  function clone(o){ return JSON.parse(JSON.stringify(o || {})) }
  function change(e){ setForm(prev => ({ ...prev, [e.target.name]: e.target.value })) }

  /* Education helpers */
  function addEducation(){
    const list = form.education || []
    list.push({ school:'', degree:'', course:'', year:'', grade:'' })
    setForm(prev => ({ ...prev, education: list }))
    setEditing(true)
  }
  function updateEducation(idx, key, value){
    const list = (form.education || []).slice()
    list[idx] = { ...list[idx], [key]: value }
    setForm(prev => ({ ...prev, education: list }))
  }
  function removeEducation(idx){
    const list = (form.education || []).filter((_,i)=>i!==idx)
    setForm(prev => ({ ...prev, education: list }))
  }

  /* Experience helpers */
  function addExperience(){
    const list = form.experience || []
    list.push({ domain:'', subdomain:'', years:'' })
    setForm(prev => ({ ...prev, experience: list }))
    setEditing(true)
  }
  function updateExperience(idx, key, value){
    const list = (form.experience || []).slice()
    list[idx] = { ...list[idx], [key]: value }
    setForm(prev => ({ ...prev, experience: list }))
  }
  function removeExperience(idx){
    const list = (form.experience || []).filter((_,i)=>i!==idx)
    setForm(prev => ({ ...prev, experience: list }))
  }

  function saveAll(){
    const all = loadUsers() || []
    const updated = all.map(u => u.id === id ? ({ ...u, ...form }) : u)
    saveUsers(updated)
    setUser({ ...user, ...form })
    setEditing(false)
    alert('Saved')
  }

  if (loading) return <div className="max-w-6xl mx-auto">Loading profile...</div>
  if (!user) return <div className="max-w-6xl mx-auto">User not found. <button onClick={()=>navigate(-1)} className="ml-2 text-violet-600">Back</button></div>

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={()=>navigate(-1)} className="text-sm text-violet-700">← Back</button>
      </div>

      {/* Profile header */}
      <div className="bg-white p-6 rounded-lg card-shadow flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-violet-50 flex items-center justify-center text-3xl">👤</div>
        <div>
          <h3 className="text-2xl font-semibold">{user.firstName} {user.lastName}</h3>
          <div className="text-sm text-gray-500">{user.email}</div>
          <div className="text-sm text-gray-500">{user.phone || ''}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-4 rounded-lg card-shadow">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Tab label="Basic Info" active={activeTab==='basic'} onClick={()=>setActiveTab('basic')} />
            <Tab label="Education & skills" active={activeTab==='education'} onClick={()=>setActiveTab('education')} />
            <Tab label="Experience" active={activeTab==='experience'} onClick={()=>setActiveTab('experience')} />
          </div>

          <div className="flex gap-2">
            <button onClick={()=>{ setEditing(prev=>!prev); if (editing) setForm(clone(user)) }} className="px-3 py-1 border rounded">{editing ? 'Cancel' : 'Edit'}</button>
            {editing && <button onClick={saveAll} className="px-4 py-2 bg-violet-600 text-white rounded">Save</button>}
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <h4 className="font-semibold">Basic Details</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm">First name</label>
                  <input name="firstName" value={form.firstName||''} onChange={change} className="w-full border p-2 rounded" disabled={!editing}/>
                </div>
                <div>
                  <label className="text-sm">Last name</label>
                  <input name="lastName" value={form.lastName||''} onChange={change} className="w-full border p-2 rounded" disabled={!editing}/>
                </div>
                <div>
                  <label className="text-sm">Email ID</label>
                  <input name="email" value={form.email||''} onChange={change} className="w-full border p-2 rounded" disabled={!editing}/>
                </div>

                <div>
                  <label className="text-sm">Phone number</label>
                  <input name="phone" value={form.phone||''} onChange={change} className="w-full border p-2 rounded" disabled={!editing}/>
                </div>
                <div>
                  <label className="text-sm">Alternate Phone</label>
                  <input name="alternatePhone" value={form.alternatePhone||''} onChange={change} className="w-full border p-2 rounded" disabled={!editing}/>
                </div>
                <div>
                  <label className="text-sm">Gender</label>
                  <select name="gender" value={form.gender||''} onChange={change} className="w-full border p-2 rounded" disabled={!editing}>
                    <option value="">Select an option</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm">Address</label>
                  <textarea name="address" value={form.address||''} onChange={change} className="w-full border p-2 rounded" disabled={!editing}></textarea>
                </div>

                <div>
                  <label className="text-sm">Pincode</label>
                  <input name="pincode" value={form.pincode||''} onChange={change} className="w-full border p-2 rounded" disabled={!editing}/>
                </div>

                <div>
                  <label className="text-sm">Country</label>
                  <select name="country" value={form.country||''} onChange={change} className="w-full border p-2 rounded" disabled={!editing}>
                    <option value="">Select an option</option>
                    <option>Oximiclla country</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm">State</label>
                  <select name="state" value={form.state||''} onChange={change} className="w-full border p-2 rounded" disabled={!editing}>
                    <option value="">Select an option</option>
                    <option>Domictie state</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Education Details</h4>
                <div>
                  <button onClick={addEducation} className="px-3 py-1 border rounded">+ Add</button>
                </div>
              </div>

              {(form.education || []).length === 0 && (
                <div className="p-4 text-gray-500">No education entries. Click Add to create one.</div>
              )}

              <div className="space-y-3">
                {(form.education || []).map((ed, idx) => (
                  <div key={idx} className="p-3 border rounded grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm">School / College</label>
                      <input value={ed.school||''} onChange={e=>updateEducation(idx,'school', e.target.value)} className="w-full border p-2 rounded" disabled={!editing}/>
                    </div>
                    <div>
                      <label className="text-sm">Highest degree</label>
                      <input value={ed.degree||''} onChange={e=>updateEducation(idx,'degree', e.target.value)} className="w-full border p-2 rounded" disabled={!editing}/>
                    </div>
                    <div className="flex items-end justify-end">
                      <button onClick={()=>removeEducation(idx)} className="px-2 py-1 border rounded text-sm">Remove</button>
                    </div>

                    <div>
                      <label className="text-sm">Course</label>
                      <input value={ed.course||''} onChange={e=>updateEducation(idx,'course', e.target.value)} className="w-full border p-2 rounded" disabled={!editing}/>
                    </div>
                    <div>
                      <label className="text-sm">Year</label>
                      <input value={ed.year||''} onChange={e=>updateEducation(idx,'year', e.target.value)} className="w-full border p-2 rounded" disabled={!editing}/>
                    </div>
                    <div>
                      <label className="text-sm">Grade</label>
                      <input value={ed.grade||''} onChange={e=>updateEducation(idx,'grade', e.target.value)} className="w-full border p-2 rounded" disabled={!editing}/>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-semibold">Skills & Projects</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="text-sm">Skills</label>
                    <textarea name="skills" value={form.skills||''} onChange={change} className="w-full border p-2 rounded" disabled={!editing} />
                  </div>
                  <div>
                    <label className="text-sm">Projects</label>
                    <textarea name="projects" value={form.projects||''} onChange={change} className="w-full border p-2 rounded" disabled={!editing} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Work Experience</h4>
                <div>
                  <button onClick={addExperience} className="px-3 py-1 border rounded">+ Add</button>
                </div>
              </div>

              {(form.experience || []).length === 0 && (
                <div className="p-4 text-gray-500">No experience entries. Click Add to create one.</div>
              )}

              <div className="space-y-3">
                {(form.experience || []).map((ex, idx) => (
                  <div key={idx} className="p-3 border rounded grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm">Domain</label>
                      <input value={ex.domain||''} onChange={e=>updateExperience(idx,'domain',e.target.value)} className="w-full border p-2 rounded" disabled={!editing}/>
                    </div>
                    <div>
                      <label className="text-sm">Sub-domain / Role</label>
                      <input value={ex.subdomain||''} onChange={e=>updateExperience(idx,'subdomain',e.target.value)} className="w-full border p-2 rounded" disabled={!editing}/>
                    </div>
                    <div>
                      <label className="text-sm">Experience</label>
                      <input value={ex.years||''} onChange={e=>updateExperience(idx,'years',e.target.value)} className="w-full border p-2 rounded" disabled={!editing}/>
                    </div>
                    <div className="md:col-span-3 flex justify-end">
                      <button onClick={()=>removeExperience(idx)} className="px-2 py-1 border rounded text-sm">Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">LinkedIn</h5>
                  </div>
                  <input name="linkedin" value={form.linkedin||''} onChange={change} className="w-full border p-2 rounded" placeholder="Profile URL" disabled={!editing}/>
                </div>

                <div className="p-4 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">Resume</h5>
                    <div>{form.resume && <button onClick={()=>alert('Viewing '+form.resume)} className="px-2 py-1 text-sm border rounded">View</button>}</div>
                  </div>
                  <input name="resume" value={form.resume||''} onChange={change} className="w-full border p-2 rounded" placeholder="myresume.pdf (for demo)" disabled={!editing}/>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ---------- small Tab component ---------- */
function Tab({ label, active, onClick }){
  return (
    <button onClick={onClick} className={`px-3 py-1 rounded-md text-sm ${active ? 'tab-active' : 'bg-white border'}`}>
      {label}
    </button>
  )
}
