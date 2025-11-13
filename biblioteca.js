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



document.addEventListener('DOMContentLoaded', () => {
  const topImport = document.getElementById('fileImportTop');
  if (topImport) topImport.addEventListener('change', (e) => {
    const f = e.target.files?.[0];
    const target = document.getElementById('fileImport');
    if (f && target) {
      target.files = e.target.files;
      target.dispatchEvent(new Event('change'));
    }
  });

  const topExport = document.getElementById('btnExportTop');
  if (topExport) topExport.addEventListener('click', () => {
    const btn = document.getElementById('btnExport');
    btn && btn.click();
  });
});

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


