class MaterialBiblioteca {
  constructor(titulo, autor, anioPublicacion) {
    this.titulo = titulo || '';
    this.autor = autor || '';
    this.anioPublicacion = anioPublicacion || '';
    this.disponible = true;
  }

  mostrarInfo() {
    return `${this.titulo} — ${this.autor} (${this.anioPublicacion})`;
  }

  prestar() { this.disponible = false; }
  devolver() { this.disponible = true; }
}

class Libro extends MaterialBiblioteca {
  constructor(titulo, autor, anioPublicacion, numeroPaginas) {
    super(titulo, autor, anioPublicacion);
    this.numeroPaginas = numeroPaginas || 0;
  }

  resumen() {
    return `${this.titulo}: libro de ${this.numeroPaginas} páginas.`;
  }
}

class Revista extends MaterialBiblioteca {
  constructor(titulo, autor, anioPublicacion, numeroEdicion) {
    super(titulo, autor, anioPublicacion);
    this.numeroEdicion = numeroEdicion || '';
  }

  mostrarEdicion() {
    return `Edición ${this.numeroEdicion} (${this.anioPublicacion})`;
  }
}

class VideoEducativo extends MaterialBiblioteca {
  constructor(titulo, autor, anioPublicacion, duracion, tema) {
    super(titulo, autor, anioPublicacion);
    this.duracion = duracion || 0;
    this.tema = tema || '';
  }

  reproducir() {
    return `Reproduciendo "${this.titulo}" — tema: ${this.tema} (${this.duracion} min)`;
  }
}

class Usuario {
  constructor(nombre, idUsuario) {
    this.nombre = nombre || '';
    this.idUsuario = idUsuario || '';
    this.materialPrestado = [];
    this.historial = [];
  }

  prestarMaterial(material) {
    if (!material || !material.disponible) return { success: false, message: 'Material no disponible' };
    material.prestar();
    this.materialPrestado.push(material);
    this.historial.push({ titulo: material.titulo, fecha: new Date().toISOString(), accion: 'prestado' });
    return { success: true };
  }

  devolverMaterial(material) {
    const idx = this.materialPrestado.indexOf(material);
    if (idx === -1) return { success: false, message: 'Usuario no tiene ese material prestado' };
    this.materialPrestado.splice(idx, 1);
    material.devolver();
    this.historial.push({ titulo: material.titulo, fecha: new Date().toISOString(), accion: 'devuelto' });
    return { success: true };
  }

  mostrarHistorial() {
    return this.historial.map(h => `${h.fecha.split('T')[0]} — ${h.accion}: ${h.titulo}`);
  }
}

class Biblioteca {
  constructor() {
    this.materiales = [];
    this.usuarios = [];
  }

  agregarMaterial(material) {
    if (!material || !material.titulo) return { success: false, message: 'Material inválido' };
    this.materiales.push(material);
    return { success: true };
  }

  buscarMaterial(titulo) {
    if (!titulo && titulo !== 0) return null;
    const t = String(titulo).trim().toLowerCase();
    return this.materiales.find(m => String(m.titulo || '').trim().toLowerCase() === t) || null;
  }

  listarMateriales() {
    return this.materiales.slice();
  }

  registrarUsuario(usuario) {
    if (!usuario || (usuario.idUsuario === undefined || usuario.idUsuario === null)) return { success: false, message: 'Usuario inválido' };
    usuario.idUsuario = String(usuario.idUsuario).trim();
    if (this.buscarUsuario(usuario.idUsuario)) return { success: false, message: 'Usuario ya registrado' };
    this.usuarios.push(usuario);
    return { success: true };
  }

  buscarUsuario(idUsuario) {
    if (idUsuario === undefined || idUsuario === null) return null;
    const id = String(idUsuario).trim();
    return this.usuarios.find(u => String(u.idUsuario).trim() === id) || null;
  }

  prestar(titulo, idUsuario) {
    const material = this.buscarMaterial(titulo);
    if (!material) return { success: false, message: 'Material no encontrado' };
    const usuario = this.buscarUsuario(idUsuario);
    if (!usuario) return { success: false, message: 'Usuario no encontrado' };
    return usuario.prestarMaterial(material);
  }

