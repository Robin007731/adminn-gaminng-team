import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, updateDoc, increment, onSnapshot, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAh6MqrL2KvhTfeXpEYvRNvKP-6vApMnAg",
    authDomain: "zona-gamer-live.firebaseapp.com",
    projectId: "zona-gamer-live",
    storageBucket: "zona-gamer-live.firebasestorage.app",
    messagingSenderId: "458669601177",
    appId: "1:458669601177:web:9b45b6f259d8b1aa9ee308"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- NAVEGACIÓN ---
window.toggleSidebar = () => document.getElementById('sidebar').classList.toggle('active');
window.showSection = (id) => {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(window.innerWidth < 1000) toggleSidebar();
};

// --- GESTIÓN DE TORNEOS (CRUD) ---
window.publicarTorneo = async () => {
    const id = document.getElementById('edit-id').value || "activo"; // "activo" es el principal
    const nombre = document.getElementById('t-nombre').value;
    if(!nombre) return alert("El nombre es obligatorio");

    await setDoc(doc(db, "tournaments", id), {
        nombre,
        detalles: document.getElementById('t-detalles').value,
        puntos: [
            parseInt(document.getElementById('pts-1').value) || 0,
            parseInt(document.getElementById('pts-2').value) || 0,
            parseInt(document.getElementById('pts-3').value) || 0
        ],
        puntos_extra: parseInt(document.getElementById('pts-participacion').value) || 2,
        fecha: new Date()
    });

    alert(id === "activo" ? "¡Torneo Publicado!" : "¡Torneo Modificado!");
    limpiarFormulario();
};

window.eliminarTorneo = async (id) => {
    if(confirm("¿Seguro que quieres eliminar este torneo?")) {
        await deleteDoc(doc(db, "tournaments", id));
    }
};

window.cargarParaEditar = (data, id) => {
    document.getElementById('edit-id').value = id;
    document.getElementById('t-nombre').value = data.nombre;
    document.getElementById('t-detalles').value = data.detalles;
    document.getElementById('pts-1').value = data.puntos[0];
    document.getElementById('pts-2').value = data.puntos[1];
    document.getElementById('pts-3').value = data.puntos[2];
    document.getElementById('pts-participacion').value = data.puntos_extra;
    
    document.getElementById('btn-main-torneo').innerText = "GUARDAR CAMBIOS";
    document.getElementById('btn-cancel-edit').style.display = "block";
    window.scrollTo(0,0);
};

window.cancelarEdicion = () => limpiarFormulario();

function limpiarFormulario() {
    document.getElementById('edit-id').value = "";
    document.getElementById('t-nombre').value = "";
    document.getElementById('t-detalles').value = "";
    document.getElementById('btn-main-torneo').innerText = "PUBLICAR TORNEO";
    document.getElementById('btn-cancel-edit').style.display = "none";
}

// --- ESCUCHA DE TORNEOS ---
onSnapshot(collection(db, "tournaments"), (snapshot) => {
    const container = document.getElementById('lista-torneos-admin');
    container.innerHTML = "";
    snapshot.forEach(snap => {
        const t = snap.data();
        const id = snap.id;
        const div = document.createElement('div');
        div.className = 't-item';
        div.innerHTML = `
            <span><strong>${t.nombre}</strong></span>
            <div class="t-controls">
                <button onclick='cargarParaEditar(${JSON.stringify(t)}, "${id}")' style="background:var(--warning)">✏️</button>
                <button onclick='eliminarTorneo("${id}")' style="background:var(--danger); color:white">🗑️</button>
            </div>
        `;
        container.appendChild(div);
    });
});

// --- GESTIÓN DE USUARIOS Y PUNTOS ---
const userCache = [];
onSnapshot(collection(db, "users"), (snapshot) => {
    const selects = document.querySelectorAll('.user-list-select');
    const tableStatus = document.getElementById('table-status');
    userCache.length = 0;
    let options = '<option value="">Seleccionar Usuario...</option>';
    tableStatus.innerHTML = "";

    snapshot.forEach(snap => {
        const user = { id: snap.id, ...snap.data() };
        userCache.push(user);
        options += `<option value="${user.id}">${user.username}</option>`;
        tableStatus.innerHTML += `
            <tr>
                <td>${user.username}</td>
                <td><span class="badge ${user.status==='banned'?'status-danger':(user.status==='suspended'?'status-warning':'status-active')}">${user.status || 'active'}</span></td>
                <td>
                    <button onclick="cambiarEstado('${user.id}', 'banned')" style="border:none; cursor:pointer">🚫</button>
                    <button onclick="suspender('${user.id}')" style="border:none; cursor:pointer">⏳</button>
                    <button onclick="cambiarEstado('${user.id}', 'active')" style="border:none; cursor:pointer">✅</button>
                </td>
            </tr>`;
    });
    selects.forEach(s => s.innerHTML = options);
});

window.repartirPuntosGral = async () => {
    const p1 = document.getElementById('sel-p1').value;
    const p2 = document.getElementById('sel-p2').value;
    const p3 = document.getElementById('sel-p3').value;
    const v1 = parseInt(document.getElementById('pts-1').value) || 0;
    const v2 = parseInt(document.getElementById('pts-2').value) || 0;
    const v3 = parseInt(document.getElementById('pts-3').value) || 0;
    const vResto = parseInt(document.getElementById('pts-participacion').value) || 2;

    if(!p1) return alert("Selecciona al menos el ganador.");

    for(let user of userCache) {
        let suma = vResto;
        if(user.id === p1) suma = v1;
        else if(user.id === p2) suma = v2;
        else if(user.id === p3) suma = v3;
        await updateDoc(doc(db, "users", user.id), { points: increment(suma) });
    }
    alert("¡Puntos repartidos!");
};

window.cambiarEstado = async (uid, estado) => {
    await updateDoc(doc(db, "users", uid), { status: estado });
};

window.suspender = async (uid) => {
    const dias = prompt("¿Días de suspensión?");
    if(dias) await updateDoc(doc(db, "users", uid), { status: 'suspended', unlockAt: Date.now() + (dias * 86400000) });
};

window.actualizarPuntosManual = async () => {
    const uid = document.getElementById('sel-edit-user').value;
    const pts = parseInt(document.getElementById('new-points').value);
    if(uid && !isNaN(pts)) await updateDoc(doc(db, "users", uid), { points: pts });
    alert("Puntos actualizados.");
};
