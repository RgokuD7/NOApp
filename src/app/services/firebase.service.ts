import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  collection,
  collectionData,
  query,
} from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { UtilsService } from './utils.service';
import { addDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilSvc = inject(UtilsService);

  getAuth() {
    return getAuth();
  }

  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  async signOut() {
    await getAuth().signOut();
    this.utilSvc.removeFromLocalStorage('user');
    this.utilSvc.routerLink('auth');
  }

  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  sendRecoberyEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  //*Database

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  getCollectionData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), { idField: 'id' });
  }

  //* Create Species

  async setSpecies() {
    this.species.forEach((specie, index) => {
      let path = `species/${index+1}`;
      this.setDocument(path, specie)
        .then((resp) => {
          console.log(resp);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  //* Create Regions 

  async setRegiones() {
    this.regions.forEach((region, index) => {
      let path = `regions/${index+1}`;
      this.setDocument(path, region)
        .then((resp) => {
          console.log(resp);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  regions = [
    {
      region: 'Arica y Parinacota',
      comunas: ['Arica', 'Camarones', 'Putre', 'General Lagos'],
    },
    {
      region: 'Tarapacá',
      comunas: [
        'Iquique',
        'Alto Hospicio',
        'Pozo Almonte',
        'Camiña',
        'Colchane',
        'Huara',
        'Pica',
      ],
    },
    {
      region: 'Antofagasta',
      comunas: [
        'Antofagasta',
        'Mejillones',
        'Sierra Gorda',
        'Taltal',
        'Calama',
        'Ollagüe',
        'San Pedro de Atacama',
        'Tocopilla',
        'María Elena',
      ],
    },
    {
      region: 'Atacama',
      comunas: [
        'Copiapó',
        'Caldera',
        'Tierra Amarilla',
        'Chañaral',
        'Diego de Almagro',
        'Vallenar',
        'Alto del Carmen',
        'Freirina',
        'Huasco',
      ],
    },
    {
      region: 'Coquimbo',
      comunas: [
        'La Serena',
        'Coquimbo',
        'Andacollo',
        'La Higuera',
        'Paiguano',
        'Vicuña',
        'Illapel',
        'Canela',
        'Los Vilos',
        'Salamanca',
        'Ovalle',
        'Combarbalá',
        'Monte Patria',
        'Punitaqui',
        'Río Hurtado',
      ],
    },
    {
      region: 'Valparaíso',
      comunas: [
        'Valparaíso',
        'Casablanca',
        'Concón',
        'Juan Fernández',
        'Puchuncaví',
        'Quintero',
        'Viña del Mar',
        'Isla de Pascua',
        'Los Andes',
        'Calle Larga',
        'Rinconada',
        'San Esteban',
        'La Ligua',
        'Cabildo',
        'Papudo',
        'Petorca',
        'Zapallar',
        'Quillota',
        'Calera',
        'Hijuelas',
        'La Cruz',
        'Nogales',
        'San Antonio',
        'Algarrobo',
        'Cartagena',
        'El Quisco',
        'El Tabo',
        'Santo Domingo',
        'San Felipe',
        'Catemu',
        'Llaillay',
        'Panquehue',
        'Putaendo',
        'Santa María',
        'Quilpué',
        'Limache',
        'Olmué',
        'Villa Alemana',
      ],
    },
    {
      region: 'Región del Libertador Gral. Bernardo O’Higgins',
      comunas: [
        'Rancagua',
        'Codegua',
        'Coinco',
        'Coltauco',
        'Doñihue',
        'Graneros',
        'Las Cabras',
        'Machalí',
        'Malloa',
        'Mostazal',
        'Olivar',
        'Peumo',
        'Pichidegua',
        'Quinta de Tilcoco',
        'Rengo',
        'Requínoa',
        'San Vicente',
        'Pichilemu',
        'La Estrella',
        'Litueche',
        'Marchihue',
        'Navidad',
        'Paredones',
        'San Fernando',
        'Chépica',
        'Chimbarongo',
        'Lolol',
        'Nancagua',
        'Palmilla',
        'Peralillo',
        'Placilla',
        'Pumanque',
        'Santa Cruz',
      ],
    },
    {
      region: 'Región del Maule',
      comunas: [
        'Talca',
        'Constitución',
        'Curepto',
        'Empedrado',
        'Maule',
        'Pelarco',
        'Pencahue',
        'Río Claro',
        'San Clemente',
        'San Rafael',
        'Cauquenes',
        'Chanco',
        'Pelluhue',
        'Curicó',
        'Hualañé',
        'Licantén',
        'Molina',
        'Rauco',
        'Romeral',
        'Sagrada Familia',
        'Teno',
        'Vichuquén',
        'Linares',
        'Colbún',
        'Longaví',
        'Parral',
        'Retiro',
        'San Javier',
        'Villa Alegre',
        'Yerbas Buenas',
      ],
    },
    {
      region: 'Región de Ñuble',
      comunas: [
        'Cobquecura',
        'Coelemu',
        'Ninhue',
        'Portezuelo',
        'Quirihue',
        'Ránquil',
        'Treguaco',
        'Bulnes',
        'Chillán Viejo',
        'Chillán',
        'El Carmen',
        'Pemuco',
        'Pinto',
        'Quillón',
        'San Ignacio',
        'Yungay',
        'Coihueco',
        'Ñiquén',
        'San Carlos',
        'San Fabián',
        'San Nicolás',
      ],
    },
    {
      region: 'Región del Biobío',
      comunas: [
        'Concepción',
        'Coronel',
        'Chiguayante',
        'Florida',
        'Hualqui',
        'Lota',
        'Penco',
        'San Pedro de la Paz',
        'Santa Juana',
        'Talcahuano',
        'Tomé',
        'Hualpén',
        'Lebu',
        'Arauco',
        'Cañete',
        'Contulmo',
        'Curanilahue',
        'Los Álamos',
        'Tirúa',
        'Los Ángeles',
        'Antuco',
        'Cabrero',
        'Laja',
        'Mulchén',
        'Nacimiento',
        'Negrete',
        'Quilaco',
        'Quilleco',
        'San Rosendo',
        'Santa Bárbara',
        'Tucapel',
        'Yumbel',
        'Alto Biobío',
      ],
    },
    {
      region: 'Región de la Araucanía',
      comunas: [
        'Temuco',
        'Carahue',
        'Cunco',
        'Curarrehue',
        'Freire',
        'Galvarino',
        'Gorbea',
        'Lautaro',
        'Loncoche',
        'Melipeuco',
        'Nueva Imperial',
        'Padre las Casas',
        'Perquenco',
        'Pitrufquén',
        'Pucón',
        'Saavedra',
        'Teodoro Schmidt',
        'Toltén',
        'Vilcún',
        'Villarrica',
        'Cholchol',
        'Angol',
        'Collipulli',
        'Curacautín',
        'Ercilla',
        'Lonquimay',
        'Los Sauces',
        'Lumaco',
        'Purén',
        'Renaico',
        'Traiguén',
        'Victoria',
      ],
    },
    {
      region: 'Región de Los Ríos',
      comunas: [
        'Valdivia',
        'Corral',
        'Lanco',
        'Los Lagos',
        'Máfil',
        'Mariquina',
        'Paillaco',
        'Panguipulli',
        'La Unión',
        'Futrono',
        'Lago Ranco',
        'Río Bueno',
      ],
    },
    {
      region: 'Región de Los Lagos',
      comunas: [
        'Puerto Montt',
        'Calbuco',
        'Cochamó',
        'Fresia',
        'Frutillar',
        'Los Muermos',
        'Llanquihue',
        'Maullín',
        'Puerto Varas',
        'Castro',
        'Ancud',
        'Chonchi',
        'Curaco de Vélez',
        'Dalcahue',
        'Puqueldón',
        'Queilén',
        'Quellón',
        'Quemchi',
        'Quinchao',
        'Osorno',
        'Puerto Octay',
        'Purranque',
        'Puyehue',
        'Río Negro',
        'San Juan de la Costa',
        'San Pablo',
        'Chaitén',
        'Futaleufú',
        'Hualaihué',
        'Palena',
      ],
    },
    {
      region: 'Región Aisén del Gral. Carlos Ibáñez del Campo',
      comunas: [
        'Coihaique',
        'Lago Verde',
        'Aisén',
        'Cisnes',
        'Guaitecas',
        'Cochrane',
        'O’Higgins',
        'Tortel',
        'Chile Chico',
        'Río Ibáñez',
      ],
    },
    {
      region: 'Región de Magallanes y de la Antártica Chilena',
      comunas: [
        'Punta Arenas',
        'Laguna Blanca',
        'Río Verde',
        'San Gregorio',
        'Cabo de Hornos (Ex Navarino)',
        'Antártica',
        'Porvenir',
        'Primavera',
        'Timaukel',
        'Natales',
        'Torres del Paine',
      ],
    },
    {
      region: 'Región Metropolitana de Santiago',
      comunas: [
        'Cerrillos',
        'Cerro Navia',
        'Conchalí',
        'El Bosque',
        'Estación Central',
        'Huechuraba',
        'Independencia',
        'La Cisterna',
        'La Florida',
        'La Granja',
        'La Pintana',
        'La Reina',
        'Las Condes',
        'Lo Barnechea',
        'Lo Espejo',
        'Lo Prado',
        'Macul',
        'Maipú',
        'Ñuñoa',
        'Pedro Aguirre Cerda',
        'Peñalolén',
        'Providencia',
        'Pudahuel',
        'Quilicura',
        'Quinta Normal',
        'Recoleta',
        'Renca',
        'Santiago',
        'San Joaquín',
        'San Miguel',
        'San Ramón',
        'Vitacura',
        'Puente Alto',
        'Pirque',
        'San José de Maipo',
        'Colina',
        'Lampa',
        'Tiltil',
        'San Bernardo',
        'Buin',
        'Calera de Tango',
        'Paine',
        'Melipilla',
        'Alhué',
        'Curacaví',
        'María Pinto',
        'San Pedro',
        'Talagante',
        'El Monte',
        'Isla de Maipo',
        'Padre Hurtado',
        'Peñaflor',
      ],
    },
  ];

  species = [
    { specie: 'Perro' },
    { specie: 'Gato' },
    { specie: 'Conejo' },
    { specie: 'Hamster' },
    { specie: 'Pájaro' },
    { specie: 'Tortuga' },
    { specie: 'Pez' },
    { specie: 'Cobaya' },
    { specie: 'Hurón' },
    { specie: 'Erizo' },
    { specie: 'Iguana' }
  ];

  
}
