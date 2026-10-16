import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import {
  Activity, Anchor, Archive, ArrowDownUp, Atom, BookOpen, Boxes, Check,
  ChevronDown, Compass, Database, DoorOpen, Globe2, Home, Leaf, ListTodo,
  LogOut, Menu, PawPrint, Plus, Rocket, Search, Settings2, ShieldCheck,
  Sparkles, Star, Telescope, Trash2, Users, Waves, X, Zap, Download, Upload, Image as ImageIcon
} from 'lucide-react';
import './styles.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey && !supabaseUrl.includes('TU-PROYECTO')
  ? createClient(supabaseUrl, supabaseKey) : null;

const modules = [
  { id:'systems', label:'Sistemas', singular:'Sistema estelar', icon:Globe2, color:'cyan', fields:[['galaxy','Galaxia'],['region','Región / coordenadas'],['star','Tipo de estrella'],['economy','Economía'],['conflict','Nivel de conflicto'],['dominant','Raza dominante'],['notes','Notas']] },
  { id:'planets', label:'Planetas y lunas', singular:'Planeta o luna', icon:Compass, color:'green', fields:[['system_id','Sistema estelar'],['type','Tipo de cuerpo'],['biome','Ecosistema / bioma'],['hazards','Clima y peligros'],['sentinels','Sentinelas'],['flora_description','Flora (descripción)'],['fauna_description','Fauna (descripción)'],['resources','Recursos destacados'],['portal','Código de portal / glifos'],['base_id','Base propia en este lugar'],['notes','Notas']] },
  { id:'bases', label:'Bases', singular:'Base', icon:Home, color:'orange', fields:[['planet_id','Planeta o luna'],['system_id','Sistema estelar'],['galaxy','Galaxia'],['coords','Coordenadas'],['purpose','Función / tema'],['status','Estado'],['notes','Notas']] },
  { id:'settlements', label:'Asentamientos', singular:'Asentamiento', icon:Home, color:'orange', fields:[['planet_id','Planeta o luna'],['settlement_type','Tipo de asentamiento'],['debt_time','Tiempo hasta liquidar la deuda'],['happiness','Felicidad (%)'],['productivity','Productividad (unidades/día)'],['maintenance','Coste de mantenimiento (unidades/día)'],['characteristics','Características positivas o negativas'],['economy','Economía'],['population','Población'],['status','Estado de gestión'],['next','Próxima mejora'],['notes','Notas']] },
  { id:'freighters', label:'Cargueros', singular:'Carguero', icon:Anchor, color:'cyan', fields:[['class','Clase'],['status','Estado'],['current','¿Es el carguero actual?'],['design','Diseño / apariencia'],['command_rooms','Puestos de mando de flota'],['containers','Contenedores'],['has_scientist','¿Tiene científico?'],['has_farmer','¿Tiene agrícola?'],['has_armorer','¿Tiene armero?'],['has_overseer','¿Tiene supervisor?'],['notes','Notas']] },
  { id:'frigates', label:'Fragatas', singular:'Fragata', icon:Anchor, color:'purple', fields:[['freighter_id','Carguero asociado'],['type','Tipo de fragata'],['class','Clase'],['combat_level','Nivel de combate'],['exploration_level','Nivel de exploración'],['industrial_level','Nivel industrial'],['trade_level','Nivel de comercio'],['expeditions_count','Número de expediciones'],['times_damaged','Veces dañada'],['captain','Nombre del capitán'],['crew','Tripulación'],['fuel_tons','Toneladas de combustible'],['fuel_distance','Años luz por carga'],['rank_progress','Progreso al siguiente rango (%)'],['characteristics','Características positivas o negativas'],['notes','Notas']] },
  { id:'corvettes', label:'Corbetas', singular:'Corbeta', icon:Rocket, color:'pink', fields:[['status','Estado'],['parts','Piezas / configuración'],['notes','Notas']] },
  { id:'ships', label:'Naves', singular:'Nave', icon:Rocket, color:'orange', fields:[['type','Tipo de nave'],['class','Clase'],['status','Estado'],['sold_at','Fecha de venta'],['slots','Espacios / rango'],['weapon','Arma / módulo principal'],['design','Color / diseño'],['system_id','Sistema de origen'],['notes','Notas']] },
  { id:'exocraft', label:'Exonaves', singular:'Exonave', icon:Rocket, color:'orange', fields:[['type','Tipo de exonave'],['planet_id','Planeta o luna'],['notes','Notas']] },
  { id:'crew', label:'Tripulación del carguero', singular:'Tripulante', icon:Users, color:'cyan', fields:[['freighter_id','Carguero asociado'],['type','Tipo de tripulante'],['status','Disponibilidad'],['species','Especie / raza'],['role','Rol / especialidad'],['rank','Rango / nivel'],['notes','Notas']] },
  { id:'flora', label:'Flora', singular:'Descubrimiento de flora', icon:Leaf, color:'green', fields:[['planet_id','Planeta o luna'],['system_id','Sistema estelar'],['biome','Bioma'],['kind','Tipo de flora'],['resource','Recurso obtenido'],['yield','Rendimiento'],['coordinates','Ubicación / coordenadas'],['catalogued','Catalogada'],['notes','Notas']] },
  { id:'fauna', label:'Fauna', singular:'Descubrimiento de fauna', icon:PawPrint, color:'orange', fields:[['planet_id','Planeta o luna'],['system_id','Sistema estelar'],['biome','Bioma'],['diet','Dieta'],['behavior','Comportamiento'],['habitat','Hábitat / zona'],['rarity','Rareza'],['reward','Recurso / recompensa'],['catalogued','Catalogada'],['notes','Notas']] },
  { id:'inventory', label:'Inventario', singular:'Artículo de inventario', icon:Boxes, color:'yellow', fields:[['resource_id','Recurso'],['category','Categoría'],['variant','Tipo / variante'],['quantity','Cantidad actual'],['unit','Unidad / pila'],['location','Ubicación'],['target','Cantidad objetivo'],['notes','Notas']] },
  { id:'resources', label:'Recursos', singular:'Recurso', icon:Archive, color:'green', fields:[['characteristics','Características / recursos presentes'],['category','Categoría'],['description','Descripción'],['image_url','URL de imagen'],['available','Cantidad disponible (opcional)'],['needed','Cantidad necesaria (opcional)'],['planet_id','Planeta recomendado'],['system_id','Sistema estelar'],['method','Método de obtención'],['notes','Notas']] },
  { id:'guide', label:'Guía y objetivos', singular:'Objetivo', icon:BookOpen, color:'purple', fields:[['category','Categoría'],['description','Descripción / pasos'],['related','Relacionado con'],['priority','Prioridad'],['status','Estado'],['requirements','Requisitos'],['reward','Recompensa'],['link','Enlace / referencia'],['notes','Notas']] },
  { id:'missions', label:'Misiones', singular:'Misión', icon:ListTodo, color:'pink', fields:[['type','Tipo'],['origin','Dador / origen'],['location','Sistema / planeta'],['status','Estado'],['progress','Progreso'],['reward','Recompensa'],['requirements','Requisitos'],['notes','Notas']] },
  { id:'expeditions', label:'Expediciones de flota', singular:'Expedición', icon:Waves, color:'cyan', fields:[['frigates','Fragatas asociadas (1 a 5)'],['type','Especialidad de expedición'],['departure','Fecha de salida'],['duration','Tiempo de misión (HH:MM:SS)'],['fuel_required','Combustible requerido (toneladas)'],['upgrades','Módulos de mejora'],['status','Estado'],['risk','Riesgo (1 a 5)'],['result','Resultado'],['rewards','Recompensas'],['notes','Notas']] },
  { id:'technology', label:'Tecnologías', singular:'Tecnología o plano', icon:Atom, color:'purple', fields:[['category','Categoría'],['class','Clase'],['installed','Instalada en'],['ship_id','Nave donde está instalada'],['effect','Efecto / estadísticas'],['materials','Materiales requeridos'],['source','Fuente / vendedor'],['notes','Notas']] },
  { id:'places', label:'Puntos de interés', singular:'Punto de interés', icon:Telescope, color:'yellow', fields:[['type','Tipo de lugar'],['planet_id','Planeta o luna'],['system_id','Sistema estelar'],['galaxy','Galaxia'],['coordinates','Coordenadas / portal'],['route','Cómo llegar'],['visited','Visitado'],['purpose','Recompensa / utilidad'],['notes','Notas']] },
];