  devolver(titulo, idUsuario) {
    const material = this.buscarMaterial(titulo);
    if (!material) return { success: false, message: 'Material no encontrado' };
    const usuario = this.buscarUsuario(idUsuario);
    if (!usuario) return { success: false, message: 'Usuario no encontrado' };
    return usuario.devolverMaterial(material);
  }
}

(function () {
  const fab = document.createElement('button');
  fab.className = 'fab-add';
  fab.title = 'Agregar material';
  fab.innerHTML = '<i class="fa-solid fa-plus"></i>';
  fab.addEventListener('click', () => {
    const title = document.getElementById('uiMatTitulo');
    if (title) {
      title.focus();
      window.scrollTo({ top: title.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
    }
  });
  document.body.appendChild(fab);
})();

(function () {
  const ejemploMateriales = [
    new Libro('El Principito', 'Antoine de Saint-Exupéry', 1943, 96),
    new Libro('Cien Años de Soledad', 'Gabriel García Márquez', 1967, 417),
    new Revista('National Geographic - Viajes', 'Varios', 2021, 'Ed. 34'),
    new VideoEducativo('Introducción a JavaScript', 'MDN', 2021, 45, 'Programación'),
    new VideoEducativo('Física para todos', 'CanalEducativo', 2019, 60, 'Ciencia')
  ];

  const ejemploUsuarios = [
    new Usuario('María', 101),
    new Usuario('Carlos', 102),
    new Usuario('Lucía', 103)
  ];

  const bibliotecaDemo = new Biblioteca();

  function renderMateriales() {
    const cont = document.getElementById('uiMateriales');
    if (!cont) return;
    const list = arguments[0] || bibliotecaDemo.listarMateriales();
    const html = list.map(m => {
      const tipo = m instanceof Libro ? 'Libro' : (m instanceof Revista ? 'Revista' : 'Video educativo');
      let extra = '';
      if (m instanceof Libro) extra = `Páginas: ${m.numeroPaginas}`;
      if (m instanceof Revista) extra = `Edición: ${m.numeroEdicion}`;
      if (m instanceof VideoEducativo) extra = `Duración: ${m.duracion} min — Tema: ${m.tema}`;
      const disponible = m.disponible ? 'Disponible' : 'Prestado';
      return `
        <div class="card mb-3">
          <div class="card-content">
            <p class="title is-6">${m.titulo}</p>
            <p class="subtitle is-7">${m.autor} — ${m.anioPublicacion} <span class="muted">(${tipo})</span></p>
            <p class="small-muted">${extra} — <strong>${disponible}</strong></p>
          </div>
        </div>`;
    }).join('');
    cont.innerHTML = html || '<p class="muted">No hay materiales.</p>';
  }

  function renderUsuarios() {
    const left = document.getElementById('usuariosList');
    const right = document.getElementById('uiUsuarios');
    const html = bibliotecaDemo.usuarios.map(u => {
      const prestamos = u.materialPrestado.map(p => p.titulo).join(', ') || '—';
      return `
        <div class="box">
          <strong>${u.nombre}</strong> <span class="muted">(ID ${u.idUsuario})</span>
          <div class="small-muted">Prestados: ${prestamos}</div>
        </div>`;
    }).join('');
    if (left) left.innerHTML = html || '<p class="muted">No hay usuarios registrados.</p>';
    if (right) right.innerHTML = html || '<p class="muted">No hay usuarios registrados.</p>';
  }

  // Cargar datos y renderizar al cargar la página 
  document.addEventListener('DOMContentLoaded', () => {
    ejemploMateriales.forEach(m => bibliotecaDemo.agregarMaterial(m));
    ejemploUsuarios.forEach(u => bibliotecaDemo.registrarUsuario(u));
    // Préstamos precargados para mostrar estado 
    bibliotecaDemo.prestar('El Principito', 101);
    bibliotecaDemo.prestar('Introducción a JavaScript', 102);
    renderMateriales();
    renderUsuarios();

    // Registrar usuario
    const btnAddUsr = document.getElementById('uiAddUsr');
    if (btnAddUsr) btnAddUsr.addEventListener('click', () => {
      const nombre = document.getElementById('uiUsrNombre')?.value || '';
      const id = document.getElementById('uiUsrId')?.value || '';
      const res = bibliotecaDemo.registrarUsuario(new Usuario(nombre, id));
      const uiMsgUsr = document.getElementById('uiMsgUsr');
      if (!res.success) { if (uiMsgUsr) uiMsgUsr.textContent = res.message; return; }
      if (uiMsgUsr) uiMsgUsr.textContent = 'Usuario registrado';
      renderUsuarios();
    });

    // Agregar material
    const btnAddMat = document.getElementById('uiAddMat');
    if (btnAddMat) btnAddMat.addEventListener('click', () => {
      const tipo = document.getElementById('uiMatTipo')?.value || 'Libro';
      const titulo = document.getElementById('uiMatTitulo')?.value || '';
      const autor = document.getElementById('uiMatAutor')?.value || '';
      const anio = document.getElementById('uiMatAnio')?.value || '';
      let mat;
      if (tipo === 'Libro') {
        const paginas = document.getElementById('uiMatPaginas')?.value || 0;
        mat = new Libro(titulo, autor, anio, Number(paginas));
      } else if (tipo === 'Revista') {
        const ed = document.getElementById('uiMatEdicion')?.value || '';
        mat = new Revista(titulo, autor, anio, ed);
      } else {
        const dur = document.getElementById('uiMatDuracion')?.value || 0;
        const tema = document.getElementById('uiMatTema')?.value || '';
        mat = new VideoEducativo(titulo, autor, anio, Number(dur), tema);
      }
      const res = bibliotecaDemo.agregarMaterial(mat);
      const uiMsgMat = document.getElementById('uiMsgMat');
      if (!res.success) { if (uiMsgMat) uiMsgMat.textContent = res.message; return; }
      if (uiMsgMat) uiMsgMat.textContent = 'Material agregado';
      renderMateriales();
    });

    // Prestar / Devolver
    const btnPrestar = document.getElementById('uiPrestar');
    const btnDevolver = document.getElementById('uiDevolver');
    if (btnPrestar) btnPrestar.addEventListener('click', () => {
      const id = document.getElementById('uiOpUsr')?.value || '';
      const titulo = document.getElementById('uiOpTitulo')?.value || '';
      const res = bibliotecaDemo.prestar(titulo, id);
      document.getElementById('uiOpMsg').textContent = res.success ? 'Préstamo ok' : res.message;
      renderMateriales(); renderUsuarios();
    });
    if (btnDevolver) btnDevolver.addEventListener('click', () => {
      const id = document.getElementById('uiOpUsr')?.value || '';
      const titulo = document.getElementById('uiOpTitulo')?.value || '';
      const res = bibliotecaDemo.devolver(titulo, id);
      document.getElementById('uiOpMsg').textContent = res.success ? 'Devolución ok' : res.message;
      renderMateriales(); renderUsuarios();
    });

    // Buscar
    const btnBuscar = document.getElementById('uiBuscarBtn');
    if (btnBuscar) btnBuscar.addEventListener('click', () => {
      const q = (document.getElementById('uiBuscar')?.value || '').trim().toLowerCase();
      if (!q) return renderMateriales();
      const results = bibliotecaDemo.listarMateriales().filter(m => {
        return String(m.titulo || '').toLowerCase().includes(q) || String(m.autor || '').toLowerCase().includes(q);
      });
      renderMateriales(results);
    });

    // Historial
    const btnHist = document.getElementById('btnHist');
    if (btnHist) btnHist.addEventListener('click', () => {
      const id = document.getElementById('histUsr')?.value || '';
      const u = bibliotecaDemo.buscarUsuario(id);
      const list = document.getElementById('histList');
      if (!u) return list.innerHTML = '<p class="muted">Usuario no encontrado</p>';
      const html = u.mostrarHistorial().map(l => `<div>${l}</div>`).join('') || '<div class="muted">Sin historial</div>';
      list.innerHTML = html;
    });

    // Cargar ejemplo 
    const seedBtn = document.getElementById('uiSeed');
    if (seedBtn) seedBtn.addEventListener('click', () => {
      ejemploMateriales.forEach(m => bibliotecaDemo.agregarMaterial(m));
      ejemploUsuarios.forEach(u => {
        if (!bibliotecaDemo.buscarUsuario(u.idUsuario)) bibliotecaDemo.registrarUsuario(new Usuario(u.nombre, u.idUsuario));
      });
      renderMateriales(); renderUsuarios();
    });
  });

})();


