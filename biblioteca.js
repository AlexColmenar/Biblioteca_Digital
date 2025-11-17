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
    return this.materiales.find(m => m.titulo === titulo) || null;
  }

  listarMateriales() {
    return this.materiales.slice();
  }

  registrarUsuario(usuario) {
    if (!usuario || !usuario.idUsuario) return { success: false, message: 'Usuario inválido' };
    if (this.buscarUsuario(usuario.idUsuario)) return { success: false, message: 'Usuario ya registrado' };
    this.usuarios.push(usuario);
    return { success: true };
  }

  buscarUsuario(idUsuario) {
    return this.usuarios.find(u => u.idUsuario === idUsuario) || null;
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
    const html = bibliotecaDemo.listarMateriales().map(m => {
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
  });

})();