const fieldOptions = {
  'systems.star':['Amarilla','Roja','Verde','Azul','Púrpura'],
  'systems.dominant':['Gek','Korvax','Vy’keen'],
  'planets.type':['Planeta','Luna'],
  'planets.base_id':null,
  'bases.status':['Activa','En construcción','Abandonada'],
  'settlements.settlement_type':['Asentamiento planetario del Korvax','Asentamiento planetario del Gek',"Asentamiento planetario del Vy'keen"],
  'settlements.status':['En desarrollo','Estable','En declive'],
  'freighters.class':['S','A','B','C'],
  'freighters.status':['En posesión','Histórico'],
  'freighters.current':['Sí','No'],
  'frigates.class':['S','A','B','C'],
  'frigates.type':['Combate','Exploración','Industrial','Comercio'],
  'corvettes.status':['En construcción','Completada','Pendiente'],
  'ships.class':['S','A','B','C'],
  'ships.status':['En posesión','Vendida','Destruida'],
  'freighters.has_scientist':['Sí','No'], 'freighters.has_farmer':['Sí','No'], 'freighters.has_armorer':['Sí','No'], 'freighters.has_overseer':['Sí','No'],
  'crew.type':['Comercial','Expedición','Industrial','Combate'], 'crew.status':['Disponible para misión','En misión'],
  'exocraft.type':['Peregrina','Nómada','Vagabundo','Coloso','Minotauro','Nautilo'],
  'expeditions.type':['Combate','Exploración','Industrial','Comercio'],
  'expeditions.risk':['1','2','3','4','5'],
  'expeditions.status':['Preparando','En curso','Completada','Cancelada'],
  'expeditions.result':['Exitosa','Fragatas retiradas','Fragatas destruidas'],
  'flora.catalogued':['Sí','No'], 'fauna.catalogued':['Sí','No'],
  'guide.priority':['Baja','Media','Alta'], 'guide.status':['Pendiente','En progreso','Completado','Descartado'],
  'missions.status':['Pendiente','En progreso','Completada','Fallida'],
  'technology.class':['S','A','B','C'],
  'technology.installed':['Exotraje','Nave','Multiherramienta','Carguero','Roamer','Nomad','Pilgrim','Colossus','Minotaur','Nautilon'],
  'places.visited':['Sí','No'],
};
const relationFields = {
  'planets.system_id':'systems','planets.base_id':'bases',
  'bases.planet_id':'planets','bases.system_id':'systems',
  'settlements.planet_id':'planets',
  'frigates.freighter_id':'freighters','crew.freighter_id':'freighters',
  'exocraft.planet_id':'planets','flora.planet_id':'planets','flora.system_id':'systems',
  'fauna.planet_id':'planets','fauna.system_id':'systems','inventory.resource_id':'resources',
  'resources.planet_id':'planets','resources.system_id':'systems',
  'technology.ship_id':'ships','expeditions.frigates':'frigates','places.planet_id':'planets','places.system_id':'systems',
};
const shareableCategories = new Set(['systems','planets','flora','fauna','resources','technology','places']);
const navGroups = [
  {label:'EXPLORACIÓN',ids:['systems','planets','bases','settlements','flora','fauna','places']},
  {label:'CARGUEROS Y FLOTA',ids:['freighters','frigates','expeditions']},
  {label:'NAVES Y VEHÍCULOS',ids:['ships','corvettes','exocraft']},
  {label:'INVENTARIO Y PLANIFICACIÓN',ids:['inventory','resources','technology','guide','missions']},
];


function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [active, setActive] = useState('overview');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [form, setForm] = useState({ name:'', data:{} });
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [clockNow, setClockNow] = useState(Date.now());
  useEffect(() => { const timer = setInterval(() => setClockNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  const importInputRef = React.useRef(null);

  useEffect(() => {
    if (!supabase) { setAuthLoading(false); return; }
    supabase.auth.getSession().then(({data}) => { setSession(data.session); setAuthLoading(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => { setSession(s); setAuthLoading(false); });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function loadRecords() {
    if (!supabase || !session?.user) return;
    setLoading(true);
    const { data, error } = await supabase.from('nms_records').select('*').order('updated_at', {ascending:false});
    if (error) setToast('No se pudieron cargar los registros: '+error.message);
    else {
      const expiredShips = (data || []).filter(r => r.category === 'ships' && ['Vendida','Destruida'].includes(r.data?.status) && r.data?.sold_at && (Date.now() - new Date(r.data.sold_at).getTime()) >= 7*24*60*60*1000);
      for (const ship of expiredShips) await supabase.from('nms_records').delete().eq('id',ship.id);
      setRecords((data || []).filter(r => !expiredShips.some(x=>x.id===r.id)));
    }
    setLoading(false);
  }
  useEffect(() => { loadRecords(); }, [session?.user?.id]);

  async function authenticate(e) {
    e.preventDefault(); setAuthMessage('');
    if (!supabase) return;
    const fn = authMode === 'login' ? supabase.auth.signInWithPassword({email,password}) : supabase.auth.signUp({email,password});
    const {error} = await fn;
    if (error) setAuthMessage(error.message);
    else if (authMode === 'signup') setAuthMessage('Cuenta creada. Si se solicita, confirma tu correo y después inicia sesión.');
  }
  async function logout() { await supabase?.auth.signOut(); setSession(null); setRecords([]); }

  const currentModule = modules.find(m => m.id === active);
  const currentRecords = useMemo(() => { const list=records.filter(r => r.category === active && (`${r.name} ${JSON.stringify(r.data||{})}`).toLowerCase().includes(search.toLowerCase())); if(active==='ships') return list.sort((a,b)=>{const rank=r=>r.data?.status==='En posesión'?0:r.data?.status==='Vendida'?1:2;return rank(a)-rank(b) || new Date(b.updated_at)-new Date(a.updated_at);}); return list; }, [records, active, search]);
  const counts = useMemo(() => Object.fromEntries(modules.map(m => [m.id, records.filter(r => r.category===m.id).length])), [records]);
  const openNew = () => { setEditing(null); const currentFreighter=records.find(r=>r.category==='freighters'&&r.data?.current==='Sí'); const data=['frigates','crew'].includes(active)?{freighter_id:currentFreighter?.id||''}:{}; setForm({name:'',data}); setShowForm(true); };
  const openEdit = r => { setEditing(r); const data={...(r.data||{})}; if(data.planet_id && ['bases','flora','fauna','exocraft','places','resources'].includes(r.category) && !data.system_id) data.system_id=records.find(item=>item.id===data.planet_id&&item.category==='planets')?.data?.system_id||''; setForm({name:r.name || '', data}); setShowForm(true); };
  const setField = (key,value) => setForm(f => { const data={...f.data,[key]:value}; if(active==='ships' && key==='status') { if(['Vendida','Destruida'].includes(value) && value!==f.data.status) data.sold_at=new Date().toISOString().slice(0,10); if(value==='En posesión') data.sold_at=''; } if(active==='technology' && key==='installed' && value!=='Nave') data.ship_id=''; if(active==='expeditions' && key==='status' && value==='En curso') data.result=''; if(key==='planet_id' && ['bases','settlements','flora','fauna','exocraft','places','resources'].includes(active)) { const planet=records.find(r=>r.id===value && r.category==='planets'); data.system_id=planet?.data?.system_id || ''; const system=records.find(r=>r.id===planet?.data?.system_id && r.category==='systems'); if(system?.data?.galaxy && ['bases','places'].includes(active)) data.galaxy=system.data.galaxy; } if(key==='system_id' && active==='planets' && !value) data.system_id=''; return {...f,data}; });

  function recordsForRelation(category) {
    let list = records.filter(r => r.category === category);
    if (active === 'expeditions' && category === 'frigates') {
      const busyIds = new Set(records.filter(r => r.category === 'expeditions' && r.data?.status === 'En curso' && r.id !== editing?.id).flatMap(r => Array.isArray(r.data?.frigates) ? r.data.frigates : []));
      list = list.filter(r => !busyIds.has(r.id));
    }
    if (active === 'planets' && category === 'bases') {
      // Una base solo se puede asociar si ya está registrada para este planeta.
      list = editing?.id ? list.filter(r => r.data?.planet_id === editing.id) : [];
    }
    if ((active === 'crew' || active === 'frigates') && category === 'freighters') {
      const current = list.find(r => r.data?.current === 'Sí');
      list = current ? [current] : [];
    }
    return list;
  }
  function relationName(id, category) {
    return records.find(r => r.id === id && (!category || r.category === category))?.name || '';
  }
  function fieldInput(module, key, label) {
    const relationCategory = relationFields[`${module.id}.${key}`];
    const options = fieldOptions[`${module.id}.${key}`];
    const value = form.data[key] ?? '';
    if ((module.id === 'settlements' || module.id === 'frigates') && key === 'characteristics') {
      const tags = Array.isArray(value) ? value : [];
      const addTag = () => {
        const input = document.getElementById(`${module.id}-characteristic-input`);
        const polarity = document.getElementById(`${module.id}-characteristic-polarity`);
        const name = input?.value?.trim();
        if (!name) return;
        if (!tags.some(tag => (typeof tag === 'string' ? tag : tag.name).toLocaleLowerCase('es') === name.toLocaleLowerCase('es'))) {
          setField(key, [...tags, {name, polarity:polarity?.value || 'positive'}]);
        }
        if (input) input.value='';
      };
      return <div className={`tag-editor ${module.id}-characteristic-editor`}>
        <div className="tag-entry characteristic-entry"><input id={`${module.id}-characteristic-input`} placeholder="Nombre de la característica" onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addTag();}}}/><select id={`${module.id}-characteristic-polarity`} defaultValue="positive"><option value="positive">Positiva</option><option value="negative">Negativa</option></select><button type="button" className="secondary tag-add-button" onClick={addTag}><Plus size={15}/> Añadir</button></div>
        <div className="tag-list">{tags.map((tag,index)=>{const item=typeof tag==='string'?{name:tag,polarity:'positive'}:tag;return <span className={`resource-tag characteristic-tag ${module.id==='settlements'?(item.polarity==='negative'?'negative':'positive'):(item.polarity==='negative'?'negative-blue':'positive-blue')}`} key={`${item.name}-${index}`}>{item.name}<button type="button" aria-label={`Eliminar ${item.name}`} onClick={()=>setField(key,tags.filter((_,i)=>i!==index))}><X size={12}/></button></span>})}</div>
      </div>;
    }
    if (module.id === 'expeditions' && key === 'upgrades') {
      const tags = Array.isArray(value) ? value : (typeof value === 'string' && value.trim() ? value.split(',').map(x=>x.trim()).filter(Boolean) : []);
      const addUpgrade = () => {
        const input = document.getElementById('expedition-upgrade-input');
        const next = input?.value?.trim();
        if (!next) return;
        if (!tags.some(tag=>tag.toLocaleLowerCase('es')===next.toLocaleLowerCase('es'))) setField(key,[...tags,next]);
        if (input) input.value='';
      };
      return <div className="tag-editor expedition-upgrade-editor">
        <div className="tag-entry"><input id="expedition-upgrade-input" placeholder="Ej. Módulo de eficiencia de combustible" onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addUpgrade();}}}/><button type="button" className="secondary tag-add-button" onClick={addUpgrade}><Plus size={15}/> Añadir</button></div>
        <div className="tag-list">{tags.map((tag,index)=><span className="resource-tag upgrade-tag" key={`${tag}-${index}`}>{tag}<button type="button" aria-label={`Eliminar ${tag}`} title={`Eliminar ${tag}`} onClick={()=>setField(key,tags.filter((_,i)=>i!==index))}><X size={12}/></button></span>)}</div>
        <small className="field-help">Añade los módulos de mejora instalados o utilizados en esta expedición.</small>
      </div>;
    }
    if (module.id === 'planets' && key === 'resources') {
      const tags = Array.isArray(value) ? value : (typeof value === 'string' && value.trim() ? value.split(',').map(x=>x.trim()).filter(Boolean) : []);
      const addCharacteristic = () => {
        const input = document.getElementById('planet-resource-characteristic-input');
        const next = input?.value?.trim();
        if (!next) return;
        if (!tags.some(tag=>tag.toLocaleLowerCase('es')===next.toLocaleLowerCase('es'))) setField(key,[...tags,next]);
        if (input) input.value='';
      };
      return <div className="tag-editor planet-resource-editor">
        <div className="tag-entry"><input id="planet-resource-characteristic-input" placeholder="Ej. Moho fúngico, Cobalto, Amonio…" onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addCharacteristic();}}}/><button type="button" className="secondary tag-add-button" onClick={addCharacteristic}><Plus size={15}/> Añadir</button></div>
        <div className="tag-list">{tags.map((tag,index)=><span className="resource-tag" key={`${tag}-${index}`}>{tag}<button type="button" aria-label={`Eliminar ${tag}`} title={`Eliminar ${tag}`} onClick={()=>setField(key,tags.filter((_,i)=>i!==index))}><X size={12}/></button></span>)}</div>
        <small className="field-help">Añade los recursos presentes en este planeta o luna por separado. Estas etiquetas podrán utilizarse después para filtrar planetas.</small>
      </div>;
    }
    if (module.id === 'resources' && key === 'characteristics') return <input value={typeof value === 'string' ? value : Array.isArray(value) ? value.join(', ') : ''} onChange={e=>setField(key,e.target.value)} placeholder="Características del recurso" />;
    if (key === 'system_id' && ['resources','bases','settlements','flora','fauna','exocraft','places'].includes(module.id) && form.data.planet_id) {
      const selectedPlanet=records.find(r=>r.id===form.data.planet_id && r.category==='planets');
      const system = records.find(r=>r.id===(form.data.system_id || selectedPlanet?.data?.system_id) && r.category==='systems');
      return <input disabled value={system?.name || 'Selecciona un planeta para completar el sistema'} />;
    }
    if (module.id === 'technology' && key === 'ship_id' && form.data.installed !== 'Nave') return <input disabled value="Solo aplica cuando ‘Instalada en’ es Nave" />;
    if (module.id === 'expeditions' && key === 'frigates') {
      const assigned = Array.isArray(value) ? value : [];
      const available = recordsForRelation('frigates').filter(r=>!assigned.includes(r.id));
      const assignedRecords = assigned.map(id=>records.find(r=>r.id===id && r.category==='frigates')).filter(Boolean);
      const addFrigate = id => {
        if (!id) return;
        if (assigned.includes(id)) return;
        if (assigned.length >= 5) { setToast('Puedes asignar como máximo 5 fragatas por expedición.'); return; }
        setField(key,[...assigned,id]);
      };
      return <div className="tag-editor expedition-frigate-editor">
        <select value="" onChange={e=>addFrigate(e.target.value)} disabled={available.length===0}>
          <option value="">{available.length ? 'Añadir una fragata disponible…' : 'No hay más fragatas disponibles'}</option>
          {available.map(r=><option key={r.id} value={r.id}>{r.name} · {r.data?.type || 'Sin especialidad'}</option>)}
        </select>
        <div className="tag-list">{assignedRecords.map(r=><span className="resource-tag assigned-frigate-tag" key={r.id}>{r.name}<button type="button" aria-label={`Quitar ${r.name}`} title={`Quitar ${r.name}`} onClick={()=>setField(key,assigned.filter(id=>id!==r.id))}><X size={12}/></button></span>)}</div>
        <small className="field-help">Solo aparecen fragatas disponibles, no asignadas a otra expedición en curso. Añade entre 1 y 5 fragatas.</small>
      </div>;
    }
    const isLong = ['notes','description','requirements','stats','materials','resources','upgrades','parts','rewards','route','coordinates','portal','effect','traits','weapons','tech','source','purpose','link','design'].includes(key);
    const isRequiredImage = module.id === 'resources' && key === 'image_url';
    if (relationCategory) {
      const optionsList = recordsForRelation(relationCategory);
      return <select value={value} required={module.id === 'planets' && key === 'system_id'} onChange={e=>setField(key,e.target.value)}>
        <option value="">{relationCategory === 'systems' ? 'Selecciona un sistema…' : relationCategory === 'planets' ? 'Selecciona un planeta o luna…' : relationCategory === 'bases' ? 'Selecciona una base…' : relationCategory === 'freighters' ? 'Selecciona un carguero…' : relationCategory === 'resources' ? 'Selecciona un recurso…' : relationCategory === 'ships' ? 'Selecciona una nave…' : 'Sin seleccionar'}</option>
        {optionsList.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
      </select>;
    }
    if (options) return <select value={value} onChange={e=>setField(key,e.target.value)}><option value="">Selecciona…</option>{options.map(o=><option key={o} value={o}>{o}</option>)}</select>;
    if (key === 'galaxy' && module.id === 'systems') {
      const galaxies = [...new Set(records.filter(r=>r.category==='systems').map(r=>r.data?.galaxy).filter(Boolean))];
      return <><input list="atlas-galaxies" value={value} onChange={e=>setField(key,e.target.value)} placeholder="Escribe una galaxia; se guardará para reutilizarla"/><datalist id="atlas-galaxies">{galaxies.map(g=><option key={g} value={g}/>)}</datalist></>;
    }
    if (module.id === 'resources' && key === 'image_url') return <input type="url" required value={value} onChange={e=>setField(key,e.target.value)} placeholder="https://… (imagen obligatoria)" />;
    if (key === 'quantity' || key === 'available' || key === 'needed' || key === 'target' || key === 'population' || (key === 'duration' && module.id !== 'expeditions') || key === 'fuel_required' || ['command_rooms','containers','happiness','productivity','maintenance','combat_level','exploration_level','industrial_level','trade_level','expeditions_count','times_damaged','fuel_tons','fuel_distance','rank_progress'].includes(key)) return <input type="number" min="0" max={['happiness','rank_progress'].includes(key)?100:undefined} value={value} onChange={e=>setField(key,e.target.value)} placeholder="0" />;
    if (module.id === 'expeditions' && key === 'duration') return <input type="text" inputMode="numeric" value={value} onChange={e=>setField(key,e.target.value)} placeholder="HH:MM:SS (ej. 04:30:00)" pattern="^[0-9]{1,4}:[0-5][0-9]:[0-5][0-9]$" title="Introduce el tiempo como HH:MM:SS, por ejemplo 04:30:00" />;
    if (key === 'departure') return <input type="datetime-local" value={value} onChange={e=>setField(key,e.target.value)} />;
    if (key === 'sold_at') return <input type="date" disabled={module.id==='ships' && form.data.status==='En posesión'} value={value} onChange={e=>setField(key,e.target.value)} />;
    return isLong ? <textarea rows="2" value={value} onChange={e=>setField(key,e.target.value)} placeholder="Añade detalles…" /> : <input value={value} onChange={e=>setField(key,e.target.value)} placeholder="—" />;
  }

  function exportShareableJson() {
    const ordered = records.filter(r => shareableCategories.has(r.category)).sort((a,b) => {
      const order = ['systems','planets','resources','flora','fauna','technology','places'];
      return order.indexOf(a.category)-order.indexOf(b.category);
    });
    const exported = ordered.map(r => {
      const data = {...(r.data || {})};
      // La instalación en naves es información personal y no se comparte.
      if (r.category === 'technology') { delete data.ship_id; delete data.installed; }
      if (r.category === 'planets') delete data.base_id; // Las bases son personales.
      if (r.category === 'resources') { delete data.available; delete data.needed; } // Cantidades/objetivos personales.
      if (r.category === 'systems') delete data.visited;
      if (r.category === 'flora' || r.category === 'fauna') delete data.catalogued;
      if (r.category === 'places') delete data.visited;
      return { source_id:r.id, category:r.category, name:r.name, data, schema_version:1 };
    });
    const blob = new Blob([JSON.stringify({format:'atlas-nms-share',version:1,exported_at:new Date().toISOString(),records:exported},null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='atlas-bitacora-compartible.json'; a.click(); URL.revokeObjectURL(url);
    setToast(`Exportación lista: ${exported.length} registros compartibles.`);
  }

  async function importShareableJson(event) {
    const file = event.target.files?.[0]; event.target.value=''; if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (parsed?.format !== 'atlas-nms-share' || !Array.isArray(parsed.records)) throw new Error('El archivo no es una exportación JSON válida de Atlas.');
      const allowed = parsed.records.filter(r => shareableCategories.has(r.category) && typeof r.name === 'string' && r.name.trim());
      const order = ['systems','planets','resources','flora','fauna','technology','places'];
      allowed.sort((a,b)=>order.indexOf(a.category)-order.indexOf(b.category));
      const sourceToLocal = new Map(); const pending = [];
      for (const item of allowed) {
        const duplicate = records.find(r => r.category===item.category && r.name.trim().toLowerCase()===item.name.trim().toLowerCase());
        if (duplicate) { if(item.source_id) sourceToLocal.set(item.source_id,duplicate.id); continue; }
        const data = {...(item.data || {})};
        for (const key of ['system_id','planet_id','base_id','freighter_id','resource_id','ship_id']) if (data[key] && sourceToLocal.has(data[key])) data[key]=sourceToLocal.get(data[key]);
        if (item.category==='technology') { delete data.ship_id; delete data.installed; }
        if (item.category==='planets') delete data.base_id;
        if (item.category==='resources') { delete data.available; delete data.needed; }
        if (item.category==='systems') delete data.visited;
        if (item.category==='flora' || item.category==='fauna') delete data.catalogued;
        if (item.category==='places') delete data.visited;
        const {data:created,error} = await supabase.from('nms_records').insert({user_id:session.user.id,category:item.category,name:item.name.trim(),data}).select().single();
        if (error) throw new Error(`No se pudo importar “${item.name}”: ${error.message}`);
        pending.push(created); if(item.source_id) sourceToLocal.set(item.source_id,created.id);
      }
      setRecords(prev=>[...pending,...prev]); setToast(`Importación completada: ${pending.length} registros nuevos; se omitieron coincidencias existentes.`);
    } catch (error) { setToast(error.message || 'No se pudo leer el archivo JSON.'); }
  }
  async function saveRecord(e) {
    e.preventDefault();
    if (!supabase || !session?.user) return;
    if (active === 'planets' && !form.data.system_id) { setToast('Selecciona el sistema estelar del planeta.'); return; }
    if (active === 'resources' && !form.data.image_url?.trim()) { setToast('Añade una URL de imagen para guardar el recurso.'); return; }
    if (active === 'expeditions') {
      const assigned=Array.isArray(form.data.frigates)?form.data.frigates:[];
      if(assigned.length<1){setToast('Asigna al menos una fragata disponible a la expedición.');return;}
      if(assigned.length>5){setToast('Una expedición admite un máximo de 5 fragatas.');return;}
      const durationText=String(form.data.duration||'').trim();
      if(!/^[0-9]{1,4}:[0-9]{2}:[0-9]{2}$/.test(durationText) || Number(durationText.split(':')[1])>59 || Number(durationText.split(':')[2])>59){setToast('Introduce la duración como HH:MM:SS, por ejemplo 00:38:04.');return;}
      const busyIds = new Set(records.filter(r=>r.category==='expeditions'&&r.data?.status==='En curso'&&r.id!==editing?.id).flatMap(r=>Array.isArray(r.data?.frigates)?r.data.frigates:[]));
      if(assigned.some(id=>busyIds.has(id))){setToast('Una o más fragatas ya están asignadas a otra misión en curso.');return;}
      if(form.data.status==='En curso' && form.data.result) { form.data.result=''; }
    }
    if (active === 'settlements' && !form.data.planet_id) { setToast('Selecciona el planeta o luna del asentamiento.'); return; }
    setSaving(true);
    const savedData = {...form.data};
    if (active === 'expeditions') {
      savedData.duration = String(savedData.duration || '').trim();
      if (savedData.status === 'En curso' && !(editing?.data?.status === 'En curso' && editing?.data?.started_at)) savedData.started_at = new Date().toISOString();
      if (savedData.status !== 'En curso') savedData.started_at = '';
    }
    const payload = {category:active,name:form.name.trim(),data:savedData,user_id:session.user.id};
    if (active === 'inventory' && !editing && form.data.resource_id) {
      const existing = records.find(r => r.category === 'inventory' && r.data?.resource_id === form.data.resource_id);
      if (existing) {
        const quantity = Math.max(0, Number(existing.data?.quantity || 0)) + Math.max(0, Number(form.data.quantity || 0));
        const merged = {...existing.data, ...form.data, quantity:String(quantity)};
        const result = await supabase.from('nms_records').update({data:merged}).eq('id',existing.id).select().single();
        setSaving(false);
        if (result.error) { setToast('Error al sumar el recurso: '+result.error.message); return; }
        setRecords(prev=>prev.map(r=>r.id===existing.id?result.data:r)); setShowForm(false); setToast(`Cantidad actualizada: ${quantity}`); return;
      }
    }
    const demotedFreighters = [];
    if (active === 'freighters' && form.data.current === 'Sí') {
      const previousCurrent = records.filter(r=>r.category==='freighters' && r.data?.current==='Sí' && r.id!==editing?.id);
      for (const old of previousCurrent) {
        const newData={...old.data,current:'No',status:old.data?.status==='En posesión'?'Histórico':old.data?.status};
        const {error:demoteError}=await supabase.from('nms_records').update({data:newData}).eq('id',old.id);
        if (!demoteError) demotedFreighters.push({id:old.id,data:newData});
      }
    }
    const result = editing
      ? await supabase.from('nms_records').update(payload).eq('id',editing.id).select().single()
      : await supabase.from('nms_records').insert(payload).select().single();
    setSaving(false);
    if (result.error) { setToast('Error al guardar: '+result.error.message); return; }
    setRecords(prev => { const demoted = prev.map(r=>{const change=demotedFreighters.find(x=>x.id===r.id);return change?{...r,data:change.data}:r;}); return editing ? demoted.map(r => r.id===editing.id ? result.data : r) : [result.data,...demoted]; });
    setShowForm(false); setToast(editing ? 'Registro actualizado' : 'Registro guardado');
  }
  async function deleteRecord(r) { setConfirmDelete(r); }
  async function confirmDeleteRecord() {
    if (!confirmDelete) return;
    const target = confirmDelete;
    let cascadeIds = [target.id];
    if (target.category === 'freighters') {
      const frigateIds = records.filter(r => r.category === 'frigates' && r.data?.freighter_id === target.id).map(r => r.id);
      cascadeIds = [...cascadeIds, ...records.filter(r => r.category === 'crew' && r.data?.freighter_id === target.id).map(r => r.id)];
      cascadeIds = [...cascadeIds, ...records.filter(r => r.category === 'expeditions' && Array.isArray(r.data?.frigates) && r.data.frigates.some(id => frigateIds.includes(id))).map(r => r.id)];
    }
    const {error} = await supabase.from('nms_records').delete().in('id',cascadeIds);
    setConfirmDelete(null);
    if (error) setToast('No se pudo eliminar: '+error.message);
    else { setRecords(prev => prev.filter(x => !cascadeIds.includes(x.id))); setToast(cascadeIds.length > 1 ? `Registro y ${cascadeIds.length-1} elementos relacionados eliminados` : 'Registro eliminado'); }
  }

  if (authLoading) return <div className="loading-screen"><div className="brand-mark"><Sparkles/></div><span>Preparando tu universo…</span></div>;
  if (!supabase) return <SetupScreen />;
  if (!session) return <div className="auth-page"><div className="auth-art"><div className="stars"></div><div className="auth-brand"><div className="brand-mark"><Sparkles/></div><span>ATLAS <i>· NMS</i></span></div><div className="auth-copy"><div className="eyebrow"><span className="pulse"></span> TU UNIVERSO, BAJO CONTROL</div><h1>El espacio es inmenso.<br/><em>Tu registro, infinito.</em></h1><p>Un lugar para cada sistema descubierto, cada criatura catalogada y cada aventura que no quieres olvidar.</p><div className="auth-stats"><span><Globe2/> Exploración</span><span><Rocket/> Tu flota</span><span><Leaf/> Descubrimientos</span></div></div><div className="auth-footer">UNA BITÁCORA PERSONAL PARA NO MAN'S SKY</div></div><div className="auth-form-wrap"><form className="auth-card" onSubmit={authenticate}><div className="mobile-brand"><div className="brand-mark"><Sparkles/></div><b>ATLAS · NMS</b></div><div className="eyebrow">BIENVENIDO A BORDO</div><h2>{authMode==='login'?'Continúa tu viaje':'Crea tu cuenta'}</h2><p className="muted">{authMode==='login'?'Entra para acceder a tu universo sincronizado.':'Tu bitácora estará disponible desde todos tus dispositivos.'}</p><label>Correo electrónico<input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@correo.com"/></label><label>Contraseña<input type="password" required minLength="6" autoComplete={authMode==='login'?'current-password':'new-password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mínimo 6 caracteres"/></label>{authMessage && <div className="auth-message">{authMessage}</div>}<button className="primary full" type="submit">{authMode==='login'?'Iniciar sesión':'Crear cuenta'} <span>→</span></button><div className="auth-switch">{authMode==='login'?'¿Aún no tienes cuenta?':'¿Ya tienes una cuenta?'} <button type="button" onClick={()=>{setAuthMode(authMode==='login'?'signup':'login');setAuthMessage('')}}>{authMode==='login'?'Regístrate':'Inicia sesión'}</button></div><div className="privacy-note"><ShieldCheck size={15}/> Tus registros están separados por cuenta.</div></form></div></div>;

  const totalSystems = counts.systems || 0;
  const totalPlanets = counts.planets || 0;
  const totalDiscoveries = (counts.flora||0)+(counts.fauna||0);
  const todoCount = records.filter(r => ['guide','missions'].includes(r.category) && !/completad|completed|descartad/i.test((r.data?.status)||'')).length;

  return <div className="app-shell">
    {sidebarOpen && <button className="mobile-scrim" onClick={()=>setSidebarOpen(false)} aria-label="Cerrar menú"/>}
    <aside className={`sidebar ${sidebarOpen?'sidebar-open':''}`}>
      <div className="sidebar-brand"><div className="brand-mark"><Sparkles/></div><div><strong>ATLAS <span>· NMS</span></strong><small>UNIVERSE COMPANION</small></div><button className="icon-button close-menu" onClick={()=>setSidebarOpen(false)}><X/></button></div>
      <div className="nav-caption">CENTRO DE CONTROL</div>
      <button className={`nav-item ${active==='overview'?'active':''}`} onClick={()=>{setActive('overview');setSearch('');setSidebarOpen(false)}}><Activity/><span>Resumen general</span><ChevronDown className="nav-chevron"/></button>
      <div className="nav-caption nav-caption-spaced">TU UNIVERSO</div>
      {navGroups.map(group=><React.Fragment key={group.label}><div className="nav-caption nav-caption-spaced">{group.label}</div>{group.ids.map(id=>{const m=modules.find(x=>x.id===id);if(!m)return null;const Icon=m.icon;const nested=['frigates','crew','expeditions','resources','technology'].includes(id);return <button key={m.id} className={`nav-item ${nested?'nav-item-sub':''} ${active===m.id?'active':''}`} onClick={()=>{setActive(m.id);setSearch('');setSidebarOpen(false)}}><Icon/><span>{m.label}</span><small>{counts[m.id]||0}</small></button>})}</React.Fragment>)}
      <div className="sidebar-bottom"><div className="sync-status"><span className="sync-dot"></span><div><b>Sincronización activa</b><small>Base de datos en la nube</small></div></div><button className="nav-item logout" onClick={logout}><LogOut/><span>Cerrar sesión</span></button></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="icon-button menu-button" onClick={()=>setSidebarOpen(true)}><Menu/></button><div className="breadcrumb">ATLAS <span>/</span> {active==='overview'?'RESUMEN GENERAL':currentModule?.label.toUpperCase()}</div></div><div className="topbar-right"><div className="live-label"><span className="sync-dot"></span> SINCRONIZADO</div><div className="user-avatar">{(session.user.email||'C').slice(0,1).toUpperCase()}</div></div></header>
      <div className="page-content">
        {active==='overview' ? <Overview records={records} counts={counts} systems={totalSystems} planets={totalPlanets} discoveries={totalDiscoveries} todo={todoCount} setActive={setActive} openNew={()=>{setActive('systems');openNew()}} /> :
        <section className="module-page">
          <div className="page-heading"><div><div className="eyebrow">BITÁCORA DEL UNIVERSO</div><h1>{currentModule?.label}</h1><p>Guarda detalles, conecta tus descubrimientos y encuentra todo cuando lo necesites.</p></div><button className="primary add-button" onClick={openNew}><Plus size={18}/> Añadir {currentModule?.singular.toLowerCase()}</button></div>
          <div className="module-toolbar"><div className="search-box"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Buscar en ${currentModule?.label.toLowerCase()}…`}/>{search&&<button onClick={()=>setSearch('')}><X size={15}/></button>}</div><div className="toolbar-actions"><div className="result-count"><ArrowDownUp size={15}/> {currentRecords.length} registros</div><button className="secondary compact-action" onClick={exportShareableJson} title="Exportar descubrimientos compartibles"><Download size={15}/> Exportar JSON</button><button className="secondary compact-action" onClick={()=>importInputRef.current?.click()} title="Importar bitácora de un amigo"><Upload size={15}/> Importar JSON</button><input ref={importInputRef} type="file" accept="application/json,.json" hidden onChange={importShareableJson}/></div></div>
          {loading ? <div className="empty-state"><div className="loading-ring"></div><p>Cargando registros…</p></div> : currentRecords.length===0 ? <div className="empty-state"><div className="empty-icon"><currentModule.icon size={26}/></div><h3>{search?'No encontramos resultados':'Tu bitácora está lista'}</h3><p>{search?'Prueba con otro término.':'Añade tu primer registro y empieza a construir el mapa de tu universo.'}</p>{!search&&<button className="secondary" onClick={openNew}><Plus size={16}/> Crear primer registro</button>}</div> :
          <div className="records-grid">{currentRecords.map(r=><RecordCard key={r.id} record={r} module={currentModule} records={records} clockNow={clockNow} onOpen={()=>{if(['systems','planets','bases','settlements','freighters'].includes(r.category)) setSelectedDetail(r); else openEdit(r);}} onEdit={()=>openEdit(r)} onDelete={()=>deleteRecord(r)} resolveRelation={(key,value)=>relationName(value,relationFields[`${currentModule.id}.${key}`])}/>)}</div>}
        </section>}
      </div>
    </main>
    {selectedDetail && <RecordDetailModal record={records.find(r=>r.id===selectedDetail.id)||selectedDetail} records={records} onClose={()=>setSelectedDetail(null)} onEdit={()=>{const item=records.find(r=>r.id===selectedDetail.id)||selectedDetail;setSelectedDetail(null);setActive(item.category);openEdit(item);}} onSelect={item=>setSelectedDetail(item)} />}
    {showForm && currentModule && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setShowForm(false)}}><form className="record-modal" onSubmit={saveRecord}><div className="modal-header"><div><div className="eyebrow">{editing?'EDITAR REGISTRO':'NUEVO REGISTRO'}</div><h2>{editing?'Actualizar': 'Añadir'} {currentModule.singular.toLowerCase()}</h2></div><button type="button" className="icon-button" onClick={()=>setShowForm(false)}><X/></button></div><div className="form-scroll"><label>Nombre o identificador<input autoFocus required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder={`Nombre de ${currentModule.singular.toLowerCase()}`}/></label><div className="form-grid">{currentModule.fields.filter(([key])=>!(currentModule.id==='expeditions' && key==='result' && form.data.status==='En curso')).map(([key,label])=><label key={key}>{label}{fieldInput(currentModule,key,label)}{currentModule.id==='planets'&&key==='system_id'&&<small className="field-help">Un planeta debe pertenecer a un sistema. Si no aparece, registra primero el sistema.</small>}{currentModule.id==='resources'&&key==='image_url'&&<small className="field-help">La imagen debe tener una URL accesible para poder importarla y mostrarla en Atlas.</small>}{currentModule.id==='expeditions'&&key==='frigates'&&<small className="field-help">Solo puedes asignar fragatas disponibles, entre 1 y 5 por misión.</small>}{currentModule.id==='expeditions'&&key==='duration'&&<small className="field-help">Introduce horas, minutos y segundos, por ejemplo 04:30:00.</small>}{currentModule.id==='ships'&&key==='status'&&<small className="field-help">Las naves vendidas o destruidas se eliminan tras 7 días desde la fecha indicada.</small>}</label>)}</div></div><div className="modal-footer"><button type="button" className="secondary" onClick={()=>setShowForm(false)}>Cancelar</button><button className="primary" type="submit" disabled={saving}>{saving?'Guardando…':<><Check size={17}/> Guardar registro</>}</button></div></form></div>}
    {confirmDelete && <div className="modal-backdrop confirm-delete-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setConfirmDelete(null)}}><section className="confirm-delete-modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-delete-title"><div className="confirm-delete-icon"><Trash2 size={22}/></div><h2 id="confirm-delete-title">¿Eliminar este registro?</h2><p>Vas a eliminar <strong>“{confirmDelete.name}”</strong>. Esta acción no se puede deshacer.</p><div className="modal-footer"><button type="button" className="secondary" onClick={()=>setConfirmDelete(null)}>Cancelar</button><button type="button" className="delete-confirm-button" onClick={confirmDeleteRecord}>Sí, eliminar</button></div></section></div>}
    {toast && <div className="toast"><Check size={16}/>{toast}<button onClick={()=>setToast('')}><X size={14}/></button></div>}
  </div>;
}

function Overview({records,counts,systems,planets,discoveries,todo,setActive,openNew}) {
  const recent = [...records].sort((a,b)=>new Date(b.updated_at)-new Date(a.updated_at)).slice(0,5);
  const featured = [{label:'Sistemas registrados',value:systems,icon:Globe2,color:'cyan',id:'systems'},{label:'Planetas catalogados',value:planets,icon:Compass,color:'green',id:'planets'},{label:'Flota y vehículos',value:(counts.frigates||0)+(counts.corvettes||0)+(counts.ships||0),icon:Rocket,color:'purple',id:'frigates'},{label:'Descubrimientos',value:discoveries,icon:Sparkles,color:'orange',id:'flora'}];
  return <div className="overview-page"><div className="welcome-row"><div><div className="eyebrow"><span className="pulse"></span> BITÁCORA PERSONAL</div><h1>Tu universo, <em>a tu manera.</em></h1><p>Todo lo que descubres. Todo lo que construyes. En un solo lugar.</p></div><div className="welcome-orb"><div className="orb-ring ring-one"></div><div className="orb-ring ring-two"></div><div className="orb-core"><Sparkles size={29}/></div></div></div>
    <div className="hero-banner"><div className="hero-stars"></div><div className="hero-copy"><span className="hero-kicker"><Zap size={13}/> CENTRO DE MANDO</span><h2>La galaxia es tuya<br/>para descubrirla.</h2><p>Tu progreso empieza con un registro.</p><button className="hero-button" onClick={()=>setActive('systems')}>Explorar mi bitácora <span>↗</span></button></div><div className="hero-planet"><div className="planet-ring"></div><div className="planet"></div><div className="planet-moon"></div></div><div className="hero-coordinate">GALAXIA · REGISTRO PERSONAL</div></div>
    <div className="section-heading"><div><h2>Resumen de tu universo</h2><p>Tu actividad registrada hasta ahora</p></div><span className="section-tag"><Activity size={14}/> EN TIEMPO REAL</span></div>
    <div className="stat-grid">{featured.map(item=>{const Icon=item.icon;return <button key={item.id} className="stat-card" onClick={()=>setActive(item.id)}><div className={`stat-icon ${item.color}`}><Icon size={19}/></div><div className="stat-label">{item.label}</div><div className="stat-bottom"><strong>{item.value}</strong><span>Ver registros <span>↗</span></span></div><div className="stat-line"><i style={{width:item.value?`${Math.min(100,25+item.value*5)}%`:'4%'}}/></div></button>})}</div>
    <div className="overview-lower"><section className="panel-card"><div className="panel-title"><div><h3>Accesos rápidos</h3><p>Registra algo nuevo o continúa tu progreso</p></div><Sparkles size={19}/></div><div className="quick-grid">{[{label:'Sistema estelar',sub:'Nueva ubicación',icon:Globe2,id:'systems'},{label:'Planeta o luna',sub:'Nuevo descubrimiento',icon:Compass,id:'planets'},{label:'Base o asentamiento',sub:'Tu hogar en el espacio',icon:Home,id:'settlements'},{label:'Artículo de inventario',sub:'Controla tus recursos',icon:Boxes,id:'inventory'},{label:'Flora y fauna',sub:'Catalogar especies',icon:PawPrint,id:'fauna'},{label:'Objetivo o guía',sub:'Planifica tu siguiente paso',icon:BookOpen,id:'guide'}].map(q=>{const Icon=q.icon;return <button key={q.id} className="quick-link" onClick={()=>setActive(q.id)}><span className="quick-icon"><Icon size={18}/></span><span><b>{q.label}</b><small>{q.sub}</small></span><span className="quick-arrow">↗</span></button>})}</div></section><section className="panel-card progress-card"><div className="panel-title"><div><h3>Tu progreso</h3><p>Tu universo registrado</p></div><Star size={19}/></div><div className="progress-summary"><div className="progress-number">{records.length}<span> registros</span></div><span className="progress-caption">en tu bitácora</span></div>{[{label:'Exploración',count:(counts.systems||0)+(counts.planets||0),total:100,color:'cyan'},{label:'Flota',count:(counts.frigates||0)+(counts.corvettes||0)+(counts.ships||0),total:100,color:'purple'},{label:'Vida alienígena',count:(counts.flora||0)+(counts.fauna||0),total:100,color:'green'},{label:'Bases',count:counts.settlements||0,total:100,color:'orange'}].map(x=><div className="progress-item" key={x.label}><div><span>{x.label}</span><b>{x.count}</b></div><div className="progress-track"><i className={x.color} style={{width:x.count?`${Math.min(100,x.count*8)}%`:'2%'}}/></div></div>)}<div className="todo-note"><ListTodo size={17}/><span><b>{todo}</b> objetivos o misiones sin completar</span><button onClick={()=>setActive('guide')}>Ver <span>→</span></button></div></section></div>
    <section className="recent-panel panel-card"><div className="panel-title"><div><h3>Últimos registros</h3><p>Lo que has añadido recientemente</p></div><button className="text-button" onClick={()=>setActive('systems')}>Ver bitácora <span>→</span></button></div>{recent.length===0?<div className="recent-empty"><Database size={20}/><span>Tus nuevos registros aparecerán aquí cuando empieces a añadirlos.</span></div>:<div className="recent-list">{recent.map(r=>{const m=modules.find(x=>x.id===r.category);const Icon=m?.icon||Database;return <div className="recent-row" key={r.id}><span className={`recent-icon ${m?.color||'cyan'}`}><Icon size={17}/></span><div className="recent-name"><b>{r.name}</b><small>{m?.label||r.category}</small></div><time>{new Date(r.updated_at).toLocaleDateString('es-ES')}</time><button className="icon-button" onClick={()=>setActive(r.category)}><span>↗</span></button></div>})}</div>}</section>
    <footer className="page-footer"><span>ATLAS · NO MAN'S SKY COMPANION</span><span>Hecho para exploradores <Sparkles size={12}/></span></footer>
  </div>;
}

const expandableCategories = new Set(['systems','planets','bases','settlements','freighters']);
const detailRelations = {
  systems: [
    {title:'Planetas y lunas', category:'planets', match:(item,record)=>item.data?.system_id===record.id},
    {title:'Bases', category:'bases', match:(item,record)=>item.data?.system_id===record.id},
    {title:'Asentamientos', category:'settlements', match:(item,record)=>item.data?.system_id===record.id},
    {title:'Cargueros', category:'freighters', match:(item,record)=>item.data?.system_id===record.id},
  ],
  planets: [
    {title:'Bases', category:'bases', match:(item,record)=>item.data?.planet_id===record.id},
    {title:'Asentamientos', category:'settlements', match:(item,record)=>item.data?.planet_id===record.id},
    {title:'Flora registrada', category:'flora', match:(item,record)=>item.data?.planet_id===record.id},
    {title:'Fauna registrada', category:'fauna', match:(item,record)=>item.data?.planet_id===record.id},
    {title:'Exonaves', category:'exocraft', match:(item,record)=>item.data?.planet_id===record.id},
    {title:'Recursos', category:'resources', match:(item,record)=>item.data?.planet_id===record.id},
    {title:'Puntos de interés', category:'places', match:(item,record)=>item.data?.planet_id===record.id},
  ],
  bases: [],
  settlements: [],
  freighters: [
    {title:'Fragatas', category:'frigates', match:(item,record)=>item.data?.freighter_id===record.id},
  ],
};
function displayDetailValue(value, category, key, records) {
  if (Array.isArray(value)) return value.map(v=>v&&typeof v==='object'?(v.name?`${v.name} (${v.polarity==='negative'?'negativa':'positiva'})`:''):records.find(r=>r.id===v)?.name||v).filter(Boolean).join(', ');
  if (value === null || value === undefined || String(value).trim()==='') return '';
  const relationCategory = relationFields[`${category}.${key}`];
  if (relationCategory) return records.find(r=>r.id===value && r.category===relationCategory)?.name || String(value);
  return String(value);
}
function RecordDetailModal({record,records,onClose,onEdit,onSelect}) {
  const module = modules.find(m=>m.id===record.category);
  const Icon = module?.icon || Database;
  const data = record.data || {};
  const fields = (module?.fields || []).map(([key,label])=>({key,label,value:displayDetailValue(data[key],record.category,key,records)})).filter(x=>x.value);
  const relationItems = (detailRelations[record.category] || []).map(group=>({...group,items:records.filter(item=>item.category===group.category && group.match(item,record))}));
  if(record.category==='freighters') { const frigateIds=new Set(records.filter(item=>item.category==='frigates'&&item.data?.freighter_id===record.id).map(item=>item.id)); relationItems.push({title:'Expediciones de la flota',category:'expeditions',items:records.filter(item=>item.category==='expeditions'&&Array.isArray(item.data?.frigates)&&item.data.frigates.some(id=>frigateIds.has(id)))}); }
  if (record.category==='bases' || record.category==='settlements') {
    relationItems.push({title:'Planeta o luna',category:'planets',items:records.filter(item=>item.id===data.planet_id)});
  }
  const relatedPlanet = ['bases','settlements','resources','flora','fauna','exocraft','places'].includes(record.category) ? records.find(item=>item.id===data.planet_id && item.category==='planets') : null;
  const derivedSystemId = data.system_id || relatedPlanet?.data?.system_id;
  if (['bases','settlements','planets','resources','flora','fauna','exocraft','places'].includes(record.category) && derivedSystemId) {
    relationItems.unshift({title:'Sistema estelar',category:'systems',items:records.filter(item=>item.id===derivedSystemId)});
  }
  const usefulRelations = relationItems.filter(group=>group.items.length>0);
  return <div className="modal-backdrop detail-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
    <section className="record-modal detail-modal" role="dialog" aria-modal="true" aria-label={`Detalles de ${record.name}`}>
      <header className="modal-header detail-modal-header"><div className="detail-title-wrap"><span className={`record-icon ${module?.color||'cyan'}`}><Icon size={21}/></span><div><div className="eyebrow">DETALLE DEL REGISTRO · {module?.label.toUpperCase()}</div><h2>{record.name}</h2></div></div><button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar detalles"><X/></button></header>
      <div className="detail-scroll">
        <section className="detail-section"><div className="detail-section-heading"><h3>Información completa</h3><span>{fields.length} campos registrados</span></div>
          {fields.length ? <div className="detail-fields">{fields.map(field=><div className="detail-field" key={field.key}><span>{field.label}</span><b>{field.value}</b></div>)}</div> : <p className="detail-empty">Todavía no has añadido información adicional a este registro.</p>}
        </section>
        {usefulRelations.length>0 && <section className="detail-section"><div className="detail-section-heading"><h3>Registros relacionados</h3><span>Información conectada</span></div><div className="detail-related-groups">{usefulRelations.map(group=><div className="detail-related-group" key={`${group.category}-${group.title}`}><div className="detail-related-heading"><b>{group.title}</b><span>{group.items.length}</span></div><div className="detail-related-list">{group.items.map(item=>{const relatedModule=modules.find(m=>m.id===item.category);const RelatedIcon=relatedModule?.icon||Database;const isExpandable=expandableCategories.has(item.category);return <button type="button" className="detail-related-item" key={item.id} onClick={()=>isExpandable?onSelect(item):null} disabled={!isExpandable} title={isExpandable?'Abrir detalles':'Registro relacionado'}><span className="detail-related-icon"><RelatedIcon size={15}/></span><span className="detail-related-copy"><b>{item.name}</b><small>{relatedModule?.label || item.category}{item.data?.type?` · ${item.data.type}`:''}{item.data?.class?` · Clase ${item.data.class}`:''}</small></span>{item.category==='frigates' && record.category==='freighters' && <em className={`detail-frigate-status ${records.some(exp=>exp.category==='expeditions'&&exp.data?.status==='En curso'&&Array.isArray(exp.data?.frigates)&&exp.data.frigates.includes(item.id))?'frigate-on-mission':'frigate-available'}`}>{records.some(exp=>exp.category==='expeditions'&&exp.data?.status==='En curso'&&Array.isArray(exp.data?.frigates)&&exp.data.frigates.includes(item.id))?'En misión':'Disponible'}</em>}{isExpandable&&<span className="detail-related-arrow">↗</span>}</button>})}</div></div>)}</div></section>}
        <div className="detail-updated">Última actualización: {record.updated_at?new Date(record.updated_at).toLocaleString('es-ES'):'No disponible'}</div>
      </div>
      <footer className="modal-footer"><button type="button" className="secondary" onClick={onClose}>Cerrar</button><button type="button" className="primary" onClick={onEdit}><Settings2 size={16}/> Editar registro</button></footer>
    </section>
  </div>;
}

function RecordCard({record,module,records=[],clockNow=Date.now(),onOpen,onEdit,onDelete,resolveRelation}) {
  const Icon=module?.icon||Database;
  let entries=Object.entries(record.data||{}).filter(([,v])=>String(v||'').trim()).slice(0,4);
  if(record.category==='planets') entries=['sentinels','biome','resources'].map(key=>[key,record.data?.[key]]).filter(([,v])=>String(v||'').trim());
  if(record.category==='expeditions') entries=['type','frigates','duration','status','result'].map(key=>[key,record.data?.[key]]).filter(([,v])=>String(v||'').trim());
  if(record.category==='frigates') entries=[['type',record.data?.type||record.data?.specialty],['class',record.data?.class],['rank_progress',record.data?.rank_progress]].filter(([,v])=>String(v||'').trim());
  const deficit=record.category==='settlements'?Number(record.data?.productivity||0)-Number(record.data?.maintenance||0):null;
  const shipClass=record.category==='ships'?(record.data?.status==='Vendida'?'ship-sold':record.data?.status==='Destruida'?'ship-destroyed':'ship-owned'):'';
  const settlementClass=record.category==='settlements'?(deficit<0?'settlement-deficit':deficit>0?'settlement-surplus':'settlement-neutral'):'';
  const freighterFrigates=record.category==='freighters'?records.filter(r=>r.category==='frigates'&&r.data?.freighter_id===record.id):[];
  const activeExpeditions=records.filter(r=>r.category==='expeditions'&&r.data?.status==='En curso');
  const busyFrigateIds=new Set(activeExpeditions.flatMap(r=>Array.isArray(r.data?.frigates)?r.data.frigates:[]));
  const pendingFrigateIds=new Set(activeExpeditions.filter(r=>{const p=String(r.data?.duration||'').split(':').map(Number);const ms=((p[0]||0)*3600+(p[1]||0)*60+(p[2]||0))*1000;return ms>0 && new Date(r.data?.started_at||r.updated_at).getTime()+ms<=clockNow;}).flatMap(r=>Array.isArray(r.data?.frigates)?r.data.frigates:[]));
  const settlementCharacteristics=record.category==='settlements'&&Array.isArray(record.data?.characteristics)?record.data.characteristics:[];
  const frigateCharacteristics=record.category==='frigates'&&Array.isArray(record.data?.characteristics)?record.data.characteristics:[];
  const stockShortage=record.category==='inventory'?Number(record.data?.quantity||0)<Number(record.data?.target||0):record.category==='resources'&&Number(record.data?.needed||0)>0&&Number(record.data?.available||0)<Number(record.data?.needed||0);
  return <article className={`record-card record-card-clickable ${shipClass} ${settlementClass} ${record.category==='expeditions'?(record.data?.status==='En curso' && (()=>{const p=String(record.data?.duration||'').split(':').map(Number);const ms=((p[0]||0)*3600+(p[1]||0)*60+(p[2]||0))*1000;return ms>0 && new Date(record.data?.started_at||record.updated_at).getTime()+ms<=clockNow;})()?'expedition-pending-card':record.data?.result==='Exitosa'?'expedition-success':record.data?.result==='Fragatas retiradas'?'expedition-withdrawn':record.data?.result==='Fragatas destruidas'?'expedition-destroyed':''):''} ${stockShortage?'resource-shortage':''}`} tabIndex={0} role="button" aria-label={`Abrir ${record.name}`} onClick={onOpen} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onOpen();}}}>
    <div className="record-card-top"><span className={`record-icon ${module?.color||'cyan'}`}><Icon size={18}/></span><div className="record-actions"><button className="icon-button" onClick={e=>{e.stopPropagation();onEdit();}} title="Editar" aria-label="Editar"><Settings2 size={16}/></button><button className="icon-button danger-hover" onClick={e=>{e.stopPropagation();onDelete();}} title="Eliminar" aria-label="Eliminar"><Trash2 size={16}/></button></div></div>
    {record.category==='resources' && record.data?.image_url && <img className="resource-card-image" src={record.data.image_url} alt={record.name} loading="lazy" onError={e=>{e.currentTarget.style.display='none';}}/>}
    <h3>{record.name}</h3>{record.category==='planets'?<div className="record-category planet-kind">{record.data?.type||'Planeta o luna'}</div>:record.category==='frigates'?<div className="record-category frigate-specialty">Especialista en {(record.data?.type||'sin especialidad').toLocaleLowerCase('es')}</div>:<div className="record-category">{module?.label}</div>}
    {record.category==='ships' && <span className={`ownership-badge ${record.data?.status==='Vendida'?'sold':record.data?.status==='Destruida'?'destroyed':'owned'}`}>{record.data?.status==='Vendida'?'Vendida':record.data?.status==='Destruida'?'Destruida':'En posesión'}</span>}
    {record.category==='settlements' && <div className="settlement-balance"><span>{deficit<0?'Déficit':deficit>0?'Superávit':'Balance diario'}</span><b>{deficit>0?'+':''}{deficit} unidades/día</b></div>}
    {entries.length>0?<div className="record-details">{entries.map(([key,val])=>{const f=module?.fields.find(x=>x[0]===key);const related=Array.isArray(val) ? val.map(item=>item&&typeof item==='object'?(item.name||''):resolveRelation?.(key,item)||item).filter(Boolean).join(', ') : resolveRelation?.(key,val);const shown=related||String(val);const label=f?.[1]||key;return <div key={key}><span>{label}</span><b>{shown.length>100?shown.slice(0,100)+'…':shown}</b></div>})}</div>:<div className="record-no-details">Sin detalles adicionales</div>}
    {record.category==='settlements' && settlementCharacteristics.length>0 && <div className="card-characteristics">{settlementCharacteristics.map((tag,i)=>{const t=typeof tag==='string'?{name:tag,polarity:'positive'}:tag;return <span key={`${t.name}-${i}`} className={t.polarity==='negative'?'negative':'positive'}>{t.name}</span>})}</div>}
    {record.category==='freighters' && freighterFrigates.length>0 && <div className="freighter-frigate-preview"><b>Fragatas ({freighterFrigates.length})</b>{freighterFrigates.map(frigate=><div className="freighter-frigate-row" key={frigate.id}><span>{frigate.name}<small>{frigate.data?.type||'Sin especialidad'}</small></span><em className={pendingFrigateIds.has(frigate.id)?'frigate-pending':busyFrigateIds.has(frigate.id)?'frigate-on-mission':'frigate-available'}>{pendingFrigateIds.has(frigate.id)?'Pendiente':busyFrigateIds.has(frigate.id)?'En misión':'Disponible'}</em></div>)}</div>}
    {record.category==='frigates' && record.data?.captain && <div className="frigate-captain-preview"><span>Capitán</span><b>{record.data.captain}</b></div>}
    {record.category==='frigates' && frigateCharacteristics.length>0 && <div className="card-characteristics">{frigateCharacteristics.map((tag,i)=>{const t=typeof tag==='string'?{name:tag,polarity:'positive'}:tag;return <span key={`${t.name}-${i}`} className={t.polarity==='negative'?'negative-blue':'positive-blue'}>{t.name}</span>})}</div>}
    {record.category==='resources' && Number(record.data?.needed||0)>0 && <div className={`resource-stock-status ${Number(record.data?.available||0)<Number(record.data?.needed||0)?'stock-needed':'stock-satisfied'}`}>{Number(record.data?.available||0)<Number(record.data?.needed||0)?`Faltan ${Number(record.data.needed)-Number(record.data.available||0)}`:'Cantidad necesaria alcanzada'}</div>}
    {record.category==='inventory' && Number(record.data?.target||0)>0 && <div className={`resource-stock-status ${Number(record.data?.quantity||0)<Number(record.data?.target||0)?'stock-needed':'stock-satisfied'}`}>{Number(record.data?.quantity||0)<Number(record.data?.target||0)?`Faltan ${Number(record.data.target)-Number(record.data.quantity||0)}`:'Cantidad objetivo alcanzada'}</div>}
    {record.category==='expeditions' && record.data?.duration && record.data?.status==='En curso' && <div className={`expedition-remaining ${(()=>{const p=String(record.data.duration).split(':').map(Number);const end=new Date(record.data.started_at||record.updated_at).getTime()+((p[0]||0)*3600+(p[1]||0)*60+(p[2]||0))*1000;return end<=clockNow?'expedition-pending':'';})()}`}><span>{(()=>{const p=String(record.data.duration).split(':').map(Number);const end=new Date(record.data.started_at||record.updated_at).getTime()+((p[0]||0)*3600+(p[1]||0)*60+(p[2]||0))*1000;return end<=clockNow?'Expedición pendiente':'Tiempo restante';})()}</span><b>{(()=>{const p=String(record.data.duration).split(':').map(Number);const end=new Date(record.data.started_at||record.updated_at).getTime()+((p[0]||0)*3600+(p[1]||0)*60+(p[2]||0))*1000;const seconds=Math.max(0,Math.floor((end-clockNow)/1000));const h=Math.floor(seconds/3600),m=Math.floor((seconds%3600)/60),sec=seconds%60;return seconds===0?'00:00:00':`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;})()}</b></div>}
    <div className="record-card-footer"><span>Actualizado {new Date(record.updated_at).toLocaleDateString('es-ES')}</span><button onClick={e=>{e.stopPropagation();onEdit();}}>Ver / editar <span>→</span></button></div>
  </article>;
}

function SetupScreen() {
  return <div className="setup-page"><div className="setup-card"><div className="brand-mark"><Sparkles/></div><div className="eyebrow">CONFIGURACIÓN INICIAL</div><h1>Conecta tu universo.</h1><p>La interfaz está preparada. Para activar las cuentas y la sincronización entre dispositivos, conecta un proyecto gratuito de Supabase.</p><ol><li><b>Crea un proyecto</b> en <a href="https://supabase.com" target="_blank" rel="noreferrer">supabase.com</a>.</li><li>En el SQL Editor de Supabase, ejecuta el archivo <code>supabase-schema.sql</code> incluido en este proyecto.</li><li>Copia <b>Project URL</b> y la clave pública <b>anon</b> desde Project Settings → API.</li><li>Copia <code>.env.example</code> como <code>.env</code> y pega ambos valores.</li><li>Ejecuta <code>npm install</code> y <code>npm run dev</code>, o despliega el proyecto en Vercel con las mismas variables.</li></ol><div className="setup-note"><ShieldCheck size={18}/><span>La base de datos incluye reglas de seguridad para que cada cuenta solo pueda leer y modificar sus propios registros.</span></div></div></div>;
}

createRoot(document.getElementById('root')).render(<App />);
